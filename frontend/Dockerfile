# Node 20 LTS 버전 기반으로 업데이트 (React)
FROM node:20-alpine 

WORKDIR /frontend

# package.json 및 package-lock.json 복사 및 의존성 설치
COPY package*.json ./ 

RUN npm install

# 나머지 코드 복사
COPY . . 

# 3300 포트 노출
EXPOSE 3300

# 개발 서버 실행 명령어
CMD ["npm", "start"]