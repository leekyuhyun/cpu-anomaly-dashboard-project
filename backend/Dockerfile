# 1. Python 3.10 버전을 기반으로 합니다.
FROM python:3.10-slim

# 2. 컨테이너 안의 작업 폴더를 /app 으로 설정합니다.
WORKDIR /app

# 3. requirements.txt 파일을 먼저 복사합니다.
# (파일이 변경됐을 때만 라이브러리를 다시 설치하도록 함)
COPY requirements.txt .

# 4. 라이브러리를 설치합니다.
RUN pip install --no-cache-dir -r requirements.txt

# 5. (참고) 현재 폴더의 모든 코드를 /app 으로 복사합니다.
# (docker-compose에서 볼륨 마운트로 덮어쓸 예정이라 지금 당장 큰 의미는 없습니다.)
COPY . .

# 8000번 포트를 외부에 개방합니다.
EXPOSE 8000