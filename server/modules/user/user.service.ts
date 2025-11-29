import createHttpError from "http-errors";
import User, { UserLean, UserSchema } from "./user.model";
import { UserMessages } from "./user.message";
import { hash, genSalt, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export const UserService = {
  async login(username: string, password: string) {
    const user = await this.findByUsername(username);
    if (!user) throw createHttpError.NotFound(UserMessages.NotFound);

    const validPassword = await compare(password, user.password);
    if (!validPassword)
      throw createHttpError.NotFound(UserMessages.InvalidCredentials);

    const token = this.generateAppToken(user.email, user.username);

    return token;
  },

  async register(
    email: string,
    password: string,
    rePassword: string,
    username: string
  ) {
    await this.checkUnique(email, username);

    if (password !== rePassword)
      throw createHttpError.BadRequest(UserMessages.NotSamePasswords);

    const salt = await genSalt(10);
    const hashedPassword = await hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
    });
    return newUser.email;
  },

  async registerWithOAuth(email: string): Promise<UserSchema> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) return existingUser;

    const newUser = await User.create({ email, password: "" });
    return newUser;
  },

  generateAppToken(email: string, username: string) {
    const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      console.log("JWT Private Key not in .env");
      throw createHttpError.InternalServerError();
    }

    return sign({ email, username }, PRIVATE_KEY);
  },

  async checkUnique(email: string, username: string) {
    const existing = await User.findOne({
      $or: [{ email }, { username }],
    }).lean<UserLean>();

    if (!existing) return;

    if (existing.email === email)
      throw createHttpError.Conflict(UserMessages.EmailExists);

    if (existing.username === username)
      throw createHttpError.Conflict(UserMessages.UsernameExists);
  },

  async findByEmail(email: string): Promise<UserSchema | null> {
    const user = await User.findOne({ email });
    if (!user) return null;
    return user;
  },

  async findByUsername(username: string): Promise<UserSchema | null> {
    const user = await User.findOne({ username });
    if (!user) return null;
    return user;
  },
};
