import { JwtAdapter, bcryptAdapter, envs } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  RegisterUserDto,
  UserEntity,
  LoginUserDto,
} from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
  constructor(
    private readonly emailService: EmailService,
  ) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({
      email: registerUserDto.email,
    });
    if (existUser) throw CustomError.badRequest("User already exists");

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(registerUserDto.password);

      await user.save();

      // Email validation

      await this.sendEmailValidationLink(user.email)

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({id: userEntity.id});
      if(!token) throw CustomError.internalServer("Error while generating token");

      return {
        user: userEntity,
        token: token,
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
        token: token,
      };
    } catch (error) {
        throw CustomError.internalServer(`${error}`);
    }
  }


  private sendEmailValidationLink = async(email: string) => {
    const token = await JwtAdapter.generateToken({email});
    if(!token) throw CustomError.internalServer("Error while generating token");

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const html = `
    <h1>Validate your email</h1>
    <p>Click on the link below to validate your email</p>
    <a href="${link}">Validate Email ${email}</a>
    `;

    const options = {
      to: email,
      subject: "Validate your email",
      htmlBody: html,
    };

    const isSent = await this.emailService.sendEmail(options);
    if(!isSent) throw CustomError.internalServer("Error while sending email");

    return true;
  }

  public validateEmail = async(token: string) => {
    const payload = await JwtAdapter.validateToken(token);
    if(!payload) throw CustomError.badRequest("Invalid token");


    const {email} = payload as {email: string};
    if(!email) throw CustomError.internalServer("Email not in token");

    const user = await UserModel.findOne({email});
    if(!user) throw CustomError.badRequest("User not found");

    user.emailValidated = true;
    await user.save();
    return true
  }
}
