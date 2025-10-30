# 1. Node.js 18 버전을 기반으로 합니다.
FROM node:18-alpine

# 2. 컨테이너 안의 작업 폴더를 /app 으로 설정합니다.
WORKDIR /app

# 3. package.json 파일을 먼저 복사합니다.
COPY package.json .

# 4. 라이브러리를 설치합니다.
RUN npm install

# 5. (참고) 현재 폴더의 모든 코드를 /app 으로 복사합니다.
COPY . .

# 3300번 포트를 외부에 개방합니다.
EXPOSE 3300

# "npm start" 명령어를 실행합니다.
CMD ["npm", "start"]