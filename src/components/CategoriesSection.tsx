import { useState } from "react";
import { Trophy, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface CategoriesSectionProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
  isLocked: boolean;
}

const suggestedCategories = [
  "Mejor Suéter Navideño",
  "Espíritu Más Festivo",
  "Mejor Dando Regalos",
  "Campeón de Alegría Navideña",
  "Mejor Cocinero Navideño",
];

const CategoriesSection = ({ categories, setCategories, isLocked }: CategoriesSectionProps) => {
  const [newCategory, setNewCategory] = useState("");

  const addCategory = (category?: string) => {
    const toAdd = (category || newCategory).trim();
    if (!toAdd) {
      toast({ title: "Por favor ingresa el nombre de la categoría", variant: "destructive" });
      return;
    }
    if (categories.includes(toAdd)) {
      toast({ title: "Esta categoría ya existe", variant: "destructive" });
      return;
    }
    setCategories([...categories, toAdd]);
    setNewCategory("");
    toast({ title: `¡Categoría "${toAdd}" agregada! 🏆` });
  };

  const removeCategory = (category: string) => {
    setCategories(categories.filter((c) => c !== category));
    toast({ title: `Categoría "${category}" eliminada` });
  };

  return (
    <section className="glass rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-accent">
          <Trophy className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-semibold">Categorías de Premios</h2>
          <p className="text-sm text-muted-foreground">Crea las categorías para los premios navideños</p>
        </div>
      </div>

      {!isLocked && (
        <>
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Ingresa el nombre de la categoría..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              className="bg-muted border-border"
            />
            <Button onClick={() => addCategory()} className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="w-4 h-4" />
              Agregar
            </Button>
          </div>

          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">Sugerencias rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedCategories
                .filter((s) => !categories.includes(s))
                .slice(0, 3)
                .map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => addCategory(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full border border-dashed border-border hover:border-accent hover:text-accent transition-colors"
                  >
                    + {suggestion}
                  </button>
                ))}
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        {categories.map((category, index) => (
          <div
            key={category}
            className="group flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border hover:border-accent/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-bold">
                {index + 1}
              </span>
              <span className="font-medium">{category}</span>
            </div>
            {!isLocked && (
              <button
                onClick={() => removeCategory(category)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-destructive/20 rounded-lg"
              >
                <X className="w-4 h-4 text-destructive" />
              </button>
            )}
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-muted-foreground text-sm italic text-center py-4">
            No hay categorías aún. ¡Agrega algunas categorías de premios!
          </p>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
