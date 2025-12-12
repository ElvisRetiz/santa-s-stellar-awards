import { Trophy, Crown, Medal, Star } from "lucide-react";
import { motion } from "framer-motion";

interface ResultsSectionProps {
  categories: string[];
  votes: Record<string, Record<string, string>>;
  participants: string[];
}

const ResultsSection = ({ categories, votes, participants }: ResultsSectionProps) => {
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
      winner: sorted[0]?.[0] || "No votes",
      votes: sorted[0]?.[1] || 0,
      runnerUp: sorted[1]?.[0],
      runnerUpVotes: sorted[1]?.[1] || 0,
    };
  };

  return (
    <section className="py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Star className="w-8 h-8 text-accent animate-twinkle" />
          <Crown className="w-12 h-12 text-accent animate-float" />
          <Star className="w-8 h-8 text-accent animate-twinkle" style={{ animationDelay: "0.5s" }} />
        </div>
        <h2 className="text-4xl md:text-5xl font-display font-bold mb-2">
          <span className="animate-shimmer text-transparent">Award Winners</span>
        </h2>
        <p className="text-muted-foreground">The results are in! 🎄</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category, index) => {
          const result = calculateWinner(category);
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-accent/30 transition-colors"
            >
              {/* Decorative background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Category #{index + 1}</p>
                    <h3 className="text-xl font-display font-semibold">{category}</h3>
                  </div>
                  <div className="p-2 rounded-xl bg-accent/20">
                    <Trophy className="w-6 h-6 text-accent" />
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center animate-pulse-glow">
                      <Crown className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-accent font-medium uppercase tracking-wider">Winner</p>
                      <p className="text-2xl font-display font-bold">{result.winner}</p>
                      <p className="text-sm text-muted-foreground">{result.votes} votes</p>
                    </div>
                  </div>

                  {result.runnerUp && (
                    <div className="flex items-center gap-3 pt-3 border-t border-border/50">
                      <Medal className="w-5 h-5 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Runner-up: <span className="text-foreground font-medium">{result.runnerUp}</span>
                        <span className="ml-1">({result.runnerUpVotes} votes)</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ResultsSection;
