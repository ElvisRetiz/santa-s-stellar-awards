import { useState, useEffect } from "react";
import { Trophy, Crown, Medal, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ResultsSectionProps {
  categories: string[];
  votes: Record<string, Record<string, string>>;
  participants: string[];
  participantPhotos: Record<string, string>;
}

const ResultsSection = ({ categories, votes, participants, participantPhotos }: ResultsSectionProps) => {
  const [revealingCategory, setRevealingCategory] = useState<string | null>(null);
  const [revealPhase, setRevealPhase] = useState<"countdown" | "drumroll" | "revealed">("countdown");
  const [countdownNumber, setCountdownNumber] = useState(3);
  const [revealedCategories, setRevealedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!revealingCategory) return;

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
      const timer = setTimeout(() => {
        setRevealPhase("revealed");
        setRevealedCategories(prev => new Set([...prev, revealingCategory]));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [revealPhase, countdownNumber, revealingCategory]);

  const handleCategoryClick = (category: string) => {
    if (revealedCategories.has(category) || revealingCategory) return;
    setRevealingCategory(category);
    setRevealPhase("countdown");
    setCountdownNumber(3);
  };

  const closeReveal = () => {
    setRevealingCategory(null);
    setRevealPhase("countdown");
    setCountdownNumber(3);
  };

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

  return (
    <>
      {/* Modal de animación para categoría individual */}
      <AnimatePresence>
        {revealingCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
            onClick={revealPhase === "revealed" ? closeReveal : undefined}
          >
            <div className="flex flex-col items-center justify-center min-h-[400px] px-4">
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

                {revealPhase === "revealed" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    className="w-full max-w-2xl"
                  >
                    {(() => {
                      const result = calculateWinner(revealingCategory);
                      return (
                        <div className="glass rounded-2xl p-8 relative overflow-hidden">
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 pointer-events-none"
                          >
                            <div className="absolute top-4 left-1/2 -translate-x-1/2">
                              <Sparkles className="w-8 h-8 text-accent animate-ping" />
                            </div>
                          </motion.div>

                          <div className="relative">
                            <div className="text-center mb-6">
                              <p className="text-sm text-muted-foreground mb-2">Categoría</p>
                              <h3 className="text-3xl font-display font-semibold">{revealingCategory}</h3>
                            </div>

                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                              className="bg-muted/30 rounded-xl p-6"
                            >
                              <div className="flex flex-col items-center gap-4 mb-4">
                                {participantPhotos[result.winner] ? (
                                  <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-accent/50 animate-pulse-glow">
                                    <img
                                      src={participantPhotos[result.winner]}
                                      alt={result.winner}
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg">
                                      <Crown className="w-6 h-6 text-accent-foreground" />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center animate-pulse-glow">
                                    <Crown className="w-10 h-10 text-accent-foreground" />
                                  </div>
                                )}
                                <div className="text-center">
                                  <p className="text-xs text-accent font-medium uppercase tracking-wider mb-2">Ganador</p>
                                  <p className="text-4xl font-display font-bold mb-1">{result.winner}</p>
                                  <p className="text-lg text-muted-foreground">{result.votes} votos</p>
                                </div>
                              </div>

                              {result.runnerUp && (
                                <div className="flex items-center justify-center gap-3 pt-4 border-t border-border/50">
                                  <Medal className="w-6 h-6 text-muted-foreground" />
                                  <p className="text-base text-muted-foreground">
                                    Segundo lugar: <span className="text-foreground font-medium">{result.runnerUp}</span>
                                    <span className="ml-1">({result.runnerUpVotes} votos)</span>
                                  </p>
                                </div>
                              )}
                            </motion.div>

                            <p className="text-center text-sm text-muted-foreground mt-6">
                              Haz clic en cualquier lugar para cerrar
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vista principal con todas las categorías */}
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
          <p className="text-muted-foreground">Haz clic en una categoría para revelar el ganador 🎄</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category, index) => {
            const isRevealed = revealedCategories.has(category);

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleCategoryClick(category)}
                className={`glass rounded-2xl p-6 relative overflow-hidden group transition-all ${
                  !isRevealed && !revealingCategory
                    ? "hover:border-accent/50 hover:scale-105 cursor-pointer"
                    : isRevealed
                    ? "border-accent/30"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
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
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-muted/30 rounded-xl p-4"
                    >
                      <div className="flex items-center gap-3">
                        {participantPhotos[calculateWinner(category).winner] ? (
                          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-accent/30">
                            <img
                              src={participantPhotos[calculateWinner(category).winner]}
                              alt={calculateWinner(category).winner}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                              <Crown className="w-3 h-3 text-accent-foreground" />
                            </div>
                          </div>
                        ) : (
                          <Crown className="w-8 h-8 text-accent" />
                        )}
                        <div>
                          <p className="text-xs text-accent font-medium uppercase tracking-wider">Ganador</p>
                          <p className="text-xl font-display font-bold">{calculateWinner(category).winner}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="bg-muted/30 rounded-xl p-4 flex items-center justify-center min-h-[80px]">
                      <div className="text-center">
                        <Sparkles className="w-8 h-8 text-accent mx-auto mb-2 animate-pulse" />
                        <p className="text-sm text-muted-foreground">Haz clic para revelar</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default ResultsSection;
