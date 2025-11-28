import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ArrowLeft, Star, Swords, Sparkles } from "lucide-react";
import CharacterBuilds from "@/components/character-builds";
import type { Character } from "@shared/schema";

export default function CharacterDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: character, isLoading } = useQuery<Character>({
    queryKey: ["/api/characters", id],
  });

  const { data: favorites = [] } = useQuery<{characterId: string}[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!id) return;
      const isFavorite = favorites.some(f => f.characterId === id);
      if (isFavorite) {
        await apiRequest("DELETE", `/api/favorites/${id}`);
      } else {
        await apiRequest("POST", "/api/favorites", { characterId: id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Non autorisé",
          description: "Vous devez être connecté. Reconnexion...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erreur",
        description: "Impossible de modifier les favoris",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
          <Skeleton className="h-12 w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-8">
            <Skeleton className="h-[600px] rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-16 w-3/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Personnage non trouvé</h2>
          <Button onClick={() => navigate("/")}>Retour à l'accueil</Button>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.some(f => f.characterId === character.id);

  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      Glacio: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      Fusion: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      Electro: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      Aero: "bg-green-500/20 text-green-300 border-green-500/30",
      Spectro: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      Havoc: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return colors[element] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Character Image */}
          <div className="relative rounded-2xl overflow-hidden bg-muted">
            <img
              src={character.imageUrl}
              alt={character.name}
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/800/1e293b/64748b?text=${encodeURIComponent(character.name)}`;
              }}
            />
          </div>

          {/* Character Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-serif font-bold mb-4" data-testid="text-character-name">
                {character.name}
              </h1>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge className={`${getElementColor(character.element)} border text-base px-4 py-2`}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  {character.element}
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2">
                  <Swords className="h-4 w-4 mr-2" />
                  {character.weaponType}
                </Badge>
                <Badge 
                  variant={character.rarity === 5 ? "default" : "secondary"} 
                  className="font-mono text-base px-4 py-2"
                >
                  <Star className="h-4 w-4 mr-2" />
                  {character.rarity} étoiles
                </Badge>
              </div>

              {user ? (
                <Button
                  onClick={() => toggleFavoriteMutation.mutate()}
                  disabled={toggleFavoriteMutation.isPending}
                  variant={isFavorite ? "default" : "outline"}
                  className="w-full md:w-auto"
                  data-testid="button-toggle-favorite"
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                </Button>
              ) : null}
            </div>

            {character.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {character.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Rareté</span>
                  <span className="font-semibold">{character.rarity} étoiles</span>
                </div>
                <div className="flex justify-between py-3 border-b">
                  <span className="text-muted-foreground">Type d'arme</span>
                  <span className="font-semibold">{character.weaponType}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-muted-foreground">Élément</span>
                  <span className="font-semibold">{character.element}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Character Builds Section - Only for authenticated users */}
        {user && character.id && (
          <div className="mt-12">
            <CharacterBuilds characterId={character.id} />
          </div>
        )}
      </div>
    </div>
  );
}
