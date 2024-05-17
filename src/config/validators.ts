import mongoose from "mongoose";

export class Validators {
  static isMongoid(id: string) {
    return mongoose.isValidObjectId(id);
  }
}
