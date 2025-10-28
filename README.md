# CPU 사용률 이상 탐지 대시보드 (CPU Anomaly Dashboard)

서버의 CPU 사용률 데이터를 분석하여 비정상적인 패턴(이상 징후)을 탐지하고,
이를 실시간 웹 대시보드로 시각화하는 프로젝트입니다.

---

## 🛠 기술 스택 (Tech Stack)

* **Backend:** Python, FastAPI
* **Frontend:** React (JavaScript)
* **ML Model:** Scikit-learn (Isolation Forest 등)

---

## 🚀 실행 방법 (Local)

### 1. Backend

```bash
# /backend 폴더로 이동
cd backend

# (가상환경 활성화)
# source venv/bin/activate 

# FastAPI 서버 실행
uvicorn main:app --reload
```

### 2. Frontend
```bash
# /frontend 폴더로 이동
cd frontend

# React 앱 실행
npm start
```

## 🌿 브랜치 전략 (Branch Strategy)
- main: 최종 배포 버전

- develop: main 브랜치로 병합(Merge) 전, 통합 테스트를 진행하는 브랜치

- frontend: 프론트엔드 기능 개발 브랜치. (frontend/ 폴더만 수정)

- backend: 백엔드 기능 개발 브랜치. (backend/ 폴더만 수정)