import "dotenv/config";

interface CookieOptionsObject {
  httpOnly?: boolean | undefined;
  secure?: boolean;
  sameSite?: boolean | "lax" | "strict" | "none";
  path?: string;
  domain?: string;
  maxAge?: number;
  // expires?: Date | number | string; // has errors:
  // In TSC expires can ONLY be Date | undefined(optional)
  expires?: Date;
}

const getCookieOptions = () => {
  if (process.env.NODE_ENV === "production") {
    const cookieOptions: CookieOptionsObject = {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      // fill up "domain" field once deployed
      // domain: "",
      // // expires: year 9999 January 1st
      // expires: new Date(9999, 0, 1).toUTCString(), //TSC error
      // expires: new Date(9999, 0, 1), // Works
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    };
    return cookieOptions;
  } else if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === undefined
  ) {
    const cookieOptions: CookieOptionsObject = {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      domain: "localhost",
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    };
    return cookieOptions;
  }
};

export default getCookieOptions;
