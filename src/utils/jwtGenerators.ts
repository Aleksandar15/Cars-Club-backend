import jwt, { Secret } from "jsonwebtoken";

export interface PayloadObject {
  user_id: string;
  user_role: string;
}

export const jwtGenerator = (
  user_id: string,
  user_role: string,
  expiresIn: string
): string => {
  const payload: PayloadObject = {
    user_id,
    user_role,
  };

  // // Validate the expiryTime parameter
  // const isValidExpiry = /^\d+[smhdy]$/.test(expiresIn);
  // if (!isValidExpiry) {
  //   throw new Error(
  //     `Invalid expiryTime format.
  //     Please provide a valid duration
  //     (e.g., '1d', '2h', '30m', '1y').`
  //   );
  // }   // -> decided not to use.

  // Fixing TypeScript: "No overload matches this call."
  // Below works even as 'string | undefined',
  const jwtSecret: Secret | undefined = process.env.ACCESS_TOKEN_SECRET;
  // But, if-conditional type guard is optional
  if (!jwtSecret) {
    throw new Error("JWT secret not found in environment variables.");
  }

  // return jwt.sign(payload, process.env.jwtSecret, { expiresIn }); // error
  return jwt.sign(payload, jwtSecret, { expiresIn });
};

// Create a separate refreshToken JWT generator
// for the purpose of using different secret key.
// I could do this in a single function, but I prefer this way.
export const jwtRefreshGenerator = (
  user_id: string,
  user_role: string,
  expiresIn: string
) => {
  const payload: PayloadObject = {
    user_id,
    user_role,
  };

  const jwtRefreshSecret: Secret | undefined = process.env.REFRESH_TOKEN_SECRET;
  if (!jwtRefreshSecret) {
    throw new Error("JWT secret not found in environment variables.");
  }

  return jwt.sign(payload, jwtRefreshSecret, { expiresIn });
};
