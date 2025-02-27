import { Button } from "@/components/ui/button";
import { PlayingCard } from "./playing-card";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  Loader2,
  CrossIcon,
} from "lucide-react";
import { useGame } from "./game-provider";

export function PlayingScreen() {
  const {
    timeLeft,
    score,
    cards,
    options,
    selectOption,
    lastAttempt,
    gameState,
    continueGame,
    funnyMessage,
  } = useGame();

  return (
    <div className="flex flex-col w-full justify-center align-middle space-y-4">
      <div className="flex justify-center">
        <div className="bg-secondary/10 rounded-lg p-3 mr-2">
          <div className="flex items-center">
            <div className="relative ml-2">
              <span className="font-mono text-primary flex gap-2">
                {timeLeft}s <CrossIcon />
              </span>
              {lastAttempt && (
                <div
                  className={`absolute -top-5 font-mono text-sm
                    ${lastAttempt.isCorrect ? "text-green-400" : "text-red-400"}
                    animate-slide-up`}
                >
                  {lastAttempt.isCorrect ? "+10s" : "-10s"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="bg-secondary/10 rounded-lg px-3 py-2 flex gap-2 text-center">
          <div className="text-sm text-secondary flex items-center justify-center">
            Score
          </div>
          <div className="text-2xl font-bold text-primary">{score}</div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-center">
          <div className="flex flex-wrap gap-2 justify-center">
            {cards.map((card, index) => (
              <PlayingCard key={index} card={card} />
            ))}
          </div>
        </div>

        <div className="flex mb-10 flex-col items-center justify-start gap-4">
          {gameState === "result" && lastAttempt ? (
            <>
              <div className="flex items-center gap-2 text-lg">
                {lastAttempt.isCorrect ? (
                  <div className="text-primary flex items-center gap-2">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>{lastAttempt.correctRanking}</span>
                  </div>
                ) : (
                  <div className="text-red-400 flex items-center gap-2">
                    <XCircleIcon className="w-5 h-5" />
                    <span>{lastAttempt.correctRanking}</span>
                  </div>
                )}
              </div>
              {funnyMessage ? (
                <p className="text-secondary text-sm font-medium tracking-wide animate-fade-in">
                  {funnyMessage}
                </p>
              ) : (
                <div className="flex items-center gap-2 text-secondary text-sm animate-fade-in">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing hand analysis...</span>
                </div>
              )}
            </>
          ) : (
            <h2 className="text-xl font-semibold text-primary">
              Choose the correct hand ranking
            </h2>
          )}
        </div>

        <div className="flex items-start justify-center">
          {gameState === "playing" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {options.map((option, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  onClick={() => selectOption(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          ) : (
            <Button onClick={continueGame}>
              Continue <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
