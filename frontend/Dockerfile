# 1. Node.js 18 버전을 기반으로 합니다.
FROM node:18-alpine

# 2. 컨테이너 안의 작업 폴더를 /frontend 로 설정합니다.
WORKDIR /frontend

# 3. package.json 파일을 먼저 복사 (빌드 캐시 활용)
COPY package.json package-lock.json* ./

# 4. 라이브러리를 설치합니다. (ci가 더 빠르고 일관적입니다)
RUN npm ci

# 5. 현재 폴더(frontend/)의 모든 코드를 컨테이너의 /frontend 로 복사합니다.
COPY . .

# 6. 3300번 포트를 외부에 개방합니다.
EXPOSE 3300

# 7. 컨테이너 실행 시 기본 명령어
CMD ["npm", "start"]