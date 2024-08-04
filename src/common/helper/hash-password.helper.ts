import * as bcrpyt from 'bcrypt';

export class PasswordHelper {
  static async hashPassword(password: string): Promise<string> {
    const saltRound = 10;
    const salt = await bcrpyt.genSalt(saltRound);
    return bcrpyt.hash(password, salt);
  }

  static async comparePassword(password: string, hashPassword: string): Promise<boolean> {
    return bcrpyt.compare(password, hashPassword);
  }
}
