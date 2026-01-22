import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { type AiSettings } from "@/types";
import CreateSoupContent from "./create-soup-content";

type CreateSoupDialog = {
	aiSettings: AiSettings;
	children?: ReactNode;
	/* class name of default trigger button. ignored for given trigger. */
	className?: string;
};

const CreateSoupDialog = ({
	aiSettings,
	className,
	children,
}: CreateSoupDialog) => {
	const { t } = useTranslation();
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<Dialog open={isOpen}>
			<DialogTrigger
				asChild
				onClick={() => {
					setIsOpen(true);
				}}
			>
				{children ? (
					children
				) : (
					<Button className={cn("", className)}>
						{t("page.turtle.create_soup.title")}
					</Button>
				)}
			</DialogTrigger>
			<DialogContent
				className="rounded-lg bg-secondary p-4"
				onClose={handleClose}
			>
				<DialogTitle>{t("page.turtle.create_soup.title")}</DialogTitle>
				<DialogDescription>
					{t("page.turtle.create_soup.description")}
				</DialogDescription>
				<CreateSoupContent aiSettings={aiSettings} onSubmit={handleClose} />
			</DialogContent>
		</Dialog>
	);
};

export default CreateSoupDialog;
