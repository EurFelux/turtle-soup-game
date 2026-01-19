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
			className={cn("h-5 w-full truncate", active && "bg-gray-200")}
			onClick={onClick}
		>
			{soup.title}
		</li>
	);
};

export default SoupItem;
