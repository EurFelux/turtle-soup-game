import { XCircleIcon } from "lucide-react";
import { useMemo } from "react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { Soup } from "@/types";
import SoupItem from "./soup-item";

type SoupsListProps = {
	// Take undefined as loading
	soups: Soup[] | undefined;
	error: unknown;
	activeSoupId: string | null;
	setActiveSoupId: (id: string | null) => void;
};

const SoupList = ({
	soups,
	error,
	activeSoupId,
	setActiveSoupId,
}: SoupsListProps) => {
	const content = useMemo(() => {
		if (soups === undefined) {
			return (
				<>
					<li>
						<Skeleton className="h-5 w-full" />
					</li>
					<li>
						<Skeleton className="h-5 w-full" />
					</li>
					<li>
						<Skeleton className="h-5 w-full" />
					</li>
					<li>
						<Skeleton className="h-5 w-full" />
					</li>
				</>
			);
		} else {
			return soups.map((soup: Soup) => (
				<SoupItem
					key={soup.id}
					soup={soup}
					active={activeSoupId === soup.id}
					onClick={() => setActiveSoupId(soup.id)}
				></SoupItem>
			));
		}
	}, [activeSoupId, setActiveSoupId, soups]);

	if (error) {
		return (
			<Alert className="w-full">
				<XCircleIcon className="size-5 text-destructive" />
				Something is wrong: {String(error)}
			</Alert>
		);
	}

	return (
		<ul className="flex h-full flex-col gap-1.5 rounded-lg bg-secondary p-4">
			{content}
		</ul>
	);
};

export default SoupList;
