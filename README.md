# 💰 금융 빅데이터 기반 신용카드 사기 거래 탐지 시스템

## 🚀 프로젝트 개요 (Project Overview)

본 프로젝트는 유럽 신용카드 거래 데이터를 기반으로 **지도 학습 모델(RandomForest)**과 **데이터 불균형 해소 기술(SMOTE)**을 활용하여 사기 거래(Fraud)를 실시간으로 탐지하는 웹 애플리케이션 구축을 목표로 합니다.

초기 비지도 학습 모델(Isolation Forest)의 낮은 탐지율(Recall 26%)을 **F1-Score 81%**까지 끌어올리는 모델 개선 과정을 핵심으로 하며, 실제 금융 환경에서 요구되는 높은 탐지율(Recall 77%)을 달성하는 데 초점을 맞췄습니다.

전체 시스템은 **Docker Compose**를 통해 PostgreSQL, FastAPI, React 컨테이너로 구성된 현대적인 MERN/P-F-R 스택 환경에서 구동됩니다.

### ✨ 주요 기술 스택

- **빅데이터 & ML** : `Scikit-learn`,`RandomForest`,`Imbalanced-learn (Smote)`

  - **사용 목적** : 데이터 전처리, 불균형 해소, 모델 학습 및 탐지 로직 구현

- **백엔드(API)** : `FastAPI`

  - **사용 목적** : 고성능 비동기 API 서버 구축, 모델 로드 및 예측 결과 제공

- **데이터베이스** : `PostgreSQL`

  - **사용 목적** : 탐지된 사기 거래 이력 로깅 및 데이터 저장

- **프론트엔드(UI)** : `React`
  - **사용 목적** : 사용자 거래 입력 (30개 피쳐)

## 💾 데이터셋 (Dataset)

### Credit Card Fraud Detection (Kaggle)

- **출처:** [Kaggle - Credit Card Fraud Detection](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud)
- **특징:**
  - 총 284,807건의 유럽 카드 소지자 거래 기록
  - **클래스 불균형:** 사기 거래(`Class=1`)는 전체의 **약 0.172%**에 불과 (492건)
  - **비식별화:** 개인 정보 보호를 위해 대부분의 피처(`V1` ~ `V28`)는 PCA(주성분 분석)를 통해 익명화되어 제공됨.

## 🤖 모델 및 탐지 전략 (Model & Strategy)

본 프로젝트는 극심한 클래스 불균형(Imbalance Data) 환경에서 안정적이고 높은 탐지율을 확보하기 위해 모델을 단계적으로 발전시켰습니다.

### 1. 최종 모델 (Final Model): RandomForest + SMOTE

최종적으로 **지도 학습(Supervised Learning)** 기반의 **RandomForest** 모델을 채택했습니다. 이는 데이터 불균형 문제를 **SMOTE(Synthetic Minority Over-sampling Technique)** 기법으로 해소하여, 사기 거래(소수 클래스)에 대한 예측 능력을 극대화한 결과입니다.

### 2. 모델 선택 과정 및 성능 비교

초기 비지도 학습 모델(Isolation Forest)과 최종 지도 학습 모델의 성능을 비교하여, 데이터 전처리와 모델링 전략의 중요성을 입증했습니다. 금융 분야에서는 **재현율(Recall)**을 높여 실제 사기를 놓치지 않는 것이 가장 중요하며, 최종 모델은 이 목표를 성공적으로 달성했습니다.

- **빅데이터 & ML**
  - **기술 스택:** Python, pandas, scikit-learn, RandomForest, imbalanced-learn (SMOTE), joblib
  - **사용 목적:** 데이터 전처리, 불균형 해소(SMOTE), 모델 학습 및 탐지 로직 구현
- **백엔드 (API)**
  - **기술 스택:** FastAPI, uvicorn
  - **사용 목적:** 고성능 비동기 API 서버 구축, 모델 로드 및 예측 결과 제공
- **데이터베이스**
  - **기술 스택:** PostgreSQL, SQLAlchemy
  - **사용 목적:** 탐지된 사기 거래 이력 로깅 및 모니터링 대시보드 데이터 저장
- **프론트엔드 (UI)**
  - **기술 스택:** React, axios, CSS
  - **사용 목적:** 사용자 거래 입력(30개 피처) 및 실시간 탐지 결과 시각화
- **배포 환경**
  - **기술 스택:** Docker, Docker Compose
  - **사용 목적:** 개발 환경 격리 및 배포 표준화

