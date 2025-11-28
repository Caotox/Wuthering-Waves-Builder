import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function Privacy() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-8"
          data-testid="button-back-privacy"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <h1 className="text-4xl font-serif font-bold mb-8">Politique de Confidentialité</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                La protection de vos données personnelles est une priorité pour nous. Cette politique de confidentialité
                explique comment nous collectons, utilisons et protégeons vos informations personnelles conformément au
                Règlement Général sur la Protection des Données (RGPD).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Principe de minimisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Nous appliquons strictement le principe de minimisation des données. Nous ne collectons que les informations
                strictement nécessaires au fonctionnement du service :
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Email</strong> : pour l'authentification et la communication</li>
                <li><strong>Nom et prénom</strong> : pour personnaliser votre expérience</li>
                <li><strong>Photo de profil</strong> : optionnelle, fournie par votre méthode de connexion</li>
              </ul>
              <p className="mt-4">
                <strong>Nous ne collectons jamais</strong> : date de naissance, numéro de sécurité sociale, adresse postale
                complète, numéro de téléphone, ou toute autre donnée sensible non nécessaire.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consentement explicite</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Lors de votre inscription, vous devez donner votre consentement explicite pour le traitement de vos données.
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>La case de consentement n'est jamais pré-cochée</li>
                <li>Vous pouvez retirer votre consentement à tout moment</li>
                <li>Le retrait du consentement entraîne la suppression de votre compte</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilisation des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Vos données sont utilisées uniquement pour :</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Créer et gérer votre compte utilisateur</li>
                <li>Vous permettre de marquer des personnages comme favoris</li>
                <li>Améliorer l'expérience utilisateur</li>
              </ul>
              <p className="mt-4">
                <strong>Nous ne vendons jamais vos données</strong> à des tiers et ne les utilisons pas à des fins publicitaires.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Partage des données</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Vos données ne sont partagées avec aucun tiers, sauf obligation légale. Nous n'utilisons pas de services
                tiers d'analyse ou de publicité.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conservation des données</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Vos données sont conservées tant que votre compte est actif. Si vous supprimez votre compte, toutes vos
                données personnelles sont immédiatement supprimées de nos serveurs, y compris :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Vos informations de profil</li>
                <li>Vos favoris</li>
                <li>Vos sessions de connexion</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sécurité des données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles :</p>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Mesures techniques</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Chiffrement des mots de passe avec bcrypt (algorithme moderne approuvé)</li>
                  <li>Connexions HTTPS exclusivement (chiffrement TLS)</li>
                  <li>Headers de sécurité HTTP (X-Content-Type-Options, X-Frame-Options, CSP)</li>
                  <li>Protection contre les injections SQL (requêtes préparées)</li>
                  <li>Protection contre les attaques XSS (échappement des données)</li>
                  <li>Protection CSRF avec tokens uniques</li>
                  <li>Sessions sécurisées (HttpOnly, Secure, SameSite=Strict)</li>
                  <li>Contrôle d'accès strict (vérification IDOR, protection des routes admin)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Mesures organisationnelles</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Accès limité aux données (principe du moindre privilège)</li>
                  <li>Audit de sécurité régulier des dépendances</li>
                  <li>Mode debug désactivé en production</li>
                  <li>Secrets stockés dans des variables d'environnement sécurisées</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vos droits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Vous disposez des droits suivants sur vos données personnelles :</p>
              
              <div>
                <h3 className="font-semibold text-foreground mb-2">Droit d'accès</h3>
                <p>Vous pouvez consulter toutes les données que nous détenons sur vous.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Droit de rectification</h3>
                <p>Vous pouvez modifier vos informations personnelles à tout moment.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Droit à l'effacement</h3>
                <p>Vous pouvez demander la suppression complète de votre compte et de toutes vos données.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Droit à la portabilité</h3>
                <p>Vous pouvez récupérer vos données dans un format structuré et couramment utilisé (JSON).</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Droit d'opposition</h3>
                <p>Vous pouvez vous opposer au traitement de vos données pour des motifs légitimes.</p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Droit de limitation</h3>
                <p>Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cookies et traceurs</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Ce site utilise uniquement un cookie de session essentiel au fonctionnement de l'authentification.
                Ce cookie :
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Est strictement nécessaire au service (pas besoin de consentement séparé)</li>
                <li>Expire après 7 jours d'inactivité</li>
                <li>Est sécurisé (HttpOnly, Secure, SameSite=Strict)</li>
                <li>Ne contient aucune donnée personnelle lisible</li>
                <li>Est supprimé à la déconnexion</li>
              </ul>
              <p className="mt-4">
                <strong>Nous n'utilisons aucun</strong> cookie de suivi, cookie publicitaire, ou cookie d'analyse tiers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modifications de cette politique</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité. En cas de changement significatif,
                nous vous en informerons par email ou via une notification sur le site.
              </p>
              <p className="mt-2">
                Date de dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p>
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits,
                vous pouvez nous contacter via le formulaire de contact du site.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
