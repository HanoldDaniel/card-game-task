declare module "pokersolver" {
  export class Hand {
    static solve(hands: string[]): Hand;
    static winners(hands: Hand[]): Hand[];
    constructor(cards: string[], name?: string);
    rank: number;
    cards: string[];
    name: string;
    toString(): string;
  }
}
