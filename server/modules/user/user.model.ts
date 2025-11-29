import { IAuthDTO } from "@/shared/types/auth.types";
import { Document, model, models, Schema } from "mongoose";

export interface UserSchema extends Document, IAuthDTO {}

const UserSchema = new Schema<UserSchema>({
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    maxlength: [100, "email cannot exceed 100 characters"],
    index: true,
  },
  password: {
    type: String,
    trim: true,
    maxlength: [100, "password cannot exceed 100 characters"],
  },
});

const User = models.User || model<UserSchema>("User", UserSchema);

export default User;
