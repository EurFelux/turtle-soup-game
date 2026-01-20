import { cn } from "@/lib/utils";
import type { Soup } from "@/types";

type SoupItemProps = {
	soup: Soup;
	active: boolean;
	onClick: () => void;
};

const SoupItem = ({ soup, active, onClick }: SoupItemProps) => {
	return (
		<li
			className={cn(
				"h-10 w-full cursor-pointer truncate rounded-lg p-2 transition-colors",
				"hover:bg-secondary-hover",
				active && "bg-primary text-primary-foreground hover:bg-primary-hover",
			)}
			onClick={onClick}
		>
			{soup.title}
		</li>
	);
};

export default SoupItem;
