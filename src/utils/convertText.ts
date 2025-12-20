export const convertText = (text: string) => {
  // 1. 방어 코드: null, undefined, 빈 문자열 모두 처리
  if (!text) return "";

  // 2. <br> 태그의 모든 변형(<br>, <br/>, <br />, <BR>) 및 기존 줄바꿈(\n)을 찾아서
  // <br: <br로 시작하고
  // \s*: 공백이 0개 이상 있으며 (<br > 대응)
  // \/?: 슬래시가 있거나 없으며 (<br/> 대응)
  // >: 괄호를 닫고
  // |\n|\r: 또는 줄바꿈 문자이고
  // +: 이것들이 하나 이상 연속되면 (<br><br><br> 등)
  // gi: 대소문자 구분 없이(i), 전체를(g) 찾아서 \n 하나로 바꿈

  return text.replace(/(<br\s*\/?>|\n|\r)+/gi, "\n").trim();
};
