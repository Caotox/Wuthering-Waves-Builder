# Configuration HTTPS Local

## 🔒 Certificats SSL générés

Le projet utilise **mkcert** pour générer des certificats SSL valides pour le développement local.

### Certificats créés
- `certs/localhost-cert.pem` - Certificat SSL
- `certs/localhost-key.pem` - Clé privée

### Validité
- ✅ Valables pour : `localhost`, `127.0.0.1`, `::1`
- 📅 Expiration : **1 mars 2028**

## �� Utilisation

### Démarrer en HTTPS
```bash
npm run dev
```

Le serveur démarre maintenant sur **https://localhost:6500** (au lieu de http)

### Vérification
1. Ouvrir https://localhost:6500 dans le navigateur
2. Le cadenas vert devrait apparaître ✅
3. Pas d'avertissement de sécurité

## 🔧 Configuration technique

### Vite (vite.config.ts)
```typescript
server: {
  https: {
    key: fs.readFileSync("certs/localhost-key.pem"),
    cert: fs.readFileSync("certs/localhost-cert.pem"),
  }
}
```

### Express (server/app.ts)
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      connectSrc: ["'self'", "wss://localhost:*", "wss://127.0.0.1:*"],
    },
  },
}));
```

### HMR WebSocket
Le Hot Module Replacement utilise maintenant **wss://** (WebSocket sécurisé)

## 🍪 Cookies sécurisés

Avec HTTPS activé, les cookies utilisent maintenant :
- ✅ `Secure: true` - Cookie uniquement transmis en HTTPS
- ✅ `HttpOnly: true` - Protection contre XSS
- ✅ `SameSite: 'strict'` - Protection CSRF

## 🔐 Sécurité

### mkcert
- Installe une **Certification Authority (CA) locale**
- Les certificats sont **automatiquement approuvés** par le système
- Ne fonctionne que sur **votre machine** (localhost)
- Pas besoin de configuration manuelle du navigateur

### Installation de mkcert
```bash
# macOS
brew install mkcert
mkcert -install

# Générer les certificats
mkcert -key-file certs/localhost-key.pem \
       -cert-file certs/localhost-cert.pem \
       localhost 127.0.0.1 ::1
```

## ⚠️ Important

### Ne pas commit les certificats
Les certificats sont dans `.gitignore` :
```
certs/
```

### Régénération
Si les certificats expirent ou sont perdus :
```bash
rm -rf certs/
mkdir certs
mkcert -key-file certs/localhost-key.pem \
       -cert-file certs/localhost-cert.pem \
       localhost 127.0.0.1 ::1
```

## ✅ Conformité cahier des charges

### Critère 1.7 : Cookie Secure
- ✅ Cookie `Secure` flag actif en HTTPS
- ✅ Testable localement sans déploiement
- ✅ Conforme aux standards de sécurité

### Avant HTTPS
```javascript
// Cookie non sécurisé (HTTP)
Set-Cookie: sessionId=abc123; HttpOnly; SameSite=strict
```

### Après HTTPS
```javascript
// Cookie sécurisé (HTTPS)
Set-Cookie: sessionId=abc123; Secure; HttpOnly; SameSite=strict
```

## 🧪 Tests

### Vérifier les cookies sécurisés
1. Ouvrir DevTools (F12)
2. Application → Cookies
3. Vérifier que `Secure` est coché ✅

### Vérifier HTTPS
```bash
curl -I https://localhost:6500
# HTTP/2 200
# strict-transport-security: max-age=31536000; includeSubDomains; preload
```

## 📚 Ressources

- [mkcert Documentation](https://github.com/FiloSottile/mkcert)
- [Vite HTTPS Config](https://vitejs.dev/config/server-options.html#server-https)
- [HTTPS Best Practices](https://web.dev/why-https-matters/)
