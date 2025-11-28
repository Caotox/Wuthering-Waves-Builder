import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Database, Users, Lock } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-6xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Wuthering Waves Database
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Base de données complète et sécurisée des personnages de Wuthering Waves
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="text-lg px-8" 
              onClick={() => window.location.href = "/login"}
              data-testid="button-login"
            >
              Se connecter
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => window.location.href = "/register"}
              data-testid="button-signup"
            >
              Créer un compte
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">
            Caractéristiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <Database className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Base complète</h3>
                <p className="text-muted-foreground">
                  Tous les personnages avec leurs statistiques détaillées
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Sécurité maximale</h3>
                <p className="text-muted-foreground">
                  Protection contre SQL injection, XSS et CSRF
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Système de favoris</h3>
                <p className="text-muted-foreground">
                  Gérez votre collection de personnages préférés
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover-elevate">
              <CardContent className="p-6">
                <Lock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">RGPD conforme</h3>
                <p className="text-muted-foreground">
                  Respect de votre vie privée et de vos données
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-semibold mb-4 font-serif text-lg">Wuthering Waves DB</h4>
            <p className="text-sm text-muted-foreground">
              Base de données non officielle pour les passionnés de Wuthering Waves
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              © 2025 - Projet scolaire
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Liens rapides</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Accueil
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="/legal" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-legal"
                >
                  Mentions Légales
                </a>
              </li>
              <li>
                <a 
                  href="/privacy" 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-privacy"
                >
                  Politique de Confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
