
# (기본) 컨테이너를 빌드하고 백그라운드에서 실행합니다.
up:
	@echo "Starting all services (Docker) in detached mode..."
	@docker-compose up -d --build

# 컨테이너를 빌드하고 로그를 보면서 실행합니다. (개발/디버깅 시 유용)
up-logs:
	@echo "Starting all services (Docker) with logs..."
	@docker-compose up --build

# 모든 서비스 컨테이너를 중지하고 제거합니다. (완전 종료)
down:
	@echo "Stopping and removing all services (Docker)..."
	@docker-compose down

# 모든 서비스 컨테이너를 중지합니다. (데이터는 보존, 임시 정지)
stop:
	@echo "Stopping all services (Docker)..."
	@docker-compose stop

# 실행 중인 컨테이너의 로그를 실시간으로 봅니다.
logs:
	@echo "Attaching to logs..."
	@docker-compose logs -f

