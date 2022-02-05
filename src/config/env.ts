import { IEnv } from "../interfaces/global/env.interfaces";
import { toString } from "lodash";

export default{
    appEnvironment: toString(process.env.APP_ENV),
    mongoUser: toString(process.env.MONGO_USER),
    mongoPwd: toString(process.env.MONGO_PWD),
    mongoDb: toString(process.env.MONGO_DB),
    mongoHost:toString(process.env.MONGO_HOST)

}as IEnv