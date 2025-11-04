# CPU 사용률 이상 탐지 대시보드 (CPU Anomaly Dashboard)

서버의 CPU 사용률 데이터를 분석하여 비정상적인 패턴(이상 징후)을 탐지하고,
이를 실시간 웹 대시보드로 시각화하는 프로젝트입니다.

---

## 🛠 기술 스택 (Tech Stack)

### 뱃지 (Badges)

![Python](https://img.shields.io/badge/Python-3.10-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-24.0-2496ED?logo=docker&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/SciKit_Learn-1.4.0-F89939?logo=scikit-learn&logoColor=white)

### 상세

- **Backend:** Python, FastAPI
- **Frontend:** React (JavaScript)
- **Database:** PostgreSQL (via Docker)
- **Orchestration:** Docker Compose
- **ML Model:** Scikit-learn (Isolation Forest 등)

---

## 🚀 실행 방법 (Docker)

이 프로젝트는 Docker Compose를 사용하여 모든 서비스(DB, Backend, Frontend)를 한 번에 실행합니다.

### 📂 프로젝트 설정 (최초 1회)

프로젝트를 처음 실행할 때, 환경 변수 설정과 DB 초기화가 필요합니다.

1. 환경 변수 파일 생성

   프로젝트에 포함된 `.env.example` 파일 2개를 복사하여 `.env` 파일을 생성합니다.

   ```bash
   # 1. 최상위 폴더 (docker-compose.yml이 있는 곳)
   cp .env.example .env
   # 2. frontend 폴더
   cp frontend/.env.example frontend/.env
   ```

   - (필요시) `.env` 파일을 열어 `POSTGRES_PASSWORD` 등을 원하는 값으로 수정합니다.

2. **Docker 서비스 실행**

   `make` 명령어를 사용해 Docker 컨테이너를 빌드하고 실행합니다.

   ```bash
   make up
   ```

3. 데이터베이스 초기화 및 데이터 적재
   `make` 명령어를 사용해 `backend` 컨테이너 내부에서 `init_db.py` 스크립트를 실행합니다.

   ```bash
   make init-db
   ```

- 이 명령어는 `Makefile` 설정에 따라 `data/cpu_data.csv` 파일이 없으면 자동으로 CSV 병합 스크립트(`scripts/merge_csv.py`)를 먼저 실행한 뒤,

- DB 테이블을 생성하고 병합된 CSV 데이터를 `cpu_metrics` 테이블에 삽입합니다.

---

### 🚀 일반 실행 (Docker)

최초 1회 설정이 완료된 후에는 `make up`과 `make down`` 만으로 프로젝트를 실행/종료할 수 있습니다.

1. 프로젝트 실행 (백그라운드)

   ```bash
   # 프로젝트 최상위 폴더에서 실행
   make up
   ```

   - `db`, `backend`, `frontend` 3개의 컨테이너가 모두 실행됩니다.

2. 서비스 접속

   - **Frontend (React App)**: `http://localhost:3300`

   - **Backend (FastAPI Docs)**: `http://localhost:8800/docs`

3. 프로젝트 종료 (모든 컨테이너 중지 및 삭제)
   ```bash
   make down
   ```

### 🗃️ DB 데이터 확인 방법

`make up`으로 컨테이너가 실행 중일 때, 다음 명령어로 `db` 컨테이너(PostgreSQL)에 직접 접속할 수 있습니다.

1.  PostgreSQL 컨테이너 접속
    터미널에서 아래 명령어를 실행합니다. (`[USER]`와 `[DB_NAME]`은 `.env` 파일에 설정한 `POSTGRES_USER`와 `POSTGRES_DB` 값으로 대체하세요.)

    ```bash
    docker-compose exec -it db psql -U [USER] -d [DB_NAME]
    ```

2.  SQL 쿼리 실행
    `psql` 프롬포트 (`...=#`)에서 SQL 쿼리를 입력하여 데이터를 확인합니다.

        ```bash
        -- 모든 테이블 목록 보기

        \dt

        -- servers 테이블 데이터 확인
        SELECT \* FROM servers;

        -- cpu_metrics 테이블에 적재된 데이터 총 개수 확인 (예: 40320)
        SELECT COUNT(\*) FROM cpu_metrics;

        -- cpu_metrics 테이블 샘플 데이터 5개 확인
        SELECT \* FROM cpu_metrics LIMIT 5;

        -- (종료 시) psql 종료
        \q
        ```

## 🌿 브랜치 전략 (Branch Strategy)

- **`main`**: 최종 배포 버전
- **`develop`**: `main` 브랜치로 병합(Merge) 전, 통합 테스트를 진행하는 브랜치
- **`frontend`**: 프론트엔드 기능 개발 브랜치. (`frontend/` 폴더만 수정)
- **`backend`**: 백엔드 기능 개발 브랜치. (`backend/` 폴더만 수정)

```

```
