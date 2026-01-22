import { XCircleIcon } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
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
	const { t } = useTranslation();
	const lastTryRef = useRef<HTMLLIElement>(null);

	const sortedTries = useMemo(() => {
		if (!tries) return undefined;
		// Sort by createAt ascending (oldest first, newest at bottom)
		return [...tries].sort((a, b) => {
			return a.createAt.localeCompare(b.createAt);
		});
	}, [tries]);

	// Auto-scroll to the latest try when new try is added
	useEffect(() => {
		if (sortedTries && sortedTries.length > 0 && lastTryRef.current) {
			lastTryRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [sortedTries]);

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
					{t("page.turtle.try_list.empty")}
				</li>
			);
		}

		return sortedTries.map((tryRecord: Try, index: number) => {
			const isLast = index === sortedTries.length - 1;
			return (
				<TryItem
					key={tryRecord.id}
					tryRecord={tryRecord}
					ref={isLast ? lastTryRef : null}
				/>
			);
		});
	}, [sortedTries, t]);

	if (error) {
		return (
			<Alert className="w-full">
				<XCircleIcon className="size-5 text-destructive" />
				Something is wrong.
			</Alert>
		);
	}

	return (
		<ul className="flex h-full max-w-full flex-col gap-1.5 rounded-lg bg-secondary">
			{content}
		</ul>
	);
};

export default TryList;
