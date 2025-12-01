import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Pencil, Trash2, Shield, Sword, Sparkles, Target, TrendingUp, Search, SortAsc, Star, Copy, Share2 } from "lucide-react";
import type { CharacterBuild } from "@shared/schema";

// Données de référence pour Wuthering Waves
const WEAPONS = [
  "Emerald of Genesis", "Stringmaster", "Verina's Pistols", "Broadblade #41",
  "Gauntlets #21D", "Rectifier #25", "Sword #18", "Lustrous Razor",
  "Abyss Surges", "Cosmic Ripples", "Blazing Brilliance", "Variation",
  "Autumntrace", "Static Mist", "Commando of Conviction", "Ages of Harvest"
];

const ECHO_SETS = [
  "Molten Rift", "Void Thunder", "Freezing Frost", "Sierra Gale", "Celestial Light",
  "Havoc Eclipse", "Rejuvenating Glow", "Moonlit Clouds", "Lingering Tunes",
  "Sun-sinking Eclipse", "Frosty Resolve", "Empyrean Anthem", "Midnight Veil",
  "Tidebreaking Courage", "Eternal Radiance"
];

const MAIN_ECHOES = [
  "Inferno Rider", "Tempest Mephis", "Impermanence Heron", "Thundering Mephis",
  "Lampylumen Myriad", "Crownless", "Dreamless", "Mourning Aix", "Jué",
  "Fallacy of No Return", "Bell-Borne Geochelone"
];

const STAT_SUGGESTIONS = [
  "Crit Rate", "Crit DMG", "ATK%", "ATK", "Energy Regen", "HP%", "DEF%",
  "Elemental DMG", "Healing Bonus", "Basic Attack DMG", "Heavy Attack DMG",
  "Skill DMG", "Liberation DMG"
];

const BUILD_ROLES = [
  { value: "Main DPS", color: "bg-red-500", icon: "⚔️" },
  { value: "Sub DPS", color: "bg-orange-500", icon: "🗡️" },
  { value: "Support", color: "bg-blue-500", icon: "🛡️" },
  { value: "Healer", color: "bg-green-500", icon: "💚" },
  { value: "Hybrid", color: "bg-purple-500", icon: "⚡" },
];

const BUILD_TEMPLATES = [
  {
    name: "DPS Hypercarry",
    role: "Main DPS",
    stats: ["Crit Rate", "Crit DMG", "ATK%", "Elemental DMG"],
    notes: "Build focalisé sur les dégâts maximaux. Priorisez le Crit Rate jusqu'à 70%, puis le Crit DMG."
  },
  {
    name: "Support Énergétique",
    role: "Support",
    stats: ["Energy Regen", "HP%", "Healing Bonus"],
    notes: "Maintenez l'énergie de l'équipe. Utilisez la Liberation dès qu'elle est prête."
  },
  {
    name: "Tank/Survie",
    role: "Support",
    stats: ["HP%", "DEF%", "Healing Bonus"],
    notes: "Maximisez la survie pour encaisser les hits. Idéal pour les boss difficiles."
  },
];

interface CharacterBuildsProps {
  characterId: string;
}

interface BuildFormData {
  buildName: string;
  weapon: string;
  echoSet1: string;
  echoSet2: string;
  mainEcho: string;
  subStats: string;
  notes: string;
  finalStats: string;
}

