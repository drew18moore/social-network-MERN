import { CorsOptions } from "cors";
import { allowedOrigins } from "./allowedOrigins";
export const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  optionsSuccessStatus: 200,
};
