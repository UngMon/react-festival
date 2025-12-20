1. v1.01

- (1) 각종 컴포넌트 css 수정
- (2) 관광공사 이미지 http -> https변경
- (3) 시작 페이지 추가(Main.tsx) // 계절마다 이미지 변경됨
- (4) MonthSelector, RegionSelector.tsx에서 전체 옵션 삭제 => 성능 이슈

2. v1.20

- (1) StartPage 스타일 변경
- (2) Header 기능 추가 (mouseEnter, Leave에 따른 스타일 변경)
- (3) 크롬 외 브라우저 스타일 최적화(selector tag)
- (4) mobile-nav-bar 스타일 변경(FontAwsome 이용)
- (5) 댓글 삭제 버튼 시 modal 추가
- (6) 리뷰에 마우스 Enter시 option 아이콘 렌더
- (7) StartPage 배경화면 이미지 압축
- (8) 월별, 지역별, 계절별 img lazy 옵션 추가
- (9) Card 클릭시 너무 느린 렌더링 개선화(loader함수를 Content.tsx 렌더 이후 작동)
- (10) 기타 ui 스타일 수정

3. v2.0
- (1) 시작 페이지 UI 상단, 하단 UI 변경
- (2) 페이지 성능(렌더링) 최적화 및 오류 페이지 생성
- (3) TourAPI url 변경 및 로직 개선
- (4) Footer UI 추가 개선
- (5) Redirect 로그인으로 변경
- (6) 컨텐츠 항목들 page nation
- (7) 사용자 기록 페이지 추가
- (8) 답글 불러오기 무한 스크롤에서 버튼식으로 변경
- (9) Firebase firestore 유틸 함수 최적화
