"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Accordion } from "@/components/ui/accordion";
import { useMemo } from "react";
import { NavItem, Organization } from "./../_components/nav-item";

interface SidebarProps {
	storageKey?: string;
}

export const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
	const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(storageKey, {});

	const {
		organization: activeOrganization,
		isLoaded: isLoadedOrg
	} = useOrganization();

	const {
		userMemberships,
		isLoaded: isLoadedOrgList
	} = useOrganizationList({
		userMemberships: {
			infinite: true,
		}
	});

	const accordionItems = useMemo(() => {
		if (userMemberships.data) {
			const onExpand = (id: string) => {
				setExpanded((prevState) => ({
					...prevState,
					[id]: !expanded[id]
				}))
			}

			return userMemberships.data.map(({organization}) => {
				return (
					<NavItem
						isActive={activeOrganization?.id === organization.id}
						isExpanded={expanded[organization.id]}
						organization={organization as Organization}
						onExpand={onExpand}
						key={organization.id}
					/>
				)
			})
		}
	}, [activeOrganization?.id, expanded, setExpanded, userMemberships?.data])

	const defaultAccordionValue: string[] = Object.keys(expanded)
		.reduce((acc: string[], key: string) => {
			if (expanded[key]) {
				acc.push(key)
			}
		return acc;
	}, []);


	if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
		return (
			<>
				<Skeleton/>
			</>
		)
	}


	return (
		<>
			<div className="font-medium text-xs flex items-center mb-1">
				<span className="pl-4">Workspaces</span>
				<Button
					asChild
					type="button"
					size="icon"
					variant="ghost"
					className="ml-auto"
				>
					<Link href="/select-org">
						<Plus
							className="h-4 w-4"
						/>
					</Link>
				</Button>
			</div>
			<Accordion
				type="multiple"
				defaultValue={defaultAccordionValue}
				className="space-y-2"
			>
				{ accordionItems }
			</Accordion>
		</>
	)


}
