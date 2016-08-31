# Project

DataVisualization

외부 데이터를 시각화하여 사용자에게 제공하는 서비스 입니다.
JSON 포맷형태의 REST API 지원 및 DataBase에 대한 접근을 제공합니다.

# Usage

1. localhost:7777(수집기) 접속
2. DB 혹은 URL 수집 방식 선택
3. MetaInfo(Title, Interval, timeColumn) 및 URL 설정
4. 반드시 x축에 사용 될 time이라는 column값을 지정해줘야함.
5. 데이터 수집기 등록

6. localhost:3000(서비스) 접속
7. Draw버튼을 클릭
8. MetaInfo(Title, Interval, timeColumn, color, key, alias) 설정
9. Chart 드래그 앤 드랍으로 자유로운 배치가능
10. EasyLayout을 통해 지정 된 형식 배치가능
11. Save 버튼을 통해 hash URL을 통해 접근가능
12. Load 버튼을 통해 현재 저장 된 Dashboard 불러오기
13. Chart 오른쪽버튼 클릭시 해당정보 보여주기

# Dependencies

데이터 저장소 [MongoDB](https://github.com/mongodb/mongo) 설치 및 활용이 필요합니다.

# Version

v 1.1

# Developer

Jay
