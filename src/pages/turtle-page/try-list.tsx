import { XCircleIcon } from "lucide-react";
import { useMemo } from "react";
import { Alert } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { Try } from "@/types";
import TryItem from "./try-item";

type TryListProps = {
	// Take undefined as loading
	tries: Try[] | undefined;
	error: unknown;
};

const TryList = ({ tries, error }: TryListProps) => {
	const sortedTries = useMemo(() => {
		if (!tries) return undefined;
		// Sort by createAt ascending (oldest first, newest at bottom)
		return [...tries].sort((a, b) => {
			return a.createAt.localeCompare(b.createAt);
		});
	}, [tries]);

	const content = useMemo(() => {
		if (sortedTries === undefined) {
			return (
				<>
					<li>
						<Skeleton className="h-14 w-full" />
					</li>
					<li>
						<Skeleton className="h-14 w-full" />
					</li>
					<li>
						<Skeleton className="h-14 w-full" />
					</li>
					<li>
						<Skeleton className="h-14 w-full" />
					</li>
				</>
			);
		}

		if (sortedTries.length === 0) {
			return (
				<li className="flex h-full items-center justify-center text-muted-foreground text-sm">
					No tries yet
				</li>
			);
		}

		return sortedTries.map((tryRecord: Try) => (
			<TryItem key={tryRecord.id} tryRecord={tryRecord} />
		));
	}, [sortedTries]);

	if (error) {
		return (
			<Alert className="w-full">
				<XCircleIcon className="size-5 text-destructive" />
				Something is wrong.
			</Alert>
		);
	}

	return (
		<ul className="flex h-full flex-col gap-1.5 rounded-lg bg-secondary p-4">
			{content}
		</ul>
	);
};

export default TryList;
