import { RequestHandler } from "express";

const setNoCacheHeaders: RequestHandler = (req, res, next) => {
  // NOTE:
  // I was testing on AVG Chrome just when they had updates
  // 'memory save' feature -> it seem like they introduced new
  // bugs, and my Frontend started sending only-same-cookie
  // at which point /verifyrefreshtoken was returning 'true'
  // by verifying a cached (? / 'invisible') cookie,
  // even though there were 0 cookies on the Frontend.
  // I even went as far to clear all cookies and that didn't
  // fix nothing for AVG, however normal Chrome browser works
  // as expected hence why I decided to not use the middleware

  // Set headers to prevent caching
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  next();
};

export default setNoCacheHeaders;
