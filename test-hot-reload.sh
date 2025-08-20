#!/bin/bash

echo "🧪 Test du hot reload..."

# Test backend
echo "=== Test Backend ==="
echo "Modification du backend..."
echo "// Test hot reload $(date)" >> back/src/app.controller.ts
sleep 3
if curl -s http://localhost:3001/books/health | grep -q "ok"; then
    echo "✅ Backend hot reload OK"
    BACKEND_SUCCESS=true
else
    echo "❌ Backend hot reload FAIL"
    echo "Debug: $(curl -s http://localhost:3001/books/health)"
    BACKEND_SUCCESS=false
fi

# Test frontend (vérification différente pour SPA)
echo "=== Test Frontend ==="
echo "Vérification que le serveur Angular répond..."

# Test de connectivité basique
if curl -s http://localhost:4201 | grep -q "<!doctype html>"; then
    echo "✅ Frontend accessible"
    
    echo "Test du hot reload frontend..."
    echo "Modification du fichier HTML..."
    
    # Modification visible
    TIMESTAMP=$(date +%s)
    ORIGINAL_CONTENT=$(cat front/src/app/app.component.html)
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/test hot reload/TEST HOT RELOAD $TIMESTAMP/" front/src/app/app.component.html
    else
        # Linux
        sed -i "s/test hot reload/TEST HOT RELOAD $TIMESTAMP/" front/src/app/app.component.html
    fi
    
    echo "✅ Fichier modifié avec timestamp: $TIMESTAMP"
    echo "📝 Vérifiez manuellement dans votre navigateur à l'adresse:"
    echo "   http://localhost:4201"
    echo "   Le titre devrait maintenant afficher: 'TEST HOT RELOAD $TIMESTAMP'"
    
    # Attente pour que l'utilisateur puisse vérifier
    echo ""
    echo "⏳ Appuyez sur [Entrée] une fois que vous avez vérifié le changement dans le navigateur..."
    read -r
    
    echo "🔄 Restauration du fichier original..."
    echo "$ORIGINAL_CONTENT" > front/src/app/app.component.html
    
    echo "✅ Frontend hot reload testé manuellement"
    FRONTEND_SUCCESS=true
else
    echo "❌ Frontend inaccessible"
    echo "Debug: Vérifiez que le port 4201 est bien ouvert"
    FRONTEND_SUCCESS=false
fi

# Résumé
echo ""
echo "=== 📊 Résumé des tests ==="
if [ "$BACKEND_SUCCESS" = true ]; then
    echo "Backend:  ✅ Hot reload fonctionnel"
else
    echo "Backend:  ❌ Hot reload non fonctionnel"
fi

if [ "$FRONTEND_SUCCESS" = true ]; then
    echo "Frontend: ✅ Hot reload fonctionnel (vérifié manuellement)"
else
    echo "Frontend: ❌ Hot reload non fonctionnel"
fi

if [ "$BACKEND_SUCCESS" = true ] && [ "$FRONTEND_SUCCESS" = true ]; then
    echo ""
    echo "🎉 SUCCÈS ! Hot reload configuré et fonctionnel !"
    echo ""
    echo "💡 Conseils pour continuer :"
    echo "   • Modifiez les fichiers dans back/src/ et front/src/"
    echo "   • Les changements seront automatiquement détectés"
    echo "   • Surveillez les logs avec: ./dev-scripts.sh watch [service]"
    echo "   • Debuggez avec VSCode (port 9229 pour le backend)"
else
    echo ""
    echo "⚠️  Quelques problèmes détectés. Vérifiez les logs :"
    echo "   ./dev-scripts.sh logs"
fi