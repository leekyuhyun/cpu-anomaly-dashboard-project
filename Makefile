# Makefile
.PHONY: up run start down stop logs

# (1) [최초 설정/재빌드] 프로젝트를 처음 만들었을 때 사용. 이미지를 빌드하고 모든 컨테이너를 실행.
# up: (기존과 동일)
up:
	@echo "Building images and starting all services (Initial setup/Rebuild)..."
	@docker compose up -d --build

# (2) [앱 서비스 실행/재시작] 이미 빌드된 컨테이너를 실행 또는 재시작. (새로운 start의 역할)
# --no-build: 이미지 재빌드 없이 실행 (시간 절약)
# -d: detached mode (백그라운드에서 시작)
start:
	@echo "Starting/restarting application services (db, backend, frontend) in detached mode (no rebuild)..."
	@docker compose up -d --no-build

# (3) [주요 개발 명령어] 컨테이너를 실행(시작)하고, 로그를 출력하여 개발 환경에 접속합니다. (새로운 run의 역할)
# make start 실행 후 make logs를 실행하여 개발 환경을 즉시 재개합니다.
run: start logs

# 완전 종료
down:
	@echo "Stopping and removing all services (Docker)..."
	@docker compose down

# 임시 정지
stop:
	@echo "Stopping all services (Docker)..."
	@docker compose stop

# 로그 실시간 보기 (backend와 frontend 로그만 보기)
logs:
	@echo "Attaching to logs (backend, frontend)..."
	@docker compose logs -f backend frontend