import { NextFunction, Request, Response } from "express"
import { jwtHelpers } from "../helper/jwtHelpers";

const auth = (...role: string[]) => {
    return async (req: Request & {user?: any}, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies.accessToken;

            if (!token) {
                throw new Error("You need to login first")
            }

            const matchToken = jwtHelpers.verifyToken(token, "abcd");
            req.user = matchToken;

            if (role.length && !role.includes(matchToken.role)) {
                throw new Error("You are not authorize!")
            }

            next()
        } catch (error) {
            next(error)
        }
    }
}

export default auth;