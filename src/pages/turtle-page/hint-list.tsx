import { Lightbulb } from "lucide-react";
import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const HintList = ({ hints }: { hints: string[] }) => {
	const lastHintRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (hints.length > 0 && lastHintRef.current) {
			lastHintRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [hints]);

	return (
		<ScrollArea className="max-h-72 space-y-2 overflow-y-auto rounded-lg border">
			{hints.map((hint, index) => {
				const isLast = index === hints.length - 1;
				return (
					<div
						key={index}
						className="flex items-start gap-2 p-3"
						ref={isLast ? lastHintRef : undefined}
					>
						<Lightbulb className="size-5 shrink-0 text-yellow-500" />
						<p className="text-sm">{hint}</p>
					</div>
				);
			})}
		</ScrollArea>
	);
};

export default HintList;
