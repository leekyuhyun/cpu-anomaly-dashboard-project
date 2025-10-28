# CPU 사용률 이상 탐지 대시보드 (CPU Anomaly Dashboard)

서버의 CPU 사용률 데이터를 분석하여 비정상적인 패턴(이상 징후)을 탐지하고,
이를 실시간 웹 대시보드로 시각화하는 프로젝트입니다.

---

## 🛠 기술 스택 (Tech Stack)

* **Backend:** Python, FastAPI
* **Frontend:** React (JavaScript)
* **Database:** PostgreSQL (via Docker)
* **Orchestration:** Docker Compose
* **ML Model:** Scikit-learn (Isolation Forest 등)

---

## 🚀 실행 방법 (Docker)

이 프로젝트는 Docker Compose를 사용하여 모든 서비스(DB, Backend, Frontend)를 한 번에 실행합니다.

1.  **프로젝트 실행 (백그라운드)**
    ```bash
    # 프로젝트 최상위 폴더에서 실행
    make up
    ```
    * `db`, `backend`, `frontend` 3개의 컨테이너가 모두 빌드되고 실행됩니다.

2.  **서비스 접속**
    * **Frontend (React App):** `http://localhost:3000`
    * **Backend (FastAPI Docs):** `http://localhost:8000/docs`

3.  **프로젝트 종료 (모든 컨테이너 중지 및 삭제)**
    ```bash
    make down
    ```

---

## 🌿 브랜치 전략 (Branch Strategy)

* **`main`**: 최종 배포 버전
* **`develop`**: `main` 브랜치로 병합(Merge) 전, 통합 테스트를 진행하는 브랜치
* **`frontend`**: 프론트엔드 기능 개발 브랜치. (`frontend/` 폴더만 수정)
* **`backend`**: 백엔드 기능 개발 브랜치. (`backend/` 폴더만 수정)