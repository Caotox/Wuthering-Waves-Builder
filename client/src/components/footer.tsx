export function Footer() {
  return (
    <footer className="border-t py-8 px-4 bg-background mt-auto">
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
                data-testid="link-footer-legal"
              >
                Mentions Légales
              </a>
            </li>
            <li>
              <a 
                href="/privacy" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-footer-privacy"
              >
                Politique de Confidentialité
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