export default function CharacterBuilds({ characterId }: CharacterBuildsProps) {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingBuild, setEditingBuild] = useState<CharacterBuild | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");
  const [selectedStats, setSelectedStats] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [viewingBuild, setViewingBuild] = useState<CharacterBuild | null>(null);
  const [favoriteBuildId, setFavoriteBuildId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BuildFormData>({
    buildName: "",
    weapon: "",
    echoSet1: "",
    echoSet2: "",
    mainEcho: "",
    subStats: "",
    notes: "",
    finalStats: "",
  });

  const [filterRole, setFilterRole] = useState<string>("all");
  
  const { data: builds = [], isLoading } = useQuery<CharacterBuild[]>({
    queryKey: [`/api/characters/${characterId}/builds`],
  });

  // Filtrage et tri des builds
  const filteredBuilds = useMemo(() => {
    let filtered = builds.filter((build) =>
      build.buildName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      build.weapon?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      build.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterRole !== "all") {
      filtered = filtered.filter(build => build.buildName.includes(filterRole));
    }

    if (sortBy === "name") {
      filtered.sort((a, b) => a.buildName.localeCompare(b.buildName));
    } else {
      filtered.sort((a, b) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
    }

    return filtered;
  }, [builds, searchQuery, filterRole, sortBy]);

  const createMutation = useMutation({
    mutationFn: async (data: BuildFormData & { characterId: string }) => {
      await apiRequest("POST", "/api/builds", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/characters/${characterId}/builds`] });
      setShowForm(false);
      resetForm();
      toast({
        title: "Succès",
        description: "Build créé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le build",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BuildFormData> }) => {
      await apiRequest("PUT", `/api/builds/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/characters/${characterId}/builds`] });
      setShowForm(false);
      setEditingBuild(null);
      resetForm();
      toast({
        title: "Succès",
        description: "Build modifié avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le build",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/builds/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/characters/${characterId}/builds`] });
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

  const resetForm = () => {
    setFormData({
      buildName: "",
      weapon: "",
      echoSet1: "",
      echoSet2: "",
      mainEcho: "",
      subStats: "",
      notes: "",
      finalStats: "",
    });
    setSelectedStats([]);
    setSelectedRole("");
  };

  const applyTemplate = (template: typeof BUILD_TEMPLATES[0]) => {
    setFormData({
      ...formData,
      buildName: template.name,
      subStats: template.stats.join(", "),
      notes: template.notes,
      finalStats: "",
    });
    setSelectedStats(template.stats);
    setSelectedRole(template.role);
    toast({
      title: "Template appliqué",
      description: `Le template "${template.name}" a été chargé`,
    });
  };

  const addStatTag = (stat: string) => {
    if (!selectedStats.includes(stat)) {
      const newStats = [...selectedStats, stat];
      setSelectedStats(newStats);
      setFormData({ ...formData, subStats: newStats.join(", ") });
    }
  };

  const removeStatTag = (stat: string) => {
    const newStats = selectedStats.filter(s => s !== stat);
    setSelectedStats(newStats);
    setFormData({ ...formData, subStats: newStats.join(", ") });
  };

  const handleEdit = (build: CharacterBuild) => {
    setEditingBuild(build);
    const stats = build.subStats ? build.subStats.split(",").map(s => s.trim()) : [];
    setSelectedStats(stats);
    setSelectedRole(build.buildName.includes("Main DPS") ? "Main DPS" : 
                     build.buildName.includes("Sub DPS") ? "Sub DPS" :
                     build.buildName.includes("Support") ? "Support" :
                     build.buildName.includes("Healer") ? "Healer" : "");
    setFormData({
      buildName: build.buildName,
      weapon: build.weapon || "",
      echoSet1: build.echoSet1 || "",
      echoSet2: build.echoSet2 || "",
      mainEcho: build.mainEcho || "",
      subStats: build.subStats || "",
      notes: build.notes || "",
      finalStats: (build as any).finalStats || "",
    });
    setShowForm(true);
  };

  const handleView = (build: CharacterBuild) => {
    setViewingBuild(build);
  };

  const toggleFavorite = (buildId: string) => {
    setFavoriteBuildId(favoriteBuildId === buildId ? null : buildId);
    toast({
      title: favoriteBuildId === buildId ? "Retiré des favoris" : "Ajouté aux favoris",
      description: "Build marqué comme favori",
    });
  };

  const copyBuildToClipboard = (build: CharacterBuild) => {
    const text = `🌟 ${build.buildName}\n\n` +
      (build.weapon ? `⚔️ Arme: ${build.weapon}\n` : '') +
      (build.mainEcho ? `✨ Echo Principal: ${build.mainEcho}\n` : '') +
      (build.echoSet1 ? `📦 Set 1: ${build.echoSet1}\n` : '') +
      (build.echoSet2 ? `📦 Set 2: ${build.echoSet2}\n` : '') +
      (build.subStats ? `📈 Stats Prioritaires: ${build.subStats}\n` : '') +
      ((build as any).finalStats ? `\n📊 Stats Finales:\n${(build as any).finalStats}\n` : '') +
      (build.notes ? `\n🎯 Stratégie:\n${build.notes}` : '');
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Build copié !",
      description: "Le build a été copié dans le presse-papiers",
    });
  };

  const duplicateBuild = (build: CharacterBuild) => {
    const stats = build.subStats ? build.subStats.split(",").map(s => s.trim()) : [];
    setSelectedStats(stats);
    setFormData({
      buildName: `${build.buildName} (Copie)`,
      weapon: build.weapon || "",
      echoSet1: build.echoSet1 || "",
      echoSet2: build.echoSet2 || "",
      mainEcho: build.mainEcho || "",
      subStats: build.subStats || "",
      notes: build.notes || "",
      finalStats: (build as any).finalStats || "",
    });
    setShowForm(true);
    toast({
      title: "Build dupliqué",
      description: "Modifiez et enregistrez pour créer une copie",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBuild) {
      updateMutation.mutate({ id: editingBuild.id, data: formData });
    } else {
      createMutation.mutate({ ...formData, characterId });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingBuild(null);
    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Mes Builds ({builds.length})
            </CardTitle>
            <CardDescription className="mt-1">
              Gérez vos configurations optimales pour ce personnage
            </CardDescription>
          </div>
          <Button onClick={() => setShowForm(true)} size="sm" className="w-full md:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Créer un build
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {builds.length > 0 && (
          <div className="space-y-3 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un build..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Shield className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les rôles</SelectItem>
                  {BUILD_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.icon} {role.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "recent" | "name")}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récents</SelectItem>
                  <SelectItem value="name">Par nom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {filterRole !== "all" && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-2">
                  Filtre: {BUILD_ROLES.find(r => r.value === filterRole)?.icon} {filterRole}
                  <button onClick={() => setFilterRole("all")} className="ml-1 hover:text-destructive">×</button>
                </Badge>
              </div>
            )}
          </div>
        )}
        
        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : builds.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Aucun build enregistré</p>
            <p className="text-sm mt-2">Créez votre première configuration pour ce personnage</p>
          </div>
        ) : filteredBuilds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Aucun build ne correspond à votre recherche</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredBuilds.map((build) => {
              const isFavorite = favoriteBuildId === build.id;
              const buildRole = BUILD_ROLES.find(r => build.buildName.includes(r.value));
              
              return (
                <Card key={build.id} className={`border-2 hover:shadow-lg transition-all cursor-pointer ${isFavorite ? 'ring-2 ring-yellow-500' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div 
                        className="flex-1 cursor-pointer" 
                        onClick={() => handleView(build)}
                        onKeyDown={(e) => e.key === 'Enter' && handleView(build)}
                        role="button"
                        tabIndex={0}
                      >
                        <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                          <Star 
                            className={`h-5 w-5 cursor-pointer ${isFavorite ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-500'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(build.id);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.stopPropagation();
                                toggleFavorite(build.id);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                          />
                          {build.buildName}
                          {buildRole && (
                            <Badge className={`${buildRole.color} text-white text-xs`}>
                              {buildRole.icon} {buildRole.value}
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          Créé le {new Date(build.createdAt!).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(build);
                          }}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(build.id);
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                <Separator />
                <CardContent className="pt-4 space-y-4" onClick={() => handleView(build)}>
                  {build.weapon && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Sword className="h-4 w-4" />
                        Arme
                      </div>
                      <Badge variant="secondary" className="font-normal">
                        {build.weapon}
                      </Badge>
                    </div>
                  )}
                  
                  {(build.echoSet1 || build.echoSet2 || build.mainEcho) && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Sparkles className="h-4 w-4" />
                        Echos
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {build.mainEcho && (
                          <Badge className="bg-purple-600 hover:bg-purple-700">
                            {build.mainEcho}
                          </Badge>
                        )}
                        {build.echoSet1 && (
                          <Badge variant="outline" className="border-purple-300">
                            {build.echoSet1}
                          </Badge>
                        )}
                        {build.echoSet2 && (
                          <Badge variant="outline" className="border-purple-300">
                            {build.echoSet2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {build.subStats && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <TrendingUp className="h-4 w-4" />
                        Stats Prioritaires
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {build.subStats.split(',').map((stat, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {stat.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {(build as any).finalStats && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        <TrendingUp className="h-4 w-4" />
                        📊 Stats Finales
                      </div>
                      <div className="text-xs font-mono text-muted-foreground bg-emerald-50 dark:bg-emerald-950/20 p-2 rounded border border-emerald-200 dark:border-emerald-800 line-clamp-2">
                        {(build as any).finalStats}
                      </div>
                    </div>
                  )}
                  
                  {build.notes && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Target className="h-4 w-4" />
                        Stratégie
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
                        {build.notes}
                      </p>
                    </div>
                  )}
                  
                  {/* Actions rapides */}
                  <div className="flex gap-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyBuildToClipboard(build);
                      }}
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Copier
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="flex-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateBuild(build);
                      }}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Dupliquer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
            })}
          </div>
        )}
      </CardContent>

      {/* Build Form Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {editingBuild ? "Modifier le build" : "Créer un nouveau build"}
            </DialogTitle>
            <DialogDescription>
              Configurez votre build optimal avec des suggestions intelligentes
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Templates prédéfinis */}
            {!editingBuild && (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg border">
                <Label className="text-sm font-semibold">⚡ Templates Rapides</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {BUILD_TEMPLATES.map((template) => (
                    <Button
                      key={template.name}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template)}
                      className="justify-start text-left h-auto py-2 px-3"
                    >
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-muted-foreground">{template.role}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Nom du build et rôle */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buildName" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Nom du build *
                </Label>
                <Input
                  id="buildName"
                  value={formData.buildName}
                  onChange={(e) => setFormData({ ...formData, buildName: e.target.value })}
                  placeholder="Ex: Build DPS Hypercarry..."
                  required
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Rôle du build
                </Label>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionnez un rôle..." />
                  </SelectTrigger>
                  <SelectContent>
                    {BUILD_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.icon} {role.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Arme avec select */}
            <div className="space-y-2">
              <Label htmlFor="weapon" className="flex items-center gap-2">
                <Sword className="h-4 w-4" />
                Arme recommandée
              </Label>
              <Select
                value={formData.weapon || "none"}
                onValueChange={(value) => setFormData({ ...formData, weapon: value === "none" ? "" : value })}
              >
                <SelectTrigger id="weapon">
                  <SelectValue placeholder="Sélectionnez une arme..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="none">Aucune</SelectItem>
                  {WEAPONS.map((weapon) => (
                    <SelectItem key={weapon} value={weapon}>
                      {weapon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Echos */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Configuration d'Echos
              </Label>
              
              <div className="space-y-2">
                <Label htmlFor="mainEcho" className="text-sm text-muted-foreground">
                  Echo Principal (Cost 4)
                </Label>
                <Select
                  value={formData.mainEcho || "none"}
                  onValueChange={(value) => setFormData({ ...formData, mainEcho: value === "none" ? "" : value })}
                >
                  <SelectTrigger id="mainEcho">
                    <SelectValue placeholder="Choisissez l'echo principal..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="none">Aucun</SelectItem>
                    {MAIN_ECHOES.map((echo) => (
                      <SelectItem key={echo} value={echo}>
                        {echo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="echoSet1" className="text-sm text-muted-foreground">
                    Set d'Echo 1
                  </Label>
                  <Select
                    value={formData.echoSet1 || "none"}
                    onValueChange={(value) => setFormData({ ...formData, echoSet1: value === "none" ? "" : value })}
                  >
                    <SelectTrigger id="echoSet1">
                      <SelectValue placeholder="Premier set..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="none">Aucun</SelectItem>
                      {ECHO_SETS.map((set) => (
                        <SelectItem key={set} value={set}>
                          {set}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="echoSet2" className="text-sm text-muted-foreground">
                    Set d'Echo 2
                  </Label>
                  <Select
                    value={formData.echoSet2 || "none"}
                    onValueChange={(value) => setFormData({ ...formData, echoSet2: value === "none" ? "" : value })}
                  >
                    <SelectTrigger id="echoSet2">
                      <SelectValue placeholder="Second set..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <SelectItem value="none">Aucun</SelectItem>
                      {ECHO_SETS.map((set) => (
                        <SelectItem key={set} value={set}>
                          {set}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Stats prioritaires avec tags */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Stats Prioritaires
              </Label>
              
              {selectedStats.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-md">
                  {selectedStats.map((stat) => (
                    <Badge
                      key={stat}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => removeStatTag(stat)}
                    >
                      {stat} ×
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Cliquez sur les stats pour les ajouter :
                </p>
                <div className="flex flex-wrap gap-2">
                  {STAT_SUGGESTIONS.filter(s => !selectedStats.includes(s)).map((stat) => (
                    <Badge
                      key={stat}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => addStatTag(stat)}
                    >
                      + {stat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Stats Finales */}
            <div className="space-y-2">
              <Label htmlFor="finalStats" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Stats Finales du Build
              </Label>
              <Textarea
                id="finalStats"
                value={formData.finalStats}
                onChange={(e) => setFormData({ ...formData, finalStats: e.target.value })}
                rows={4}
                placeholder="Ex: ATK: 2847 | Crit Rate: 72.4% | Crit DMG: 156.8% | Energy Regen: 125%"
                className="resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Indiquez les statistiques finales de votre build une fois complètement équipé
              </p>
            </div>

            <Separator />

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Notes & Stratégie
              </Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={5}
                placeholder="Décrivez votre stratégie, rotation optimale, conseils d'utilisation..."
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Ajoutez vos recommandations de gameplay, combos, ou toute information utile
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={resetForm}
                className="mr-auto"
              >
                🔄 Réinitialiser
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  "Enregistrement..."
                ) : (
                  editingBuild ? "Modifier le build" : "Créer le build"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Build Detail View Dialog */}
      <Dialog open={!!viewingBuild} onOpenChange={() => setViewingBuild(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {viewingBuild && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  <Star className={`h-6 w-6 ${favoriteBuildId === viewingBuild.id ? 'text-yellow-500 fill-yellow-500' : 'text-yellow-500'}`} />
                  {viewingBuild.buildName}
                </DialogTitle>
                <DialogDescription>
                  Créé le {new Date(viewingBuild.createdAt!).toLocaleDateString('fr-FR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Arme */}
                {viewingBuild.weapon && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <Sword className="h-5 w-5 text-primary" />
                      Arme recommandée
                    </h3>
                    <Card className="border-2 bg-muted/30">
                      <CardContent className="pt-6">
                        <Badge variant="secondary" className="text-base px-4 py-2">
                          {viewingBuild.weapon}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Echos */}
                {(viewingBuild.mainEcho || viewingBuild.echoSet1 || viewingBuild.echoSet2) && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      Configuration d'Echos
                    </h3>
                    <Card className="border-2 bg-muted/30">
                      <CardContent className="pt-6 space-y-4">
                        {viewingBuild.mainEcho && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2 font-medium">Echo Principal (Cost 4)</p>
                            <Badge className="bg-purple-600 hover:bg-purple-700 text-base px-4 py-2">
                              ⭐ {viewingBuild.mainEcho}
                            </Badge>
                          </div>
                        )}
                        {(viewingBuild.echoSet1 || viewingBuild.echoSet2) && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-2 font-medium">Sets d'Echos</p>
                            <div className="flex flex-wrap gap-2">
                              {viewingBuild.echoSet1 && (
                                <Badge variant="outline" className="border-purple-300 text-base px-4 py-2">
                                  {viewingBuild.echoSet1}
                                </Badge>
                              )}
                              {viewingBuild.echoSet2 && (
                                <Badge variant="outline" className="border-purple-300 text-base px-4 py-2">
                                  {viewingBuild.echoSet2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Stats */}
                {viewingBuild.subStats && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Stats Prioritaires
                    </h3>
                    <Card className="border-2 bg-muted/30">
                      <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-2">
                          {viewingBuild.subStats.split(',').map((stat, idx) => (
                            <Badge key={idx} variant="secondary" className="text-base px-3 py-2">
                              {stat.trim()}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Stats Finales */}
                {(viewingBuild as any).finalStats && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <TrendingUp className="h-5 w-5 text-emerald-500" />
                      📊 Stats Finales
                    </h3>
                    <Card className="border-2 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
                      <CardContent className="pt-6">
                        <p className="text-base font-mono whitespace-pre-wrap leading-relaxed text-emerald-900 dark:text-emerald-100">
                          {(viewingBuild as any).finalStats}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Notes */}
                {viewingBuild.notes && (
                  <div className="space-y-3">
                    <h3 className="flex items-center gap-2 text-lg font-semibold">
                      <Target className="h-5 w-5 text-blue-500" />
                      Stratégie & Conseils
                    </h3>
                    <Card className="border-2 bg-muted/30">
                      <CardContent className="pt-6">
                        <p className="text-base whitespace-pre-wrap leading-relaxed">
                          {viewingBuild.notes}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    toggleFavorite(viewingBuild.id);
                  }}
                >
                  <Star className={`h-4 w-4 mr-2 ${favoriteBuildId === viewingBuild.id ? 'fill-yellow-500' : ''}`} />
                  {favoriteBuildId === viewingBuild.id ? 'Retirer des favoris' : 'Marquer comme favori'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewingBuild(null);
                    handleEdit(viewingBuild);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button onClick={() => setViewingBuild(null)}>
                  Fermer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
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
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
