import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Soup } from "@/types";

type SoupItemProps = {
	soup: Soup;
	active: boolean;
	onClick: () => void;
};

const SoupItem = ({ soup, active, onClick }: SoupItemProps) => {
	const getStatusIcon = () => {
		const iconClassName = cn(
			"size-4 shrink-0",
			active && "text-primary-foreground",
		);

		if (soup.status === "resolved") {
			return (
				<CheckCircle2
					className={cn(iconClassName, !active && "text-success")}
				/>
			);
		}
		if (soup.status === "given_up") {
			return (
				<XCircle className={cn(iconClassName, !active && "text-warning")} />
			);
		}
		return (
			<Circle
				className={cn(iconClassName, !active && "text-muted-foreground")}
			/>
		);
	};

	return (
		<li
			className={cn(
				"flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors",
				"hover:bg-secondary-hover",
				active && "bg-primary text-primary-foreground hover:bg-primary-hover",
				soup.status === "resolved" && !active && "border-success border-l-2",
				soup.status === "given_up" && !active && "border-warning border-l-2",
			)}
			onClick={onClick}
		>
			{getStatusIcon()}
			<span className="truncate">{soup.title}</span>
		</li>
	);
};

export default SoupItem;
