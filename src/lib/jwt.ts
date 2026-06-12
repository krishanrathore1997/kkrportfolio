import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "kkr_portfolio_jwt_secret_key_2026_change_me";

export function signToken(payload: { username: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { username: string };
  } catch (error) {
    console.error("JWT token verification failed:", error);
    return null;
  }
}
