# Setup script for Infrastructure Management Modern Frontend
Write-Host "🚀 Configuration du Frontend Moderne" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "`n📦 Vérification de Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installé: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Veuillez l'installer depuis https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if npm is available
Write-Host "`n📦 Vérification de npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm installé: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas disponible" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📥 Installation des dépendances..." -ForegroundColor Yellow
Write-Host "Cela peut prendre quelques minutes..." -ForegroundColor Gray

try {
    npm install
    Write-Host "✅ Dépendances installées avec succès" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur lors de l'installation des dépendances" -ForegroundColor Red
    exit 1
}

# Create .env file if it doesn't exist
Write-Host "`n⚙️  Configuration de l'environnement..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ Fichier .env créé à partir de .env.example" -ForegroundColor Green
    Write-Host "📝 Vous pouvez modifier .env pour personnaliser la configuration" -ForegroundColor Cyan
} else {
    Write-Host "✅ Fichier .env existe déjà" -ForegroundColor Green
}

# Display next steps
Write-Host "`n🎉 Installation terminée avec succès!" -ForegroundColor Green
Write-Host "`n📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "  1. Vérifiez la configuration dans .env" -ForegroundColor White
Write-Host "  2. Démarrez le serveur de développement:" -ForegroundColor White
Write-Host "     npm run dev" -ForegroundColor Yellow
Write-Host "  3. Ouvrez http://localhost:3000 dans votre navigateur" -ForegroundColor White
Write-Host "`n🔧 Commandes utiles:" -ForegroundColor Cyan
Write-Host "  npm run dev      - Serveur de développement" -ForegroundColor White
Write-Host "  npm run build    - Build de production" -ForegroundColor White
Write-Host "  npm run preview  - Prévisualisation du build" -ForegroundColor White
Write-Host "  npm run lint     - Vérification du code" -ForegroundColor White

Write-Host "`n🌟 Votre frontend moderne est prêt!" -ForegroundColor Green
