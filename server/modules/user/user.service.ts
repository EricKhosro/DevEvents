import createHttpError from "http-errors";
import User, { UserSchema } from "./user.model";
import { UserMessages } from "./user.message";
import { hash, genSalt, compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export const UserService = {
  async login(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) throw createHttpError.NotFound(UserMessages.NotFound);

    const validPassword = await compare(password, user.password);
    if (!validPassword)
      throw createHttpError.NotFound(UserMessages.InvalidCredentials);

    const token = this.generateAppToken(user.email);

    return token;
  },

  async register(email: string, password: string, rePassword: string) {
    const user = await this.findByEmail(email);
    if (user && user._id)
      throw createHttpError.Conflict(UserMessages.EmailExists);

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

  async registerWithGoogle(email: string): Promise<UserSchema> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) return existingUser;

    const newUser = await User.create({ email, password: "" });
    return newUser;
  },

  generateAppToken(email: string) {
    const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;
    if (!PRIVATE_KEY) {
      console.log("JWT Private Key not in .env");
      throw createHttpError.InternalServerError();
    }

    return sign({ email: email }, PRIVATE_KEY);
  },

  async findByEmail(email: string): Promise<UserSchema | null> {
    const user = await User.findOne({ email });
    if (!user) return null;
    return user;
  },
};
