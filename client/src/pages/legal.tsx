import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Legal() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
          data-testid="button-back-legal"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-4xl font-serif font-bold mb-8">Mentions Légales</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Éditeur du site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>Nom du site : Wuthering Waves Database</p>
              <p>Type : Base de données de personnages de jeu vidéo</p>
              <p>Nature : Projet scolaire à but non commercial</p>
              <p>Hébergement : Replit</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collecte et traitement des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Données collectées</h3>
                <p>Lors de votre inscription, nous collectons uniquement les informations suivantes :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Adresse email</li>
                  <li>Prénom et nom</li>
                  <li>Photo de profil (optionnelle, fournie par votre compte de connexion)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Finalité du traitement</h3>
                <p>Les données collectées sont utilisées pour :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>La création et gestion de votre compte utilisateur</li>
                  <li>La personnalisation de votre expérience (gestion des favoris)</li>
                  <li>L'amélioration du service</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Durée de conservation</h3>
                <p>
                  Vos données sont conservées tant que votre compte est actif. Vous pouvez demander la suppression de votre
                  compte et de vos données à tout moment.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vos droits (RGPD)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Droit d'accès</strong> : vous pouvez consulter les données que nous détenons sur vous</li>
                <li><strong>Droit de rectification</strong> : vous pouvez modifier vos informations personnelles</li>
                <li><strong>Droit à l'effacement</strong> : vous pouvez demander la suppression de votre compte et de vos données</li>
                <li><strong>Droit à la portabilité</strong> : vous pouvez récupérer vos données dans un format structuré</li>
                <li><strong>Droit d'opposition</strong> : vous pouvez vous opposer au traitement de vos données</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>Nous mettons en œuvre les mesures de sécurité suivantes pour protéger vos données :</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Chiffrement des mots de passe avec bcrypt</li>
                <li>Connexion HTTPS sécurisée</li>
                <li>Protection contre les injections SQL et XSS</li>
                <li>Protection CSRF sur tous les formulaires</li>
                <li>Sessions sécurisées avec cookies HttpOnly, Secure et SameSite</li>
                <li>Contrôle d'accès basé sur les rôles</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                Ce site utilise uniquement des cookies de session essentiels au fonctionnement de l'authentification.
                Ces cookies sont supprimés lorsque vous vous déconnectez ou fermez votre navigateur.
              </p>
              <p className="mt-2">
                Nous n'utilisons pas de cookies de suivi ou de publicité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>
                Wuthering Waves est une marque déposée de Kuro Games. Ce site est un projet scolaire non officiel
                et n'est pas affilié à Kuro Games.
              </p>
              <p className="mt-2">
                Les images et informations sur les personnages appartiennent à leurs créateurs respectifs.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
