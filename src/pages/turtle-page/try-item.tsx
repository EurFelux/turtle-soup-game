import {
	CheckCircleIcon,
	HelpCircleIcon,
	TriangleAlertIcon,
	XCircleIcon,
} from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Try } from "@/types";

type TryItemProps = {
	tryRecord: Try;
};

const TryItem = ({ tryRecord }: TryItemProps) => {
	const isValid = tryRecord.status === "valid";

	const icon = useMemo(() => {
		if (!isValid) {
			return (
				<TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-warning" />
			);
		} else {
			switch (tryRecord.response) {
				case "yes":
					return (
						<CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-success" />
					);
				case "no":
					return (
						<XCircleIcon className="mt-0.5 size-4 shrink-0 text-destructive" />
					);
				case "unrelated":
					return (
						<HelpCircleIcon className="mt-0.5 size-4 shrink-0 text-info" />
					);
			}
		}
	}, [isValid, tryRecord]);

	return (
		<li
			className={cn(
				"min-h-10 w-full cursor-pointer rounded-lg p-2",
				"hover:bg-secondary-hover",
			)}
		>
			<div className="flex items-start gap-2">
				{icon}
				<div className="min-w-0 flex-1">
					<p className="truncate font-medium text-sm">{tryRecord.question}</p>
					{isValid && (
						<p className="mt-0.5 text-xs opacity-70">
							{tryRecord.response === "yes" && "✓ Yes"}
							{tryRecord.response === "no" && "✗ No"}
							{tryRecord.response === "unrelated" && "? Unrelated"}
						</p>
					)}
					{!isValid && (
						<p className="mt-0.5 truncate text-xs opacity-70">
							{tryRecord.reason}
						</p>
					)}
				</div>
			</div>
		</li>
	);
};

export default TryItem;
