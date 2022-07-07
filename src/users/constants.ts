import { CookieOptions } from "express";

export const COOKIE_TOKEN_NAME = "tk";
export const TOKEN_LENGTH = 415;

export const COOKIE_TOKEN_OPTIONS = {
  maxAge: 6048000000,
  httpOnly: true,
  path: "/",
  secure: true,
  // sameSite: (true ? "none" : "strict") as CookieOptions["sameSite"],
};

export const DELETED_COOKIE_VAlUE = "";
