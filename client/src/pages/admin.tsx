import { useQuery, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash2, Shield, Users } from "lucide-react";
import BuildsAdminTab from "@/components/builds-admin-tab";
import type { Character, InsertCharacter, User } from "@shared/schema";
import { useLocation } from "wouter";

interface UserWithoutPassword extends Omit<User, 'password'> {}

export default function Admin() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [formData, setFormData] = useState<InsertCharacter>({
    name: "",
    imageUrl: "",
    rarity: 5,
    weaponType: "Sword",
    element: "Glacio",
    description: "",
  });

  // States pour la gestion des utilisateurs
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithoutPassword | null>(null);
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "USER" as "USER" | "ADMIN",
  });

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être administrateur pour accéder à cette page",
        variant: "destructive",
      });
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [isAuthenticated, authLoading, user, toast, navigate]);

  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
    enabled: isAuthenticated && user?.role === "ADMIN",
  });

  const { data: users = [], isLoading: usersLoading } = useQuery<UserWithoutPassword[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.role === "ADMIN",
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCharacter) => {
      await apiRequest("POST", "/api/admin/characters", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      setShowForm(false);
      resetForm();
      toast({
        title: "Succès",
        description: "Personnage créé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le personnage",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: InsertCharacter }) => {
      await apiRequest("PUT", `/api/admin/characters/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      setShowForm(false);
      setEditingCharacter(null);
      resetForm();
      toast({
        title: "Succès",
        description: "Personnage modifié avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le personnage",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/characters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      setDeleteConfirm(null);
      toast({
        title: "Succès",
        description: "Personnage supprimé avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le personnage",
        variant: "destructive",
      });
    },
  });

  // Mutations pour les utilisateurs
  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof userFormData }) => {
      await apiRequest("PUT", `/api/admin/users/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setShowUserForm(false);
      setEditingUser(null);
      resetUserForm();
      toast({
        title: "Succès",
        description: "Utilisateur modifié avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de modifier l'utilisateur",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setDeleteUserConfirm(null);
      toast({
        title: "Succès",
        description: "Utilisateur supprimé avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer l'utilisateur",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      imageUrl: "",
      rarity: 5,
      weaponType: "Sword",
      element: "Glacio",
      description: "",
    });
  };

  const resetUserForm = () => {
    setUserFormData({
      email: "",
      firstName: "",
      lastName: "",
      role: "USER",
    });
  };

  const handleEdit = (character: Character) => {
    setEditingCharacter(character);
    setFormData({
      name: character.name,
      imageUrl: character.imageUrl,
      rarity: character.rarity,
      weaponType: character.weaponType,
      element: character.element,
      description: character.description || "",
    });
    setShowForm(true);
  };

  const handleEditUser = (userToEdit: UserWithoutPassword) => {
    setEditingUser(userToEdit);
    setUserFormData({
      email: userToEdit.email,
      firstName: userToEdit.firstName,
      lastName: userToEdit.lastName,
      role: userToEdit.role as "USER" | "ADMIN",
    });
    setShowUserForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCharacter) {
      updateMutation.mutate({ id: editingCharacter.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, data: userFormData });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCharacter(null);
    resetForm();
  };

  const handleUserCancel = () => {
    setShowUserForm(false);
    setEditingUser(null);
    resetUserForm();
  };

  if (authLoading || !isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-serif font-bold">Panel Administrateur</h1>
        </div>

        <Tabs defaultValue="characters" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="characters">Personnages</TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="builds">
              <Shield className="h-4 w-4 mr-2" />
              Builds
            </TabsTrigger>
          </TabsList>

          <TabsContent value="characters">
            <div className="flex justify-end mb-4">
              <Button onClick={() => setShowForm(true)} data-testid="button-add-character">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un personnage
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Gestion des personnages</CardTitle>
              </CardHeader>
              <CardContent>
            {isLoading ? (
              <p>Chargement...</p>
            ) : characters.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Aucun personnage. Commencez par en ajouter un !
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Rareté</TableHead>
                      <TableHead>Élément</TableHead>
                      <TableHead>Arme</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {characters.map((character) => (
                      <TableRow key={character.id} data-testid={`row-character-${character.id}`}>
                        <TableCell>
                          <img
                            src={character.imageUrl}
                            alt={character.name}
                            className="h-12 w-12 object-cover rounded"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/48/1e293b/64748b`;
                            }}
                          />
                        </TableCell>
                        <TableCell className="font-semibold">{character.name}</TableCell>
                        <TableCell>
                          <Badge variant={character.rarity === 5 ? "default" : "secondary"}>
                            {character.rarity}★
                          </Badge>
                        </TableCell>
                        <TableCell>{character.element}</TableCell>
                        <TableCell>{character.weaponType}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(character)}
                              data-testid={`button-edit-${character.id}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteConfirm(character.id)}
                              data-testid={`button-delete-${character.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs ({users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <p>Chargement...</p>
                ) : users.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Aucun utilisateur
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Inscription</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((userItem) => (
                          <TableRow key={userItem.id}>
                            <TableCell className="font-medium">{userItem.email}</TableCell>
                            <TableCell>{userItem.firstName} {userItem.lastName}</TableCell>
                            <TableCell>
                              <Badge variant={userItem.role === "ADMIN" ? "default" : "secondary"}>
                                {userItem.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditUser(userItem)}
                                  disabled={userItem.id === user?.id}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => setDeleteUserConfirm(userItem.id)}
                                  disabled={userItem.id === user?.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="builds">
            <BuildsAdminTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Character Form Dialog */}
      <Dialog open={showForm} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCharacter ? "Modifier le personnage" : "Ajouter un personnage"}
            </DialogTitle>
            <DialogDescription>
              Remplissez tous les champs pour {editingCharacter ? "modifier" : "créer"} un personnage
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL de l'image *</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  required
                  data-testid="input-image-url"
                />
              </div>
            </div>

            {formData.imageUrl && (
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rarity">Rareté *</Label>
                <Select
                  value={formData.rarity.toString()}
                  onValueChange={(value) => setFormData({ ...formData, rarity: parseInt(value) })}
                >
                  <SelectTrigger data-testid="select-rarity-form">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="4">4 étoiles</SelectItem>
                    <SelectItem value="5">5 étoiles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weaponType">Type d'arme *</Label>
                <Select
                  value={formData.weaponType}
                  onValueChange={(value) => setFormData({ ...formData, weaponType: value })}
                >
                  <SelectTrigger data-testid="select-weapon-form">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sword">Épée</SelectItem>
                    <SelectItem value="Broadblade">Lame</SelectItem>
                    <SelectItem value="Pistols">Pistolets</SelectItem>
                    <SelectItem value="Gauntlets">Gantelets</SelectItem>
                    <SelectItem value="Rectifier">Rectifier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="element">Élément *</Label>
                <Select
                  value={formData.element}
                  onValueChange={(value) => setFormData({ ...formData, element: value })}
                >
                  <SelectTrigger data-testid="select-element-form">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Glacio">Glacio</SelectItem>
                    <SelectItem value="Fusion">Fusion</SelectItem>
                    <SelectItem value="Electro">Electro</SelectItem>
                    <SelectItem value="Aero">Aero</SelectItem>
                    <SelectItem value="Spectro">Spectro</SelectItem>
                    <SelectItem value="Havoc">Havoc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optionnelle)</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                data-testid="textarea-description"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                data-testid="button-submit-character"
              >
                {editingCharacter ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Edit Form Dialog */}
      <Dialog open={showUserForm} onOpenChange={(open) => !open && handleUserCancel()}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={userFormData.email}
                onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-firstName">Prénom</Label>
              <Input
                id="user-firstName"
                value={userFormData.firstName}
                onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-lastName">Nom</Label>
              <Input
                id="user-lastName"
                value={userFormData.lastName}
                onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Rôle</Label>
              <Select 
                value={userFormData.role} 
                onValueChange={(value: "USER" | "ADMIN") => setUserFormData({ ...userFormData, role: value })}
                disabled={editingUser?.id === user?.id}
              >
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER">USER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                </SelectContent>
              </Select>
              {editingUser?.id === user?.id && (
                <p className="text-xs text-muted-foreground">
                  Vous ne pouvez pas modifier votre propre rôle
                </p>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleUserCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={updateUserMutation.isPending}>
                Modifier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Character Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce personnage ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete User Confirmation */}
      <AlertDialog open={!!deleteUserConfirm} onOpenChange={() => setDeleteUserConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible et supprimera également tous ses favoris.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserConfirm && deleteUserMutation.mutate(deleteUserConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
