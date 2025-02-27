interface PlayingCardProps {
  card: string;
}

export function PlayingCard({ card }: PlayingCardProps) {
  const value = card.charAt(0);
  const suit = card.charAt(1);

  const cardColor = () => {
    switch (suit) {
      case "h":
        return "bg-red-500";
      case "d":
        return "bg-blue-500";
      case "c":
        return "bg-green-500";
      case "s":
        return "bg-slate-700";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div
      className={`w-12 h-20 ${cardColor()} rounded-lg shadow-md flex items-center justify-center transition-transform hover:scale-105 hover:shadow-lg md:w-16 md:h-20`}
    >
      <div className="relative w-full h-full">
        <div
          className={`absolute inset-0 flex items-center justify-center font-bold text-5xl text-slate-50`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
