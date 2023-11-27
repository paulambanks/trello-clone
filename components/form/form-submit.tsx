"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

interface FormSubmitProps {
	children: React.ReactNode;
	disabled?: boolean;
	className?: string;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary";
}

export const FormSubmit = ({
	children,
	disabled,
	className,
	variant
}: FormSubmitProps) => {
	const {pending} = useFormStatus();
	return (
		<Button
			disabled={pending || disabled}
			type="submit"
			size="sm"
			variant={variant}
			className={cn(className)}
		>
			{children}
		</Button>
	)
}
