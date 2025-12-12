import { Gift, Sparkles, Star } from "lucide-react";

const ChristmasHeader = () => {
  return (
    <header className="relative py-12 text-center">
      <div className="flex items-center justify-center gap-4 mb-4">
        <Star className="w-8 h-8 text-accent animate-twinkle" />
        <Gift className="w-10 h-10 text-primary animate-float" />
        <Star className="w-8 h-8 text-accent animate-twinkle" style={{ animationDelay: "1s" }} />
      </div>
      
      <h1 className="text-5xl md:text-7xl font-display font-bold mb-4">
        <span className="text-primary">Premios</span>{" "}
        <span className="animate-shimmer text-transparent">Navideños</span>
      </h1>
      
      <p className="text-lg text-muted-foreground flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        Vota por los más festivos entre nosotros
        <Sparkles className="w-5 h-5 text-accent" />
      </p>
    </header>
  );
};

export default ChristmasHeader;
