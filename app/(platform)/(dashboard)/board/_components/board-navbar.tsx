import {Board } from "@prisma/client"

interface BoardNavbarProps {
	data: Board
}

export const BoardNavbar = ({
	data: Board
}: BoardNavbarProps) => {
	return (
		<div>
			Board Navbar!
		</div>
	)
}
