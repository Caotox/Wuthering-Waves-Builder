import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    consent: false,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string): string[] => {
    const errors: string[] = [];
    if (password.length < 12) {
      errors.push("Le mot de passe doit contenir au moins 12 caractères");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une minuscule");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins une majuscule");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un chiffre");
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push("Le mot de passe doit contenir au moins un caractère spécial");
    }
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validation côté client
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setErrors(passwordErrors);
      return;
    }

    if (!formData.consent) {
      setErrors(["Vous devez accepter les conditions d'utilisation"]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(Array.isArray(data.errors) ? data.errors : [data.message]);
        return;
      }

      window.location.href = "/";
    } catch (error) {
      setErrors(["Erreur lors de l'inscription. Veuillez réessayer."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Créer un compte</CardTitle>
          <CardDescription className="text-center">
            Rejoignez Wuthering Waves Database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Minimum 12 caractères avec majuscules, minuscules, chiffres et caractères spéciaux
              </p>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="consent"
                checked={formData.consent}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, consent: checked as boolean })
                }
              />
              <label
                htmlFor="consent"
                className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                J'accepte que mes données (email, nom, prénom) soient collectées et utilisées pour la 
                gestion de mon compte sur Wuthering Waves Database. Conformément au RGPD, vous disposez 
                d'un droit d'accès, de modification et de suppression de vos données.{" "}
                <a href="/privacy" className="text-primary underline">
                  En savoir plus
                </a>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Inscription..." : "S'inscrire"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Déjà un compte ? </span>
              <a href="/login" className="text-primary hover:underline">
                Se connecter
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
