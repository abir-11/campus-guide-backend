import path from "path";
import dotenv from "dotenv"

dotenv.config({
    path:path.join(process.cwd(),".env")
})

export default{
    port:process.env.PORT,
    database_url:process.env.DATABASE_URL,
    app_url:process.env.APP_URL,
     bcrypt_salt_rounds:process.env.BCRYPT_SALR_ROUNDS,
    jwt_access_secret:process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret:process.env.JWT_REFRESH_SECRET!,
    jwt_access_exprires_in:process.env.JWT_ACCESS_EXPRIRES_IN!,
    jwt_refresh_exprires_in:process.env.JWT_REFRESH_EXPRIRES_IN!,
}