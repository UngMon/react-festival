# 축제모아

한국관광공사 api를 이용하여 대한민국 축제/행사/공연을 한 곳에서 확인할 수 있는 웹(web) 앱.

## 축제모아 V1.01 출시

https://festival-moa-fc37b.firebaseapp.com

## 프로젝트 구조

```
festival
│
├─ public
│  ├─ favicon.ico
│  ├─ images / image들...
│  ├─ index.html
│  ├─ manifest.json
│  └─ robots.txt
├─ src
│  ├─ App.css
│  ├─ App.test.tsx
│  ├─ App.tsx
│  ├─ components
│  │  ├─ card // 축제/행사/공연을 보여주는 카드
│  │  │  ├─ Card.css
│  │  │  └─ Card.tsx
│  │  ├─ content // 콘텐츠 영역. 카드 클릭시 해당 콘텐츠에 대한 상세 정보 확인, 댓글, 지도 확인 가능
│  │  │  ├─ Content.css
│  │  │  ├─ Content.tsx
│  │  │  ├─ contentImages // 자동 슬라이드 관광공사 데이터로 부터 받아온 행사 이미지들을 슬라이딩 해줌
│  │  │  │  ├─ Slider.css
│  │  │  │  ├─ Slider.tsx
│  │  │  │  └─ SliderButton.tsx
│  │  │  ├─ contentInfo // 콘텐츠 정보
│  │  │  │  ├─ BasicInfo.tsx
│  │  │  │  ├─ Detail.css
│  │  │  │  ├─ Detail.tsx
│  │  │  │  ├─ Map.tsx
│  │  │  │  ├─ MenuBar.css
│  │  │  │  ├─ MenuBar.tsx
│  │  │  │  ├─ Overview.css
│  │  │  │  └─ Overview.tsx
│  │  │  └─ contentReview // 사용자들의 리뷰
│  │  │     ├─ ContentReviews.css
│  │  │     ├─ ContentReviews.tsx
│  │  │     ├─ Feelings.tsx
│  │  │     ├─ UserReviews.tsx
│  │  │     └─ modal // 사용자가 댓글을 삭제, 신고
│  │  │        ├─ DeleteModal.css
│  │  │        ├─ DeleteModal.tsx
│  │  │        ├─ ReportModal.css
│  │  │        └─ ReportModal.tsx
│  │  ├─ error // 각종 에러 페이지
│  │  │  ├─ GetDataError.css
│  │  │  ├─ GetDataError.tsx
│  │  │  ├─ LoginAccessError.css
│  │  │  ├─ LoginAccessError.tsx
│  │  │  ├─ PageNotFound.css
│  │  │  └─ PageNotFound.tsx
│  │  ├─ footer // 정보제공, 제작자 이메일
│  │  │  ├─ Footer.css
│  │  │  └─ Footer.tsx
│  │  ├─ header // 페이지 상단 ui
│  │  │  ├─ Header.css
│  │  │  ├─ Header.tsx
│  │  │  ├─ LoginButton.module.css
│  │  │  ├─ LoginButton.tsx
│  │  │  ├─ Navigation.module.css
│  │  │  └─ Navigation.tsx
│  │  ├─ login // 추가 소셜 로그인(v1.01 기준 구현 안됨)
│  │  │  ├─ Kakao.tsx
│  │  │  └─ Naver.tsx
│  │  ├─ main // 첫 페이지, 월별 보기, 지역, 계절별 메인 페이지
│  │  │  ├─ Main.css
│  │  │  ├─ Main.tsx
│  │  │  ├─ Monthly.tsx
│  │  │  ├─ Regions.tsx
│  │  │  └─ Seasons.tsx
│  │  └─ ui // 월, 지역, 계절, 검색에 관한 ui 컴포넌트
│  │     ├─ Loading.css
│  │     ├─ Loading.tsx
│  │     ├─ MonthSelector.css
│  │     ├─ MonthSelector.tsx
│  │     ├─ RegionSelector.tsx
│  │     ├─ SearchUi.css
│  │     ├─ SearchUi.tsx
│  │     ├─ SeasonSelector.css
│  │     ├─ SeasonSelector.tsx
│  │     ├─ UiBox.css
│  │     └─ UiBox.tsx
│  ├─ firebase // 파이어베이스 firestore DB, Auth 기능을 사용하기 위한 firebase app 초기화
│  │  └─ index.ts
│  ├─ index.css
│  ├─ index.tsx
│  ├─ pages // 각종 페이지 App.tsx에서 정의한 path들의 최상위 컴포넌트
│  │  ├─ Error.tsx
│  │  ├─ Login.css
│  │  ├─ Login.tsx
│  │  ├─ MonthlyFestival.tsx
│  │  ├─ Regions.tsx
│  │  ├─ Result.css
│  │  ├─ Result.tsx
│  │  ├─ Root.tsx
│  │  ├─ SearchPage.tsx
│  │  ├─ Seasons.tsx
│  │  └─ Start.tsx
│  ├─ react-app-env.d.ts
│  ├─ redux // redux state 정의
│  │  ├─ festival-slice.tsx // 관광공사 정보를 월별, 지역별, 계절별로 정렬
│  │  ├─ fetch-action.tsx // redux-thunk(관광공사 데이터를 요청)
│  │  ├─ firebase-slice.tsx // 사용자 로그인 데이터 저장
│  │  ├─ rootReducer.tsx
│  │  └─ store.tsx
│  ├─ reportWebVitals.ts
│  ├─ setupTests.ts
│  ├─ type
│  │  └─ Type.ts // 각종 타입 정의
│  └─ utils // 컴포넌트 코드 길이가 길어지는 것을 방지 or 자주 사용되는 함수
│     ├─ CalculateDate.ts
│     ├─ CurrentSeason.ts
│     ├─ DataSlice.ts
│     ├─ NowDate.ts
│     └─ SetData.ts
├─ tsconfig.json
├─ package.json
└─ package-lock.json
```

