import { useState } from "react";
import { Vote, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface VotingSectionProps {
  participants: string[];
  categories: string[];
  currentVoter: string;
  votes: Record<string, Record<string, string>>;
  setVotes: React.Dispatch<React.SetStateAction<Record<string, Record<string, string>>>>;
  onComplete: () => void;
}

const VotingSection = ({
  participants,
  categories,
  currentVoter,
  votes,
  setVotes,
  onComplete,
}: VotingSectionProps) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const currentCategory = categories[currentCategoryIndex];
  const voterVotes = votes[currentVoter] || {};
  const selectedForCategory = voterVotes[currentCategory];

  const castVote = (candidate: string) => {
    setVotes((prev) => ({
      ...prev,
      [currentVoter]: {
        ...prev[currentVoter],
        [currentCategory]: candidate,
      },
    }));
    toast({ title: `Vote cast for ${candidate}! 🎄` });
  };

  const goToNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
    }
  };

  const isComplete = categories.every((cat) => voterVotes[cat]);

  const handleFinish = () => {
    if (!isComplete) {
      toast({ title: "Please vote in all categories", variant: "destructive" });
      return;
    }
    onComplete();
  };

  return (
    <section className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary">
          <Vote className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-semibold">
            Voting: <span className="text-accent">{currentVoter}</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Category {currentCategoryIndex + 1} of {categories.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-8">
        {categories.map((cat, index) => (
          <div
            key={cat}
            className={`h-2 flex-1 rounded-full transition-colors ${
              voterVotes[cat]
                ? "bg-accent"
                : index === currentCategoryIndex
                ? "bg-primary"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Current category */}
      <div className="text-center mb-8">
        <h3 className="text-3xl font-display font-bold text-accent mb-2">{currentCategory}</h3>
        <p className="text-muted-foreground">Who deserves this award?</p>
      </div>

      {/* Candidates */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {participants.map((candidate) => {
          const isSelected = selectedForCategory === candidate;
          return (
            <button
              key={candidate}
              onClick={() => castVote(candidate)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-accent bg-accent/10 shadow-lg"
                  : "border-border hover:border-primary/50 bg-muted/30"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center animate-pulse-glow">
                  <Check className="w-4 h-4 text-accent-foreground" />
                </div>
              )}
              <span className="font-medium">{candidate}</span>
            </button>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPrev}
          disabled={currentCategoryIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentCategoryIndex === categories.length - 1 ? (
          <Button
            onClick={handleFinish}
            disabled={!isComplete}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Check className="w-4 h-4" />
            Finish Voting
          </Button>
        ) : (
          <Button onClick={goToNext} className="gap-2">
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </section>
  );
};

export default VotingSection;
