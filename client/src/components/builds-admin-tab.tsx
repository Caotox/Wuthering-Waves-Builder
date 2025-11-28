import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Shield, Search, Filter, Users, Star, Sword } from "lucide-react";
import type { CharacterBuild, Character, User } from "@shared/schema";

interface BuildWithDetails extends CharacterBuild {
  character?: Character;
  user?: Omit<User, 'password'>;
}

export default function BuildsAdminTab() {
  const { toast } = useToast();
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCharacter, setFilterCharacter] = useState<string>("all");
  const [filterUser, setFilterUser] = useState<string>("all");

  const { data: builds = [], isLoading: buildsLoading } = useQuery<CharacterBuild[]>({
    queryKey: ["/api/admin/builds"],
  });

  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
  });

  const { data: users = [] } = useQuery<Omit<User, 'password'>[]>({
    queryKey: ["/api/admin/users"],
  });

  const deleteBuildMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/builds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builds"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/builds"] });
      setDeleteConfirm(null);
      toast({
        title: "Succès",
        description: "Build supprimé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le build",
        variant: "destructive",
      });
    },
  });

  const buildsWithDetails: BuildWithDetails[] = builds.map(build => ({
    ...build,
    character: characters.find(c => c.id === build.characterId),
    user: users.find(u => u.id === build.userId),
  }));

  // Filtrage et recherche
  const filteredBuilds = useMemo(() => {
    return buildsWithDetails.filter((build) => {
      const matchesSearch = 
        build.buildName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        build.character?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        build.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        build.weapon?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCharacter = filterCharacter === "all" || build.characterId === filterCharacter;
      const matchesUser = filterUser === "all" || build.userId === filterUser;

      return matchesSearch && matchesCharacter && matchesUser;
    });
  }, [buildsWithDetails, searchQuery, filterCharacter, filterUser]);

  // Statistiques
  const stats = useMemo(() => {
    const uniqueUsers = new Set(builds.map(b => b.userId)).size;
    const uniqueCharacters = new Set(builds.map(b => b.characterId)).size;
    return { totalBuilds: builds.length, uniqueUsers, uniqueCharacters };
  }, [builds]);

  return (
    <>
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-500" />
                Total Builds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalBuilds}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-green-500" />
                Utilisateurs actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.uniqueUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Personnages couverts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.uniqueCharacters}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tableau principal */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Gestion des builds ({filteredBuilds.length})
                </CardTitle>
                <CardDescription className="mt-1">
                  Gérez tous les builds créés par les utilisateurs
                </CardDescription>
              </div>

              {/* Filtres */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un build, personnage, utilisateur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterCharacter} onValueChange={setFilterCharacter}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les personnages</SelectItem>
                    {characters.map((char) => (
                      <SelectItem key={char.id} value={char.id}>
                        {char.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Users className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {buildsLoading ? (
              <p className="text-muted-foreground py-8 text-center">Chargement...</p>
            ) : builds.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Shield className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucun build enregistré</p>
                <p className="text-sm mt-2">Les builds créés par les utilisateurs apparaîtront ici</p>
              </div>
            ) : filteredBuilds.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>Aucun build ne correspond aux filtres sélectionnés</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom du build</TableHead>
                      <TableHead>Personnage</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Arme</TableHead>
                      <TableHead>Echo & Sets</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuilds.map((build) => (
                      <TableRow key={build.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {build.buildName}
                          </div>
                        </TableCell>
                        <TableCell>
                          {build.character ? (
                            <div className="flex items-center gap-2">
                              <img
                                src={build.character.imageUrl}
                                alt={build.character.name}
                                className="w-8 h-8 rounded object-cover"
                              />
                              <span className="font-medium">{build.character.name}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Supprimé</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {build.user ? (
                            <div className="space-y-0.5">
                              <div className="text-sm">{build.user.firstName} {build.user.lastName}</div>
                              <div className="text-xs text-muted-foreground">{build.user.email}</div>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Supprimé</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {build.weapon ? (
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                              <Sword className="h-3 w-3" />
                              {build.weapon}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {build.mainEcho && (
                              <Badge className="bg-purple-600 text-xs">
                                {build.mainEcho}
                              </Badge>
                            )}
                            {(build.echoSet1 || build.echoSet2) && (
                              <div className="flex flex-wrap gap-1">
                                {build.echoSet1 && (
                                  <Badge variant="outline" className="text-xs border-purple-300">
                                    {build.echoSet1}
                                  </Badge>
                                )}
                                {build.echoSet2 && (
                                  <Badge variant="outline" className="text-xs border-purple-300">
                                    {build.echoSet2}
                                  </Badge>
                                )}
                              </div>
                            )}
                            {!build.mainEcho && !build.echoSet1 && !build.echoSet2 && (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {build.createdAt 
                              ? new Date(build.createdAt).toLocaleDateString('fr-FR', { 
                                  day: '2-digit', 
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : '-'
                            }
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteConfirm(build.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Build Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce build ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && deleteBuildMutation.mutate(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
