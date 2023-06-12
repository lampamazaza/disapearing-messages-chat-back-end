import { COOKIE_TOKEN_NAME, TOKEN_LENGTH } from "../users/constants";

export default function getToken(cookies: string) {
  const delimeter = `${COOKIE_TOKEN_NAME}=`;
  const delimeterLength = delimeter.length;
  const start = cookies.search(`${COOKIE_TOKEN_NAME}=`) + delimeterLength;
  return cookies.slice(start, start + TOKEN_LENGTH);
}
