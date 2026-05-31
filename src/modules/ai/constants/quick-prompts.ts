export type QuickPrompt = {
  key: string;
  kk: string;
  ru: string;
  en: string;
};

export const AI_QUICK_PROMPTS: QuickPrompt[] = [
  {
    key: "route1day",
    kk: "1 күндік маршрут құр",
    ru: "Составь маршрут на 1 день",
    en: "Build a 1-day route",
  },
  {
    key: "family",
    kk: "Балалармен қайда барған дұрыс?",
    ru: "Куда пойти с семьёй?",
    en: "Where to go with children?",
  },
  {
    key: "highlights",
    kk: "Түркістандағы ең маңызды орындар",
    ru: "Главные места Туркестана",
    en: "Top sights in Turkestan",
  },
  {
    key: "hotel",
    kk: "Қай қонақүйді ұсынасың?",
    ru: "Какой отель посоветуете?",
    en: "Which hotel do you recommend?",
  },
  {
    key: "budget",
    kk: "20 000 теңгеге маршрут жаса",
    ru: "Маршрут на 20 000 тенге",
    en: "Route for 20,000 KZT",
  },
];
