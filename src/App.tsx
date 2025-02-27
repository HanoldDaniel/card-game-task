import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameProvider } from "./components/game-provider";
import { GameScreen } from "./components/game-screen";

const queryClient = new QueryClient();

function App() {
  return (
    <div className="min-h-screen  w-screen bg-[#1A1B1E] flex justify-center pt-10">
      <div className="container">
        <QueryClientProvider client={queryClient}>
          <GameProvider>
            <GameScreen />
          </GameProvider>
        </QueryClientProvider>
      </div>
    </div>
  );
}

export default App;
