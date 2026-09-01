import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { iDbUser } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { SignOptions } from "jsonwebtoken";

const userLogin = async (payload: iDbUser) => {
   const { email, password } = payload;
   const users = await prisma.user.findUniqueOrThrow({
      where: {
         email
      }

   })

   const isPasswordMase = await bcrypt.compare(password, users.password);
   if (!isPasswordMase) {
      throw new Error("User password invalid!!")
   }

   const JwtPayload = {
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role
   }

   const accessToken = jwtUtils.createToken(
      JwtPayload,
      config.jwt_access_secret,
      config.jwt_access_exprires_in as SignOptions
   )
   const refreshToken = jwtUtils.createToken(
      JwtPayload,
      config.jwt_refresh_secret,
      config.jwt_refresh_exprires_in as SignOptions
   )
   return {
      accessToken,
      refreshToken,
      JwtPayload
   }
}

export const authService={
    userLogin
}