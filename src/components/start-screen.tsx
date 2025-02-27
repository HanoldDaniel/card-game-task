import { useGame } from "./game-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StartScreen() {
  const { startGame } = useGame();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
      {import.meta.env.VITE_API_NINJAS_KEY ? null : (
        <div className="p-4 rounded-lg text-destructive bg-destructive/20">
          API Ninjas key is missing; running with limited functionality.
        </div>
      )}
      <Card className="w-full max-w-md border-primary/20">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-primary">
            Guess The Cards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={startGame} className="w-full text-lg">
            Play
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