### 기술 스택

1. Language
<div style={{display: flex}}>
  <img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/tyoescript-3178C6?style=for-the-badge&logo=react&logoColor=black">
  <img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=react&logoColor=black">
</div>

2. DB(NoSQL)
   <img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=react&logoColor=black">

3. API
   한국관광공사(https://www.data.go.kr/data/15101578/openapi.do),
   카카오맵, firebase

### 사용 방법

1. npm install => package.json에 명시된 dependencys가 설치됩니다.
2. 패키지를 설치하셨다면, 파이어베이스에 프로젝트를 추가합니다. (https://firebase.google.com/docs/web/setup?hl=ko)
3. 프로젝트를 추가하면서 생성된 sdk key값을 firebase/index.ts에 기입합니다.
4. 페이스북 로그인 기능을 사용하시려면 https://developers.facebook.com/?locale=ko_KR에 여러분의 앱을 등록해야 합니다.
5. 카카오 맵을 이용하시려면 https://developers.kakao.com/에 앱을 등록하세요.

앱 실행은 'npm start'로 로컬호스트에서 실행됩니다.

### 기능 설명

1.  반응형 웹: 모바일, PC 환경을 고려한 ui 설계
    <이미지...>
2.  소셜 로그인: Firebase Auth를 이용한 소셜 로그인 기능

3.  월, 지역, 계절별 볼 수 있는 NavBar

4.  해당 축제/행사/공연의 카카오 맵

5.  이미지 슬라이드

6.  좋아요 기능

7.  댓글 기능(입력, 추가, 삭제)

8.  신고 기능

9.  검색 기능

### 버전별 주요 변화

1. V1.01

- (1) 각종 컴포넌트 css 수정
- (2) 관광공사 이미지 http -> https변경
- (3) 시작 페이지 추가(Main.tsx) // 계절마다 이미지 변경됨
- (4) MonthSelector, RegionSelector.tsx에서 전체 옵션 삭제 => 성능 이슈

### 향후 계획

1. 카카오, 네이버 로그인 기능 추가 예정입니다.. front 혼자서 개발하다보니 조금 한계점이 있습니다. 다행히 firebase의 cloud functions를 이용하면 개인 서버 없이 서버측 코드를 작성하여 카카오, 네이버 와같은 소셜 로그인을 구현할 수 있을 것 같습니다. 사실은 v1.01 배포 이전에 카카오 로그인은 admin sdk로 구현을 했는데, 네이버 로그인 기능을 추가하면서 에러가 발생하여 잠시 비활성화 해놨습니다. 틈틈이 공부하면서 구현해볼 생각입니다.

### 프로젝트 후기

= 저번 리액트 캘린더 프로젝트 이후 firebase를 제외한 첫 api사용을 해본 프로젝트 입니다. 공공데이터에서 한국관광공사 api를 신청하였으나, 통신 에러를 겪었는데 다행히 문의를 하고 해결이 되었습니다.
혼자서 열심히 만들려고 생각을 했고, 저번 캘린더 프로젝트에서 타입 때문에 많은 오류를 겪어 이번에는 타입스크립트를 적용했습니다. 처음에 타입 정의하는게 골칫거리 였는데(router, redux에서...), 사용해보니 왜 인기있는 언어인지 깨달았습니다. 확실히 사전에 오류를 캐치할 수 있다는 점에서 좋았고, 타입이 명시되어 있어 협업할 때 좋겠구나라고 느꼈습니다. 아쉬웠던 점은 미적 감각이 떨어져 ui가 상당히 단조롭다고 느낍니다.. 남들처럼 예쁘고 멋진 웹을 만들고 싶은데 디자인 공부좀 해야 할 것 같습니다. ㅜㅜ; 나름 컴포넌트를 관리하기 쉽게 기능별로 분리를 해놨지만, ETC하게 좀 더 다듬어야 할 것 같습니다. 마지막으로 관광공사에서 제공하는 이미지가 어떤 행사는 있고, 없는 경우가 있어서 Noimage.png로 대체했습니다. 그리고 이미지 파일크기들이 최적화가 안 되어있어서 페이지 로딩시 resource가 유튜브 보다 많은 점에 있어서 아쉬웠습니다.
