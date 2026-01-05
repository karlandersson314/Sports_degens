import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../../models/User";
import { logger } from "../../utils/logger";
import { JwtPayload } from "../../types";

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<IUser> {
    const { username, email, password } = data;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username,
      email,
      passwordHash,
      level: 0,
      xp: 0,
      totalWagered: 0,
      rakebackBalance: 0,
      goldCoins: 0,
      degenCash: 0,
      hasToolsAccess: false,
    });

    await user.save();
    logger.info(`New user registered: ${username} (${email})`);

    return user;
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<{ user: IUser; token: string }> {
    const { email, password } = data;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check if user has password (OAuth users won't have password)
    if (!user.passwordHash) {
      throw new Error("Please use OAuth login for this account");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);

    logger.info(`User logged in: ${user.username} (${user.email})`);

    return { user, token };
  }

  /**
   * Generate JWT token for user
   */
  generateToken(user: IUser): string {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const payload: JwtPayload = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    };

    return jwt.sign(payload, jwtSecret, {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    } as jwt.SignOptions);
  }
}

export const authService = new AuthService();
