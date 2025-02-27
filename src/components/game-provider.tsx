"use client";

import type React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import PokerSolver from "pokersolver";
import { useQuery } from "@tanstack/react-query";
import { fetchRandomWord, type RandomWordResponse } from "@/services/api";
import {
  generateFunnyMessage,
  generateRandomCards,
  HAND_RANKINGS,
} from "@/lib/utils";

type GameState = "start" | "playing" | "result" | "gameOver";
type Attempt = {
  cards: string[];
  correctRanking: string;
  selectedRanking: string;
  isCorrect: boolean;
  timestamp: number;
};

type GameSession = {
  attemptNumber: number;
  score: number;
  timestamp: number;
};

interface GameContextType {
  gameState: GameState;
  timeLeft: number;
  score: number;
  cards: string[];
  options: string[];
  correctOption: string;
  attempts: Attempt[];
  randomWord?: RandomWordResponse;
  funnyMessage: string;
  lastAttempt: Attempt | null;
  sessions: GameSession[];
  startGame: () => void;
  selectOption: (option: string) => void;
  restartGame: () => void;
  continueGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const INITIAL_TIME = 100;
const TIME_BONUS = 10;

const convertToPokerSolverFormat = (cards: string[]): string[] => {
  const suitMap: { [key: string]: string } = {
    h: "♥",
    d: "♦",
    c: "♣",
    s: "♠",
  };

  return cards.map((card) => {
    const value = card[0];
    const suit = suitMap[card[1]];
    return value + suit;
  });
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>("start");
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [score, setScore] = useState(0);
  const [cards, setCards] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctOption, setCorrectOption] = useState<string>("");
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [funnyMessage, setFunnyMessage] = useState<string>("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [lastAttempt, setLastAttempt] = useState<Attempt | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);

  const { data: randomWord, refetch: prefetchNextWord } = useQuery({
    queryKey: ["randomWord"],
    queryFn: fetchRandomWord,
    enabled: false,
    staleTime: Number.POSITIVE_INFINITY,
  });

  const generateNewRound = useCallback(() => {
    const newCards = generateRandomCards();
    setCards(newCards);

    const pokerSolverCards = convertToPokerSolverFormat(newCards);
    const hand = PokerSolver.Hand.solve(pokerSolverCards);
    const correctRanking = hand.name;
    setCorrectOption(correctRanking);

    const incorrectOptions = HAND_RANKINGS.filter(
      (ranking) => ranking !== correctRanking
    );
    const shuffledIncorrect = incorrectOptions
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    const allOptions = [correctRanking, ...shuffledIncorrect].sort(
      () => Math.random() - 0.5
    );
    setOptions(allOptions);

    prefetchNextWord();
  }, [prefetchNextWord]);

  const startTimer = () => {
    if (timer) clearInterval(timer);
    const newTimer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(newTimer);
          setGameState("gameOver");
          setSessions((prev) => [
            {
              attemptNumber: prev.length + 1,
              score,
              timestamp: Date.now(),
            },
            ...prev,
          ]);
          return 0;
        }
        return newTime;
      });
    }, 1000);
    setTimer(newTimer);
  };

  const pauseTimer = useCallback(() => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [timer]);

  const selectOption = useCallback(
    (option: string) => {
      const isCorrect = option === correctOption;
      pauseTimer();

      const newAttempt: Attempt = {
        cards: [...cards],
        correctRanking: correctOption,
        selectedRanking: option,
        isCorrect,
        timestamp: Date.now(),
      };

      setLastAttempt(newAttempt);
      setAttempts((prev) => [newAttempt, ...prev]);

      if (randomWord?.word) {
        setFunnyMessage(generateFunnyMessage(randomWord.word));
      }

      if (isCorrect) {
        setScore((prev) => prev + 1);
        setTimeLeft((prev) => Math.min(prev + TIME_BONUS, INITIAL_TIME));
        setGameState("result");
      } else {
        const newTime = timeLeft - TIME_BONUS;
        if (newTime <= 0) {
          setTimeLeft(0);
          setGameState("gameOver");
          setSessions((prev) => [
            {
              attemptNumber: prev.length + 1,
              score,
              timestamp: Date.now(),
            },
            ...prev,
          ]);
        } else {
          setTimeLeft(newTime);
          setGameState("result");
        }
      }
    },
    [correctOption, cards, timeLeft, score, randomWord, pauseTimer]
  );

  const continueGame = () => {
    setFunnyMessage("");
    generateNewRound();
    setGameState("playing");
    startTimer();
  };

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(INITIAL_TIME);
    setScore(0);
    setAttempts([]);
    setLastAttempt(null);
    setFunnyMessage("");
    generateNewRound();
    startTimer();
  };

  const restartGame = () => {
    setGameState("start");
    if (timer) clearInterval(timer);
    setTimer(null);
  };

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const value = {
    gameState,
    timeLeft,
    score,
    cards,
    options,
    correctOption,
    attempts,
    randomWord,
    funnyMessage,
    lastAttempt,
    sessions,
    startGame,
    selectOption,
    restartGame,
    continueGame,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
