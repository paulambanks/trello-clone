"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {auth} from "@clerk/nextjs";

import { createSafeAction } from "@/lib/create-safe-action";
import { InputType, ReturnType } from "./types";
import { CreateBoard } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return {
			error: "Unauthorized",
		}
	}

	const {title, image} = data;

	const [
		imageId,
		imageThumbUrl,
		imageFullUrl,
		imageLinkHTML,
		imageUserName
	] = image.split("|");

	if (!imageId || !imageFullUrl || !imageThumbUrl || !imageLinkHTML || !imageUserName) {
		return {
			error: "Missing image fields. Failed to create board",
		}
	}

	let board;
	try {
		board = await db.board.create({
			data: {
				title,
				orgId,
				imageId,
				imageThumbUrl,
				imageFullUrl,
				imageLinkHTML,
				imageUserName
			}
		});
	} catch(error) {
		return {
			error: "Database error"
		}
	}
	revalidatePath(`/board/${board.id}`);

	return {data: board}
}

export const createBoard = createSafeAction(CreateBoard, handler);