## 🛠️ 개발 환경 구축 및 실행 방법

### 1. 전제 조건

- Docker Desktop (또는 Docker Engine)
- `make` 유틸리티 (Linux/macOS 기본, Windows는 Git Bash 또는 WSL 권장)
- Kaggle에서 학습된 모델 파일 3가지:

  1.  **`fraud_detector_supervised.pkl`** (최종 RandomForest 모델)
  2.  **`amount_scaler.pkl`** (Amount 스케일러)
  3.  **`time_scaler.pkl`** (Time 스케일러)

- kaggle api key
  ```bash
  # 발급 방법
  1. kaggle 회원가입
  2. 오른쪽 위에 프로필 이미지 클릭
  3. Settings 클릭
  4. API -> create New Token 클릭
  5. Json 형식의 API key 발급
  ```

### 2. 초기 설정 및 파일 배치

1.  **프로젝트 클론 및 이동:**

    ```bash
    git clone https://github.com/leekyuhyun/anomaly-dashboard-project.git
    cd anomaly-dashboard
    ```

2.  **환경 변수 설정:**

    - `.env_example .env` 파일을 복사하여, `.env` 파일을 생성 후 `POSTGRES_PASSWORD` 등을 설정합니다.

3.  **모델 파일 배치:**
    - 미리 Colab에서 학습시켜 다운로드한 **3개의 모델/스케일러 파일(.pkl)**을 프로젝트 최상위 폴더에 배치합니다. (코랩 실행 파일은 data_train.ipynb를 사용하면 됩니다.)
    - (`docker-compose.yml`이 이 파일을 컨테이너의 `/backend/model/` 경로로 마운트합니다.)

### 3. Docker 컨테이너 관리 (Makefile 사용)

프로젝트 루트에서 `make` 명령을 사용하여 컨테이너를 관리합니다.

| 명령어       | 역할                     | 설명                                                                                                                |
| :----------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `make up`    | **최초 빌드 & 시작**     | 이미지를 빌드하고 모든 서비스(DB, BE, FE)를 백그라운드에서 실행합니다. (Dockerfile/requirements.txt 변경 시 재사용) |
| `make start` | **서비스 실행**          | **빌드 없이** 컨테이너를 실행하거나 재시작합니다. 리소스를 절약하는 효율적인 명령어입니다.                          |
| `make run`   | **개발 시작 & 모니터링** | `make start` 후, 백엔드와 프론트엔드의 로그를 실시간으로 출력합니다. (가장 많이 사용)                               |
| `make logs`  | **로그 확인**            | 실행 중인 `backend`와 `frontend`의 로그만 출력합니다.                                                               |
| `make down`  | **완전 종료**            | 모든 컨테이너와 네트워크를 완전히 제거합니다.                                                                       |

### 4. 실행 및 접속

```bash
# 1. (최초 1회) 모든 이미지를 빌드하고 실행
make up

# 2. (일상적) 서비스를 켜고 로그를 보며 개발 시작
make run
```

### 5. 접속 주소 및 DB 확인

- **프론트엔드 (React)** : `http://localhost:3300` (거래 정보 입력 및 결과 확인)
- **백엔드 API (FastAPI)** : `http://localhost:8800/docs` (Swagger UI로 API 스펙 확인)
- **DB 접속 (PostgreSQL)** : 새 터미널 창에서 아래 명령어 입력

```bash
# .env 파일에 설정한 POSTGRES_USER, POSTGRES_DB로 접속
docker compose exec -it db psql -U [POSTGRES_USER] -d [POSTGRES_DB]

# 전체 테이블 확인
\dt

# 테이블 조회
SELECT * FROM 테이블 이름;

# 나가기
\qs
```

## 👥 참여 구성원 (Team)

본 프로젝트에 참여한 구성원 및 역할은 다음과 같습니다.

| 이름 (Name) | 역할 (Role)                                                | GitHub 주소 (Profile)                                          |
| :---------- | :--------------------------------------------------------- | :------------------------------------------------------------- |
| **이규현**  | 백엔드 및 웹 애플리케이션 개발 (Backend & Web Application) | [https://github.com/leekyuhyun](https://github.com/leekyuhyun) |
| **김민한**  | 빅데이터 분석 및 모델링 (Biga Data Analysis & Modeling)    | [https://github.com/minari0v0](https://github.com/minari0v0)   |

---
