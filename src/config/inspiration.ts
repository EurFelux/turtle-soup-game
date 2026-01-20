import type { LocaleCode } from "@/types";

const storyInspirationsZh = [
	// 科技与未来 (1-10)
	"意识上传",
	"赛博朋克",
	"永生芯片",
	"平行宇宙",
	"机械心脏",
	"记忆删除",
	"星际难民",
	"硅基生命",
	"虚拟现实",
	"反乌托邦",

	// 魔法与奇幻 (11-20)
	"炼金术",
	"被遗忘的神明",
	"影子魔法",
	"占卜师",
	"龙族契约",
	"浮空岛",
	"禁忌图书馆",
	"元素法师",
	"预言石",
	"独角兽之血",

	// 悬疑与犯罪 (21-30)
	"密室谋杀",
	"消失的零点",
	"戴面具的客人",
	"匿名包裹",
	"虚假证词",
	"阁楼里的日记",
	"敲门声",
	"倒计时的时钟",
	"指纹背后的秘密",
	"双面间谍",

	// 治愈与情感 (31-40)
	"跨时空的信",
	"再次重逢",
	"街角咖啡馆",
	"晚安短信",
	"盛夏的雨",
	"老照片的色彩",
	"梦想的碎片",
	"猫的报恩",
	"最后一班列车",
	"风铃的叮咛",

	// 恐怖与超自然 (41-50)
	"镜中人",
	"无尽走廊",
	"玩偶的微笑",
	"消失的影子",
	"午夜电梯",
	"荒村老屋",
	"墙缝里的眼睛",
	"诅咒的画卷",
	"深海恐惧",
	"梦游者",

	// 冒险与史诗 (51-60)
	"消失的亚特兰蒂斯",
	"丛林遗迹",
	"大海盗的罗盘",
	"地心历险",
	"文明余晖",
	"最后一枚硬币",
	"极北之地的光",
	"丝绸之路的宝藏",
	"荒野求生",
	"众神黄昏",

	// 心理与哲学 (61-70)
	"蝴蝶效应",
	"潘多拉魔盒",
	"薛定谔的猫",
	"莫比乌斯环",
	"忒修斯之船",
	"黑色幽默",
	"荒诞主义",
	"因果倒置",
	"第22条军规",
	"罗生门",

	// 场景与意象 (71-80)
	"废墟上的花",
	"琥珀里的时间",
	"极昼的黑夜",
	"漂流瓶",
	"霓虹灯影",
	"雾都",
	"被偷走的季节",
	"萤火之森",
	"时光机的故障",
	"月亮背面",
] as const;

const storyInspirationsEn = [
	// Sci-Fi & Future (1-10)
	"Mind Uploading",
	"Cyberpunk",
	"Immortality Chip",
	"Parallel Universe",
	"Mechanical Heart",
	"Memory Erasure",
	"Galactic Refugee",
	"Silicon-based Life",
	"Virtual Reality",
	"Dystopian Society",

	// Fantasy & Magic (11-20)
	"Alchemy",
	"Forgotten Deity",
	"Shadow Manipulation",
	"The Soothsayer",
	"Dragon's Covenant",
	"Floating Citadel",
	"Forbidden Archive",
	"Elemental Sorcerer",
	"Prophecy Stone",
	"Unicorn Blood",

	// Mystery & Crime (21-30)
	"Locked-room Murder",
	"The Missing Hour",
	"The Masked Guest",
	"Anonymous Package",
	"False Testimony",
	"The Attic Diary",
	"The Midnight Knock",
	"Countdown Clock",
	"The Hidden Fingerprint",
	"Double Agent",

	// Healing & Emotion (31-40)
	"Letters Across Eras",
	"The Long-awaited Reunion",
	"Corner Cafe",
	"A Goodnight Message",
	"Midsummer Rain",
	"Colors of Vintage Photos",
	"Fragments of Dreams",
	"The Cat's Requital",
	"The Last Commuter Train",
	"Whispering Wind Chimes",

	// Horror & Supernatural (41-50)
	"The Mirror's Twin",
	"Endless Corridor",
	"The Grinning Doll",
	"Detached Shadow",
	"Midnight Elevator",
	"The Deserted Mansion",
	"Eyes in the Crevices",
	"The Cursed Canvas",
	"Abyssal Terror",
	"The Sleepwalker",

	// Adventure & Epic (51-60)
	"The Lost Atlantis",
	"Jungle Ruins",
	"The Pirate’s Compass",
	"Subterranean Voyage",
	"The Final Glow of Civilization",
	"The Last Coin",
	"Aurora of the High North",
	"Silk Road Treasure",
	"Untamed Wilderness",
	"Twilight of the Gods",

	// Philosophy & Psychology (61-70)
	"The Butterfly Effect",
	"Pandora’s Box",
	"Schrodinger’s Cat",
	"Mobius Strip",
	"Ship of Theseus",
	"Black Comedy",
	"Absurdism",
	"Reverse Causality",
	"Catch-22",
	"The Rashomon Effect",

	// Imagery & Atmosphere (71-80)
	"Flowers Amidst Ruins",
	"Time Preserved in Amber",
	"Night of the Midnight Sun",
	"Message in a Bottle",
	"Neon Shadows",
	"The City of Mist",
	"The Stolen Season",
	"Forest of Fireflies",
	"Time Machine Malfunction",
	"The Far Side of the Moon",
] as const;

export const inspirationsMap = {
	"zh-CN": storyInspirationsZh,
	"en-US": storyInspirationsEn,
} satisfies Record<LocaleCode, readonly string[]>;

const inspirationPromptZh = "请根据以下灵感创作一个故事：";
const inspirationPromptEn =
	"Please create a story based on the following inspiration:";

const inspirationPrompt = {
	"zh-CN": inspirationPromptZh,
	"en-US": inspirationPromptEn,
} satisfies Record<LocaleCode, string>;

export const getInspirationPrompt = ({ locale }: { locale: LocaleCode }) => {
	return inspirationPrompt[locale];
};
