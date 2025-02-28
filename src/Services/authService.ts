import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET as string;

class AuthService {
  // Generate a faux token
  static generateToken(userId: number): string {
    return jwt.sign({ userId :userId.toString() }, SECRET_KEY, { expiresIn: '3h' });
  }

  // Validate the faux token
  static verifyToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
      return decoded.userId;
    } catch (error) {
      return null;
    }
  }
}

export default AuthService;