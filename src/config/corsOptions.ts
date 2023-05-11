import allowedOrigins from "./allowedOrigins";
import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Fixing error: .indexOf expects type of 'string':
    // if (typeof origin === "string") {
    // if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
    // Alternatively to avoid typeof guards:
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
    // }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
