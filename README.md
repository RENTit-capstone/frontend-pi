# 대학교내 물품 대여 서비스 RENTit
![KakaoTalk_20250605_232252838](https://github.com/user-attachments/assets/3c5b6a0b-175d-431a-89e8-c56a9c3e50da)

## About

superThin으로 개발한 RENTit 사물함 키오스크의 프론트엔드 레포지토리입니다.

### supeRThin!
*supeRThin*은 React의 상태 관리 방식에 영감을 받아 만든 ***초경량 프론트엔드 프레임워크***입니다.

"React로 빌드한 웹페이지를 Raspberry PI같은 저사양 환경에서 구동하는게 어렵지 않을까?" 라는 다른 팀원의 의견을 받아, React의 상태 관리와 컴포넌트 구성을 모방하는, 초경량의 프레임워크를 만들게 되었습니다.

`createState()`를 통한 상태 생성 및 관리, 코드 재사용성을 높이기 위한 컴포넌트 단위의 렌더링, 그리고 기존 JavaScript의 `fetch()`에 대한 레핑 함수를 제공합니다.

간단한 페이지를 편하게  개발하기 위해 필요한 최소한의 기능만을 제공하도록 하여, 극한의 저사양 환경에서도 문제없이 구동되도록 합니다.

## 실행 방법

`public/index.html`을 실행하면 됩니다.

하지만 백엔드에서의 라우팅을 위해 참조 주소를 수정했기에, 단독으로 실행하려면 html의 js코드 참조 위치를 바꿔주어야 합니다.