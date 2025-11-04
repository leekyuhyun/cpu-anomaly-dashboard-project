# Makefile
.PHONY: up up-logs down stop logs init-db

# (기본) 컨테이너를 빌드하고 백그라운드에서 실행
up:
	@echo "Starting all services (Docker) in detached mode..."
	@docker-compose up -d --build

# 로그를 보면서 실행
up-logs:
	@echo "Starting all services (Docker) with logs..."
	@docker-compose up --build

# 완전 종료
down:
	@echo "Stopping and removing all services (Docker)..."
	@docker-compose down

# 임시 정지
stop:
	@echo "Stopping all services (Docker)..."
	@docker-compose stop

# 로그 실시간 보기
logs:
	@echo "Attaching to logs..."
	@docker-compose logs -f

# (Kaggle) DB 초기화 스크립트 실행
# (실행 전: make up 으로 컨테이너를 먼저 켜야 함)
init-db:
	@echo "Checking for merged CSV data (backend/data/cpu_data.csv)..."
	@rem Windows 'cmd.exe'는 if [ ! -f ] 문법을 모르므로 'if not exist'를 사용합니다.
	@if not exist backend\data\cpu_data.csv ( \
		echo "-> Merged CSV not found. Running merge script inside container..." && \
		docker-compose exec backend python scripts/merge_csv.py \
	) else ( \
		echo "-> Merged CSV already exists. Skipping merge." \
	)
	@echo "Initializing database with Kaggle data..."
	@docker-compose exec backend python scripts/init_db.py