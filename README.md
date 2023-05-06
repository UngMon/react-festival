# 축제모아

한국관광공사 api를 이용하여 대한민국 축제/행사/공연을 한 곳에서 확인할 수 있는 웹(web) 앱.

## 축제모아 V1.20 출시

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
│  │  │  ├─ Navigation.css
│  │  │  ├─ Navigation.tsx
│  │  │  ├─ PcSearch.css
│  │  │  └─ PcSearch.tsx
│  │  ├─ login // 추가 소셜 로그인(v1.20 기준 구현 안됨)
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
│  │     ├─ LoadingTwo.tsx
│  │     ├─ MobileSearch.cs
│  │     ├─ MobileSearch.tsx
│  │     ├─ MonthSelector.css
│  │     ├─ MonthSelector.tsx
│  │     ├─ RegionSelector.tsx
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

앱 실행은 'npm start'

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

### 업데이트

https://github.com/UngMon/react-festival/blob/main/Patchhistoty.md

### 향후 계획

1. 카카오, 네이버 로그인 기능 추가 예정입니다.. front 혼자서 개발하다보니 조금 한계점이 있습니다. 다행히 firebase의 cloud functions를 이용하면 개인 서버 없이 서버측 코드를 작성하여 카카오, 네이버 와같은 소셜 로그인을 구현할 수 있을 것 같습니다. 사실은 v1.01 배포 이전에 카카오 로그인은 admin sdk로 구현을 했지만, 네이버 로그인 기능을 추가하면서 에러가 발생하여 잠시 비활성화 해놨습니다. 틈틈이 공부하면서 구현해볼 생각입니다.

### 프로젝트 후기

= api를 이용해서 의미 있는 서비스를 만들어 보자는 아이디어에서 시작한 프로젝트입니다. 코로나도 풀리고 놀러갈 때, 모든 축제를 한눈에 알아볼 수 있으면 좋겠다는 마음에 관광공사 api를 이용해서 웹 서비스를 배포했습니다. 개발 단계에서 보이지 않던 문제가 서비스 개시를 하면서 지인들과 사용자들의 평가로부터 웹 개발자로써 신경 써야 할 부분이 많다는 것을 느꼈습니다. 특히 여태 크롬 환경에서 개발을 했는데.. 정의한 css가 다양한 브라우저에서 적용되지 않았던 점, http 보안 이슈, UX 등 아쉬웠던 점이 많이 보였습니다. 특히 웹 성능 측면에서 사용자가 어떤 네트워크 환경에서 사용하는지 고려하며 서비스를 만들어야 함을 알게 되었습니다. 축제 모아는 많은 이미지를 받아오는 프로젝트 입니다. 그런데 관광공사에서 제공하는 축제 이미지들은 해상도에 비해 용량이 매우 큽니다. 그러다 보니 slow 3G환경은 물론, 모바일 데이터 환경에서 사용자가 받아오는 데이터가 많다는 것을 알게 되었습니다. 이를 해결하기 위해 클라이언트 측에서 이미지 lazy 라이브러리를 사용할지 아니면 firebase storage에서 압축된 이미지를 저장하여 데이터를 불러올지 고민하고 있습니다. 특히 lazy loading을 구현하기 위해서 img 태그에 loading='lazy' 속성을 추가하거나, intersection observer를 사용하는 방법이 있지만 찾아보니 지원하지 않는 브라우저가 있기 때문에 완벽한 방법은 아닌 것 같습니다. 현재로써는 압축된 이미지를 사용하는 것이 웹 성능을 개선하는데 최적의 방법 같습니다. 마지막으로 타입스크립트를 적용한 첫 프로젝트 입니다. 타입스크립트를 배우면서도 '굳이 이걸 왜 쓸까?' 싶었지만, 개발 중간 단계부터 컴포넌트 개수가 증가하고, 코드가 길어질수록 변수와 props 의 타입이 명시가 되어있다 보니 코드 이해가 쉬었습니다. 캘린더 프로젝트에서는 제가 작성한 코드를 이해를 못 한 경우가 있었는데, 타입 명시가 이럴 때 도움이 된다는 것을 느꼈으며 실무에서 협업할 때, 각자가 쓴 코드를 좀 더 수월하게 이해할 수 있겠다 느꼈습니다. 결과적으로 축제모아를 만들면서 단순 기능 구현을 하는 개발자가 아닌 성능과 사용자 경험을 중시하며 설계를 하는 개발자가 되어야겠다! 느끼게 해준 프로젝트입니다!.


 