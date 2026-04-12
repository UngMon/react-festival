// 브라우저 환경에서 실행되는 이미지 리사이징 함수
// 파일을 읽고 -> 가상 공간에 그려서 -> 깎고 다듬은 뒤 -> 다시 파일로 만드는 작업
export const resizeAndCropImage = (
  file: File, // 사용자가 업로드한 원본 파일 객체
  size: number = 400 // 결과물로 나올 정사각형의 가로/세로 길이
): Promise<Blob> => {
  /*
    이 작업은 파일을 읽고 처리하는 시간이 걸리는 '비동기' 작업, 따라서 컴포넌트에서 await 동기 작업을 걸기 위함
    작업이 성공하면 Blob(가공된 파일 덩어리)을 반환하겠다는 promise
  */
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); // 브라우저가 사용자 컴퓨터의 파일을 읽을 수 있게 해주는 도구(api)
    reader.readAsDataURL(file); // 파일을 Base64 데이터 URL로 변환, 이렇게 해야 <img>가 파일을 인식할 수 있음.

    reader.onload = (event) => {
      // 파일 읽기가 끝났을 때 실행되는 콜백 함수
      const img = new Image(); // 실제 이미지의 너비 높이를 알기 위해 메모리상에 임시 이미지 객체(<img>) 생성
      img.src = event.target?.result as string; // 읽어온 데이터 주소(Base64)를 이미지 소스로 지정

      img.onload = () => {
        // 이미지 소스가 완전히 로드되어 너비와 높이를 계산할 수 있을 때 실행된다.
        const canvas = document.createElement("canvas"); // 가상의 도화지 생성
        canvas.width = size; // 400 x 400 사이즈로 만듬
        canvas.height = size;

        const ctx = canvas.getContext("2d"); // 도화지에 그림을 그리는 '붓'과 같은 역할을 하는 컨텍스트(2D 전용)를 가져옴
        if (!ctx) return reject(new Error("Canvas context 생성 실패"));

        // 이미지가 가로가 길든 세로가 길든 정사각형으로 만듦
        const minSide = Math.min(img.width, img.height); // 중앙 기준 1:1 크롭 계산
        // 원본 사진의 정중앙에서부터 정사각형을 잘라내기 위해 시작 지점을 계산
        const offsetX = (img.width - minSide) / 2;
        const offsetY = (img.height - minSide) / 2;

        /* 
          원본의 중앙 부분을 캔버스에 꽉 차게 그림 
          img를 가져와서 원본의 offsetX, offsetY 지점부터 minSide만큼의 정사각형 영역을 복사해서,
          도화지의 0, 0 지점에 size 크기로(여기서 리사이징) 그려넣으라는 명령
        */
        ctx.drawImage(
          img,
          offsetX,
          offsetY,
          minSide,
          minSide,
          0,
          0,
          size,
          size
        );

        // 도화지에 그려진 그림을 다시 '파일(Blob)'로 변환한다.
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Blob 생성 실패"));
          },
          "image/jpeg",
          0.8
        );
        //'image/jpeg', 0.8: 결과물을 JPEG 형식으로 만들고, 화질을 80% 수준으로 압축하여 용량을 줄인다.
      };
    };

    reader.onerror = (error) => reject(error);
  });
};
