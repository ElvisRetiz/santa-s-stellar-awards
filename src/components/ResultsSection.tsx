import { useState, useEffect } from "react";
import { Trophy, Crown, Medal, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResultsSectionProps {
  categories: string[];
  votes: Record<string, Record<string, string>>;
  participants: string[];
}

const ResultsSection = ({ categories, votes, participants }: ResultsSectionProps) => {
  const [revealPhase, setRevealPhase] = useState<"countdown" | "drumroll" | "revealing" | "done">("countdown");
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [revealedCategories, setRevealedCategories] = useState<number>(0);

  useEffect(() => {
    // Countdown phase
    if (revealPhase === "countdown") {
      if (countdownNumber > 0) {
        const timer = setTimeout(() => setCountdownNumber((n) => n - 1), 800);
        return () => clearTimeout(timer);
      } else {
        setRevealPhase("drumroll");
      }
    }
    
    // Drumroll phase
    if (revealPhase === "drumroll") {
      const timer = setTimeout(() => setRevealPhase("revealing"), 1500);
      return () => clearTimeout(timer);
    }
    
    // Revealing phase - reveal categories one by one
    if (revealPhase === "revealing") {
      if (revealedCategories < categories.length) {
        const timer = setTimeout(() => setRevealedCategories((n) => n + 1), 800);
        return () => clearTimeout(timer);
      } else {
        setRevealPhase("done");
      }
    }
  }, [revealPhase, countdownNumber, revealedCategories, categories.length]);

  const calculateWinner = (category: string) => {
    const voteCounts: Record<string, number> = {};
    
    Object.values(votes).forEach((voterVotes) => {
      const vote = voterVotes[category];
      if (vote) {
        voteCounts[vote] = (voteCounts[vote] || 0) + 1;
      }
    });

    const sorted = Object.entries(voteCounts).sort((a, b) => b[1] - a[1]);
    return {
      winner: sorted[0]?.[0] || "Sin votos",
      votes: sorted[0]?.[1] || 0,
      runnerUp: sorted[1]?.[0],
      runnerUpVotes: sorted[1]?.[1] || 0,
    };
  };

  // Countdown and drumroll phases
  if (revealPhase === "countdown" || revealPhase === "drumroll") {
    return (
      <section className="py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AnimatePresence mode="wait">
            {revealPhase === "countdown" && countdownNumber > 0 && (
              <motion.div
                key={countdownNumber}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <span className="text-9xl font-display font-bold text-accent">{countdownNumber}</span>
              </motion.div>
            )}
            
            {revealPhase === "drumroll" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Sparkles className="w-10 h-10 text-accent animate-pulse" />
                  <Crown className="w-16 h-16 text-accent animate-bounce" />
                  <Sparkles className="w-10 h-10 text-accent animate-pulse" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-accent animate-pulse">
                  ¡Redoble de tambores!
                </h2>
                <p className="text-xl text-muted-foreground mt-4">🥁 🥁 🥁</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star className="w-8 h-8 text-accent animate-twinkle" />
          <Crown className="w-12 h-12 text-accent animate-float" />
          <Star className="w-8 h-8 text-accent animate-twinkle" style={{ animationDelay: "0.5s" }} />
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
          <span className="animate-shimmer text-transparent">¡Los Ganadores!</span>
        </h2>
        <p className="text-muted-foreground">¡Los resultados están aquí! 🎄</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category, index) => {
          const result = calculateWinner(category);
          const isRevealed = index < revealedCategories;
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
              animate={isRevealed ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0.3, scale: 0.9 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-accent/30 transition-colors"
            >
              {/* Celebration effect */}
              {isRevealed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2">
                    <Sparkles className="w-6 h-6 text-accent animate-ping" />
                  </div>
                </motion.div>
              )}
              
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Categoría #{index + 1}</p>
                    <h3 className="text-xl font-display font-semibold">{category}</h3>
                  </div>
                  <div className="p-2 rounded-xl bg-accent/20">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                </div>

                {isRevealed ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-muted/30 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center animate-pulse-glow">
                        <Crown className="w-7 h-7 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-accent font-medium uppercase tracking-wider">Ganador</p>
                        <p className="text-2xl font-display font-bold">{result.winner}</p>
                        <p className="text-sm text-muted-foreground">{result.votes} votos</p>
                      </div>
                    </div>

                    {result.runnerUp && (
                      <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                        <Medal className="w-5 h-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Segundo lugar: <span className="text-foreground font-medium">{result.runnerUp}</span>
                          <span className="ml-1">({result.runnerUpVotes} votos)</span>
                        </p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-center min-h-[120px]">
                    <p className="text-muted-foreground animate-pulse">Revelando...</p>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ResultsSection;
