import { useGame } from "./game-provider";
import { StartScreen } from "./start-screen";
import { PlayingScreen } from "./playing-screen";
import { GameOverScreen } from "./game-over-screen";

export function GameScreen() {
  const { gameState } = useGame();

  switch (gameState) {
    case "start":
      return <StartScreen />;
    case "playing":
    case "result":
      return <PlayingScreen />;
    case "gameOver":
      return <GameOverScreen />;
    default:
      return <StartScreen />;
  }
}
