import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Heart, Search, X } from "lucide-react";
import { Link } from "wouter";
import type { Character } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<string>("all");
  const [weaponFilter, setWeaponFilter] = useState<string>("all");
  const [elementFilter, setElementFilter] = useState<string>("all");

  // Fetch characters
  const { data: characters = [], isLoading: loadingCharacters } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  // Fetch user favorites
  const { data: favorites = [] } = useQuery<{characterId: string}[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user,
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = useMutation({
    mutationFn: async (characterId: string) => {
      const isFavorite = favorites.some(f => f.characterId === characterId);
      if (isFavorite) {
        await apiRequest("DELETE", `/api/favorites/${characterId}`);
      } else {
        await apiRequest("POST", "/api/favorites", { characterId });
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

  // Filter characters
  const filteredCharacters = characters.filter((char) => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRarity = rarityFilter === "all" || char.rarity.toString() === rarityFilter;
    const matchesWeapon = weaponFilter === "all" || char.weaponType === weaponFilter;
    const matchesElement = elementFilter === "all" || char.element === elementFilter;
    return matchesSearch && matchesRarity && matchesWeapon && matchesElement;
  });

  const resetFilters = () => {
    setSearchQuery("");
    setRarityFilter("all");
    setWeaponFilter("all");
    setElementFilter("all");
  };

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
      {/* Filters */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un personnage..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            
            <Select value={rarityFilter} onValueChange={setRarityFilter}>
              <SelectTrigger className="w-full md:w-40" data-testid="select-rarity">
                <SelectValue placeholder="Rareté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="5">5 étoiles</SelectItem>
                <SelectItem value="4">4 étoiles</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={weaponFilter} onValueChange={setWeaponFilter}>
              <SelectTrigger className="w-full md:w-44" data-testid="select-weapon">
                <SelectValue placeholder="Arme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="Sword">Épée</SelectItem>
                <SelectItem value="Broadblade">Lame</SelectItem>
                <SelectItem value="Pistols">Pistolets</SelectItem>
                <SelectItem value="Gauntlets">Gantelets</SelectItem>
                <SelectItem value="Rectifier">Rectifier</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={elementFilter} onValueChange={setElementFilter}>
              <SelectTrigger className="w-full md:w-44" data-testid="select-element">
                <SelectValue placeholder="Élément" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="Glacio">Glacio</SelectItem>
                <SelectItem value="Fusion">Fusion</SelectItem>
                <SelectItem value="Electro">Electro</SelectItem>
                <SelectItem value="Aero">Aero</SelectItem>
                <SelectItem value="Spectro">Spectro</SelectItem>
                <SelectItem value="Havoc">Havoc</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={resetFilters}
              data-testid="button-reset-filters"
            >
              <X className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </div>

      {/* Characters Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Personnages</h1>
        
        {loadingCharacters ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">Aucun personnage trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => {
              const isFavorite = favorites.some(f => f.characterId === character.id);
              
              return (
                <Card 
                  key={character.id} 
                  className="overflow-hidden group hover-elevate transition-all duration-200"
                  data-testid={`card-character-${character.id}`}
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
                      
                      {/* Rarity Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge className="font-mono" variant={character.rarity === 5 ? "default" : "secondary"}>
                          {character.rarity}★
                        </Badge>
                      </div>
                      
                      {/* Element Badge */}
                      <div className="absolute top-2 left-2">
                        <Badge className={`${getElementColor(character.element)} border`}>
                          {character.element}
                        </Badge>
                      </div>
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-xl font-semibold text-white font-serif mb-1">
                          {character.name}
                        </h3>
                        <p className="text-sm text-white/80">{character.weaponType}</p>
                      </div>
                    </div>
                  </Link>
                  
                  {user ? (
                    <div className="p-3 border-t flex justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavoriteMutation.mutate(character.id)}
                        disabled={toggleFavoriteMutation.isPending}
                        data-testid={`button-favorite-${character.id}`}
                      >
                        <Heart 
                          className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} 
                        />
                      </Button>
                    </div>
                  ) : null}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
