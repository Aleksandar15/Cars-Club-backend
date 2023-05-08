import jwt, { Secret } from "jsonwebtoken";

interface PayloadObject {
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
  // }   // decided not to use.

  // Fixing TypeScript: "No overload matches this call."
  // Works even as 'secret | undefined',
  // but if-condition type guard is a must
  const jwtSecret: Secret | undefined = process.env.jwtSecret;
  if (!jwtSecret) {
    throw new Error("JWT secret not found in environment variables.");
  }

  // return jwt.sign(payload, process.env.jwtSecret, { expiresIn });
  return jwt.sign(payload, jwtSecret, { expiresIn });
};

// Create a separate JWT generator
// for the purpose of using different secret key.

export const jwtRefreshGenerator = (
  user_id: string,
  user_role: string,
  expiresIn: string
) => {
  const payload: PayloadObject = {
    user_id,
    user_role,
  };

  const jwtRefreshSecret: Secret | undefined = process.env.jwtRefreshSecret;
  if (!jwtRefreshSecret) {
    throw new Error("JWT secret not found in environment variables.");
  }

  return jwt.sign(payload, jwtRefreshSecret, { expiresIn });
};
