import type { Soup } from "@/types";

type SoupItemProps = {
	soup: Soup;
};

const SoupItem = ({ soup }: SoupItemProps) => {
	return <li className="h-5 w-full truncate">{soup.title}</li>;
};

export default SoupItem;
