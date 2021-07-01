import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.SECRET_JWT || 'missing key';

console.log(JWT_SECRET_KEY);

export type JWTPayload = string | Buffer | object;

export const generateJWT = (data: JWTPayload): string => jwt.sign(data, JWT_SECRET_KEY);

export const verifyJWT = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch (err) {
    console.error("[ERROR] Failed to verify JWT token", err);
    return null;
  }
}
