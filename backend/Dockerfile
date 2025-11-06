# 1. Python 3.12 버전 기반으로 업데이트
FROM python:3.12-slim

# 2. 컨테이너 안의 작업 폴더를 /backend 로 설정합니다.
WORKDIR /backend
# 3. /backend 를 Python 경로에 추가합니다.
ENV PYTHONPATH=/backend

# 4. requirements.txt 파일을 먼저 복사 (빌드 캐시 활용)
COPY requirements.txt .

# 5. 라이브러리를 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 6. 현재 폴더(backend/)의 모든 코드를 컨테이너의 /backend 로 복사합니다.
COPY . .

# 7. 8800번 포트를 외부에 개방합니다.
EXPOSE 8800

# 8. 컨테이너 실행 시 기본 명령어
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8800"]