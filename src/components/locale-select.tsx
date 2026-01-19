import { type ReactNode } from "react";
import { useLocale } from "@/hooks/useLocale";
import {
	chineseSimplified,
	englishUnitedStates,
	type LocaleCode,
} from "@/types/locale";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type LocaleItem = {
	value: LocaleCode;
	label: ReactNode;
};

const items: LocaleItem[] = [chineseSimplified, englishUnitedStates].map(
	(locale) => ({
		value: locale.code,
		label: locale.name,
	}),
);

export const LocaleSelect = () => {
	const { locale, setLocale } = useLocale();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger></DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup
					value={locale}
					onValueChange={(value: string) => setLocale(value as LocaleCode)}
				>
					{items.map((item) => (
						<DropdownMenuRadioItem key={item.value} value={item.value}>
							{item.label}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
