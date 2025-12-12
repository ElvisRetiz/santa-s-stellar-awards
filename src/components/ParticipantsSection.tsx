import { useState } from "react";
import { Users, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ParticipantsSectionProps {
  participants: string[];
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
  isLocked: boolean;
}

const ParticipantsSection = ({ participants, setParticipants, isLocked }: ParticipantsSectionProps) => {
  const [newParticipant, setNewParticipant] = useState("");

  const addParticipant = () => {
    const trimmed = newParticipant.trim();
    if (!trimmed) {
      toast({ title: "Please enter a name", variant: "destructive" });
      return;
    }
    if (participants.includes(trimmed)) {
      toast({ title: "This person is already added", variant: "destructive" });
      return;
    }
    setParticipants([...participants, trimmed]);
    setNewParticipant("");
    toast({ title: `${trimmed} joined the party! 🎄` });
  };

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
    toast({ title: `${name} left the party` });
  };

  return (
    <section className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-secondary">
          <Users className="w-6 h-6 text-secondary-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-semibold">Participants</h2>
          <p className="text-sm text-muted-foreground">Add everyone who will vote and be voted for</p>
        </div>
      </div>

      {!isLocked && (
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="Enter participant name..."
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addParticipant()}
            className="bg-muted border-border"
          />
          <Button onClick={addParticipant} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {participants.map((participant) => (
          <div
            key={participant}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border hover:border-primary/50 transition-colors"
          >
            <span className="text-sm font-medium">{participant}</span>
            {!isLocked && (
              <button
                onClick={() => removeParticipant(participant)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-primary" />
              </button>
            )}
          </div>
        ))}
        {participants.length === 0 && (
          <p className="text-muted-foreground text-sm italic">No participants yet. Add some festive folks!</p>
        )}
      </div>
    </section>
  );
};

export default ParticipantsSection;
