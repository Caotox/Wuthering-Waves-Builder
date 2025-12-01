import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, BookmarkX } from "lucide-react";
import { Link, useLocation } from "wouter";
import type { Character } from "@shared/schema";

export default function Favorites() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté. Reconnexion...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: favoritesData = [], isLoading: loadingFavorites } = useQuery<{characterId: string, character: Character}[]>({
    queryKey: ["/api/favorites/details"],
    enabled: isAuthenticated,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (characterId: string) => {
      await apiRequest("DELETE", `/api/favorites/${characterId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/details"] });
      toast({
        title: "Succès",
        description: "Personnage retiré des favoris",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de retirer des favoris",
        variant: "destructive",
      });
    },
  });

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

  if (authLoading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Mes Favoris</h1>

        {loadingFavorites ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favoritesData.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkX className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-muted-foreground mb-4">Aucun favori pour le moment</p>
            <Button onClick={() => navigate("/")} data-testid="button-browse">
              Parcourir les personnages
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoritesData.map(({ character }) => (
              <Card 
                key={character.id} 
                className="overflow-hidden group hover-elevate transition-all duration-200"
                data-testid={`card-favorite-${character.id}`}
              >
                <Link href={`/character/${character.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    <img
                      src={character.imageUrl}
                      alt={character.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://via.placeholder.com/400x533/1e293b/64748b?text=${encodeURIComponent(character.name)}`;
                      }}
                    />
                    
                    <div className="absolute top-2 right-2">
                      <Badge className="font-mono" variant={character.rarity === 5 ? "default" : "secondary"}>
                        {character.rarity}★
                      </Badge>
                    </div>
                    
                    <div className="absolute top-2 left-2">
                      <Badge className={`${getElementColor(character.element)} border`}>
                        {character.element}
                      </Badge>
                    </div>
                    
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-semibold text-white font-serif mb-1">
                        {character.name}
                      </h3>
                      <p className="text-sm text-white/80">{character.weaponType}</p>
                    </div>
                  </div>
                </Link>
                
                <div className="p-3 border-t flex justify-end">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFavoriteMutation.mutate(character.id)}
                    disabled={removeFavoriteMutation.isPending}
                    data-testid={`button-remove-favorite-${character.id}`}
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
