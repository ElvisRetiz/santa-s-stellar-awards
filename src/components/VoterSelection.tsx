import { User, CheckCircle2 } from "lucide-react";

interface VoterSelectionProps {
  participants: string[];
  votedParticipants: string[];
  onSelectVoter: (voter: string) => void;
}

const VoterSelection = ({ participants, votedParticipants, onSelectVoter }: VoterSelectionProps) => {
  const allVoted = votedParticipants.length === participants.length;
  
  return (
    <section className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-semibold">¿Quién está votando?</h2>
          <p className="text-sm text-muted-foreground">Selecciona tu nombre para emitir tus votos</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {participants.map((participant) => {
          const hasVoted = votedParticipants.includes(participant);
          return (
            <button
              key={participant}
              onClick={() => !hasVoted && onSelectVoter(participant)}
              disabled={hasVoted}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                hasVoted
                  ? "border-secondary/50 bg-secondary/20 opacity-60 cursor-not-allowed"
                  : "border-border hover:border-primary hover:bg-primary/10 cursor-pointer"
              }`}
            >
              {hasVoted && (
                <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-secondary" />
              )}
              <span className="font-medium">{participant}</span>
              {hasVoted && <p className="text-xs text-muted-foreground mt-1">Ya votó</p>}
            </button>
          );
        })}
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {allVoted ? (
          <span className="text-accent font-medium">¡Todos han votado! Puedes ver los resultados.</span>
        ) : (
          <span>{votedParticipants.length} de {participants.length} han votado</span>
        )}
      </div>
    </section>
  );
};

export default VoterSelection;
