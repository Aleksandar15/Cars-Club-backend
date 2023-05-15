import { RequestHandler } from "express";

const setNoCacheByRedirect: RequestHandler = (req, res, next) => {
  // Similar to setNoCacheHeaders to avoid caching,
  // but without setting any headers
  // However normal Chrome browser works
  // as expected WITHOUT this or the setHeaders-middleware
  // hence why I decided to not use these middlewares for now.

  // NOTE - this 'timestamp' can be set on the frontend,
  // hence why the condition below checks that first
  if (!req.query.timestamp) {
    return res.redirect(`${req.path}?timestamp=${Date.now()}`);
  }
  next();
};

export default setNoCacheByRedirect;
