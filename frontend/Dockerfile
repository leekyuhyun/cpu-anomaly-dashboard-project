# 1. 기반 이미지 설정
# Node.js 18 버전의 가벼운 'alpine' 리눅스 이미지를 기반으로 시작합니다.
FROM node:18-alpine

# 2. 작업 디렉토리 설정
# 컨테이너 내부에서 작업할 기본 폴더를 '/app'으로 지정합니다.
# (docker-compose.yml의 volumes 경로와 일치시키는 것이 좋습니다)
WORKDIR /frontend

# 3. 의존성 파일 복사 (빌드 캐시 활용)
# node_modules 설치에 필요한 package.json 파일을 먼저 복사합니다.
# (이 파일이 변경됐을 때만 다음 단계(npm install)가 실행됩니다)
COPY package.json .

# 4. 의존성 설치
# package.json을 기반으로 모든 npm 라이브러리를 설치합니다.
RUN npm install

# 5. 소스 코드 복사
# 현재 로컬 폴더(frontend/)의 모든 파일(.)을
# 컨테이너의 작업 디렉토리(/app)로 복사합니다.
COPY . .

# 6. 포트 개방 (EXPOSE)
# 컨테이너가 3300번 포트를 사용할 것이라고 Docker에 알립니다.
# (docker-compose.yml의 $PORT 및 ports 설정과 일치해야 합니다)
EXPOSE 3300 

# 7. 기본 실행 명령어 (CMD)
# 컨테이너가 시작될 때 자동으로 "npm start" 명령어를 실행합니다.
CMD ["npm", "start"]

