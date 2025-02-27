import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export function GameOverScreen() {
  const { score, sessions, startGame, restartGame } = useGame();

  return (
    <div className="flex full-w justify-center">
      <Card className="w-full lg:w-1/3 border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-2">
            <h3 className="text-xl mb-2 text-secondary">Current Score</h3>
            <p className="text-4xl font-bold text-primary">{score}</p>
            <p className="text-sm text-secondary">Attempt #{sessions.length}</p>
          </div>

          <div>
            <ScrollArea className="h-96 w-full rounded-md md:px-4">
              <div className="space-y-3">
                {[...sessions]
                  .sort((a, b) =>
                    b.score === a.score
                      ? b.timestamp - a.timestamp
                      : b.score - a.score
                  )
                  .map((session) => (
                    <div
                      key={session.timestamp}
                      className="flex items-center justify-between p-3 bg-primary/10 rounded-lg flex-wrap"
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-primary">
                          #{session.attemptNumber}
                        </div>
                        <div className="flex gap-2 text-center align-middle justify-center">
                          <span className="text-secondary">Score</span>
                          <span className="text-primary font-semibold">
                            {session.score}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-secondary text-sm">
                        <Clock className="w-4 h-4" />
                        {new Date(session.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                {sessions.length === 0 && (
                  <p className="text-center text-secondary py-4">
                    No previous attempts
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 px-2 justify-between">
          <Button onClick={startGame} variant="default" className="w-full">
            Retry
          </Button>
          <Button onClick={restartGame} variant="secondary" className="w-full">
            Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
