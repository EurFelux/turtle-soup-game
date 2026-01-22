import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { Soup } from "@/types";

type SoupItemProps = {
	soup: Soup;
	active: boolean;
	onClick: () => void;
};

const SoupItem = ({ soup, active, onClick }: SoupItemProps) => {
	const { t } = useTranslation();

	const getStatusIcon = () => {
		const iconClassName = cn(
			"size-4 shrink-0",
			active && "text-primary-foreground",
		);

		switch (soup.status) {
			case "creating":
				return <Spinner className={iconClassName} />;
			case "resolved":
				return (
					<CheckCircle2
						className={cn(iconClassName, !active && "text-success")}
					/>
				);
			case "given_up":
				return (
					<XCircle className={cn(iconClassName, !active && "text-warning")} />
				);
			case "unresolved":
				return (
					<Circle
						className={cn(iconClassName, !active && "text-muted-foreground")}
					/>
				);
		}
	};

	const isCreating = soup.status === "creating";

	const title = isCreating ? t("soup.status.creating") : soup.title;

	return (
		<li
			className={cn(
				"flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors",
				"hover:bg-secondary-hover",
				active && "bg-primary text-primary-foreground hover:bg-primary-hover",
				soup.status === "resolved" && !active && "border-success border-l-2",
				soup.status === "given_up" && !active && "border-warning border-l-2",
				isCreating && "animate-pulse",
			)}
			onClick={onClick}
		>
			{getStatusIcon()}
			<span className="truncate">{title}</span>
		</li>
	);
};

export default SoupItem;
