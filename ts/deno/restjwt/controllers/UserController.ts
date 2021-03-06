import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { IUser, User } from "./models/index.ts";

export class UserController {
  async create(values: IUser) {
    // Call static user method
    const password = await User.hashPassword(values.password);

    const user: IUser = {
      firstName: values.firstName,
      lastName: values.lastName,
      password,
    };

    await User.create(user as any);

    return values;
  }
  async delete(id: string) {
    await User.deleteById(id);
  }

  getAll() {
    return User.all();
  }

  getOne(id: string) {
    return User.where("id", id).first();
  }

  async update(id: string, values: IUser) {
    await User.where("id", id).update(values as any);
    return this.getOne(id);
  }

  async login(lastName: string, password: string) {
    const user = await User.where("lastName", lastName).first();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return false;
    }

    // TODO generate JWT
        // Call our new static method
    return User.generateJwt(user.id);
  }

}