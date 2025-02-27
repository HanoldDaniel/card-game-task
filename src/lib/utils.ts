import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CARD_SUITS = ["h", "d", "c", "s"];
const CARD_VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
];

export const HAND_RANKINGS = [
  "Straight Flush",
  "Four of a Kind",
  "Full House",
  "Flush",
  "Straight",
  "Three of a Kind",
  "Two Pair",
  "Pair",
  "High Card",
];

const generateRandomCard = (existingCards: string[] = []): string => {
  let card;
  do {
    const suit = CARD_SUITS[Math.floor(Math.random() * CARD_SUITS.length)];
    const value = CARD_VALUES[Math.floor(Math.random() * CARD_VALUES.length)];
    card = value + suit;
  } while (existingCards.includes(card));

  return card;
};

export const generateRandomCards = (): string[] => {
  const cards: string[] = [];
  while (cards.length < 5) {
    cards.push(generateRandomCard(cards));
  }

  return cards;
};

export const generateFunnyMessage = (word: string): string => {
  if (!word) return "Calculating optimal strategy...";

  const messages = [
    `Your GTO score is reaching ${word} level!`,
    `Solver suggests studying ${word} spots`,
    `That's a ${word}-level play!`,
    `Your strategy is more ${word} than PioSOLVER`,
    `Your play is ${word}!`,
    `The solver would be proud of your ${word} play`,
    `Your moves are reaching ${word} levels`,
    `Time to add ${word} to your strategy`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};
