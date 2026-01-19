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
				<XCircleIcon className="size-5 text-red-500" />
				Something is wrong.
			</Alert>
		);
	}

	return (
		<div className="" role="list">
			{content}
		</div>
	);
};

export default SoupList;
