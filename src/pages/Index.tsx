import { useState } from "react";
import { Play, BarChart3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Snowfall from "@/components/Snowfall";
import ChristmasHeader from "@/components/ChristmasHeader";
import ParticipantsSection from "@/components/ParticipantsSection";
import CategoriesSection from "@/components/CategoriesSection";
import VoterSelection from "@/components/VoterSelection";
import VotingSection from "@/components/VotingSection";
import ResultsSection from "@/components/ResultsSection";
import { toast } from "@/hooks/use-toast";

type Phase = "setup" | "voting" | "results";

const Index = () => {
  const [phase, setPhase] = useState<Phase>("setup");
  const [participants, setParticipants] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [currentVoter, setCurrentVoter] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, Record<string, string>>>({});
  const [votedParticipants, setVotedParticipants] = useState<string[]>([]);

  const allHaveVoted = participants.length > 0 && votedParticipants.length === participants.length;

  const startVoting = () => {
    if (participants.length < 2) {
      toast({ title: "Agrega al menos 2 participantes", variant: "destructive" });
      return;
    }
    if (categories.length < 1) {
      toast({ title: "Agrega al menos 1 categoría", variant: "destructive" });
      return;
    }
    setPhase("voting");
    toast({ title: "¡Que comience la votación! 🎄" });
  };

  const selectVoter = (voter: string) => {
    setCurrentVoter(voter);
  };

  const completeVoting = () => {
    if (currentVoter) {
      const newVotedParticipants = [...votedParticipants, currentVoter];
      setVotedParticipants(newVotedParticipants);
      setCurrentVoter(null);
      
      if (newVotedParticipants.length === participants.length) {
        toast({ title: "¡Todos han votado! Ya puedes ver los resultados ✨" });
      } else {
        toast({ title: "¡Votos registrados! ✨" });
      }
    }
  };

  const showResults = () => {
    if (!allHaveVoted) {
      toast({ title: "Todos deben votar antes de ver los resultados", variant: "destructive" });
      return;
    }
    setPhase("results");
    toast({ title: "¡Redoble de tambores! 🥁" });
  };

  const resetAll = () => {
    setPhase("setup");
    setParticipants([]);
    setCategories([]);
    setCurrentVoter(null);
    setVotes({});
    setVotedParticipants([]);
    toast({ title: "¡Empezando de nuevo! 🎄" });
  };

  return (
    <div className="relative min-h-screen">
      <Snowfall />
      
      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-8">
        <ChristmasHeader />

        {phase === "setup" && (
          <div className="space-y-6">
            <ParticipantsSection
              participants={participants}
              setParticipants={setParticipants}
              isLocked={false}
            />
            
            <CategoriesSection
              categories={categories}
              setCategories={setCategories}
              isLocked={false}
            />

            <div className="flex justify-center pt-6">
              <Button
                size="lg"
                onClick={startVoting}
                className="gap-3 text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg"
              >
                <Play className="w-5 h-5" />
                Iniciar Votación
              </Button>
            </div>
          </div>
        )}

        {phase === "voting" && (
          <div className="space-y-6">
            {!currentVoter ? (
              <>
                <VoterSelection
                  participants={participants}
                  votedParticipants={votedParticipants}
                  onSelectVoter={selectVoter}
                />
                
                {allHaveVoted && (
                  <div className="flex justify-center gap-4 pt-6">
                    <Button
                      size="lg"
                      onClick={showResults}
                      className="gap-3 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <BarChart3 className="w-5 h-5" />
                      Ver Resultados
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <VotingSection
                participants={participants}
                categories={categories}
                currentVoter={currentVoter}
                votes={votes}
                setVotes={setVotes}
                onComplete={completeVoting}
              />
            )}
          </div>
        )}

        {phase === "results" && (
          <div className="space-y-6">
            <ResultsSection
              categories={categories}
              votes={votes}
              participants={participants}
            />

            <div className="flex justify-center pt-6">
              <Button
                size="lg"
                variant="outline"
                onClick={resetAll}
                className="gap-3"
              >
                <RotateCcw className="w-5 h-5" />
                Nuevos Premios
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
