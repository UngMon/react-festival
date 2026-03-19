import { User } from "firebase/auth";

export const getLoginProvider = (user: User): string | null => {
  // 1. 커스텀 토큰 방식 (kakao, naver)
  if (user.uid.startsWith("kakao:")) return "kakao.com";
  if (user.uid.startsWith("naver:")) return "naver.com";

  // 2. 기본 제공 방식 (google, facebook)
  const providerIds = user.providerData.map((p) => p.providerId);

  if (providerIds.includes("google.com")) return "google.com";
  if (providerIds.includes("facebook.com")) return "facebook.com";

  return null;
};
