import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  RegisterUserDto,
  UserEntity,
  LoginUserDto,
} from "../../domain";

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({
      email: registerUserDto.email,
    });
    if (existUser) throw CustomError.badRequest("User already exists");

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: "ABC",
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    try {
      const existUser = await UserModel.findOne({
        email: loginUserDto.email,
      });
      if (!existUser) throw CustomError.badRequest("Invalid credentials");

      const isMatch = bcryptAdapter.compare(
        loginUserDto.password,
        existUser.password
      );
      if (!isMatch) throw CustomError.badRequest("Invalid credentials");

      const { password, ...userEntity } = UserEntity.fromObject(existUser);

      const token = await JwtAdapter.generateToken({id: existUser.id});
      if(!token) throw CustomError.internalServer("Error while generating token");

      return {
        user: userEntity,
        token: "ABC",
      };
    } catch (error) {
        throw CustomError.internalServer(`${error}`);
    }
  }
}
