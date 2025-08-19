
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

dev_start() {
    log_info "Démarrage de l'environnement de développement..."
    docker-compose -f docker-compose.dev.yml up --build -d
    log_success "Environnement de développement démarré !"
    log_info "Frontend: http://localhost:4201"
    log_info "Backend: http://localhost:3001"
    log_info "Nginx: http://localhost:8080"
    log_info "Debug port: 9229"
}

dev_stop() {
    log_info "Arrêt de l'environnement de développement..."
    docker-compose -f docker-compose.dev.yml down
    log_success "Environnement de développement arrêté !"
}

dev_restart() {
    if [ -z "$1" ]; then
        log_error "Veuillez spécifier un service (backend, frontend, postgres, mongo, nginx)"
        return 1
    fi
    
    log_info "Redémarrage du service $1..."
    docker-compose -f docker-compose.dev.yml restart "$1"
    log_success "Service $1 redémarré !"
}

dev_logs() {
    if [ -z "$1" ]; then
        log_info "Affichage de tous les logs..."
        docker-compose -f docker-compose.dev.yml logs -f
    else
        log_info "Affichage des logs du service $1..."
        docker-compose -f docker-compose.dev.yml logs -f "$1"
    fi
}

dev_exec() {
    if [ -z "$1" ]; then
        log_error "Veuillez spécifier un service (backend, frontend)"
        return 1
    fi
    
    shift
    log_info "Exécution de la commande dans le service $1..."
    docker-compose -f docker-compose.dev.yml exec "$1" "$@"
}

dev_install() {
    if [ "$1" = "backend" ]; then
        log_info "Installation des dépendances backend..."
        docker-compose -f docker-compose.dev.yml exec backend npm install
    elif [ "$1" = "frontend" ]; then
        log_info "Installation des dépendances frontend..."
        docker-compose -f docker-compose.dev.yml exec frontend npm install
    else
        log_error "Veuillez spécifier 'backend' ou 'frontend'"
        return 1
    fi
    log_success "Dépendances installées !"
}

dev_clean() {
    log_info "Nettoyage de l'environnement de développement..."
    docker-compose -f docker-compose.dev.yml down -v --remove-orphans
    docker system prune -f
    log_success "Environnement nettoyé !"
}

dev_status() {
    log_info "Statut de l'environnement de développement:"
    docker-compose -f docker-compose.dev.yml ps
}

case "$1" in
    "start")
        dev_start
        ;;
    "stop")
        dev_stop
        ;;
    "restart")
        dev_restart "$2"
        ;;
    "logs")
        dev_logs "$2"
        ;;
    "exec")
        service="$2"
        shift 2
        dev_exec "$service" "$@"
        ;;
    "install")
        dev_install "$2"
        ;;
    "clean")
        dev_clean
        ;;
    "status")
        dev_status
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|exec|install|clean|status}"
        echo ""
        echo "Commandes disponibles:"
        echo "  start                    - Démarre l'environnement de développement"
        echo "  stop                     - Arrête l'environnement de développement"
        echo "  restart <service>        - Redémarre un service spécifique"
        echo "  logs [service]           - Affiche les logs (tous ou d'un service)"
        echo "  exec <service> <cmd>     - Exécute une commande dans un conteneur"
        echo "  install <backend|frontend> - Installe les dépendances"
        echo "  clean                    - Nettoie l'environnement"
        echo "  status                   - Affiche le statut des services"
        echo ""
        echo "Exemples:"
        echo "  $0 start"
        echo "  $0 logs backend"
        echo "  $0 exec backend npm run test"
        echo "  $0 install frontend"
        exit 1
esac