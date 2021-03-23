import { NextFunction } from "express"
import { Request, Response } from "express"
import jwt from "jsonwebtoken"

function auth(req: Request, res: Response, next: NextFunction){
    try{
        const token = req.cookies.token
        if(!token){
            res
                .status(401)
                .json({errorMessage: "Unauthorized"})
            return
        }

        const verified = jwt.verify(token, `${process.env.JWT_SECRET}`)
        next()
    } catch (err){
        console.error(err)
        res
            .status(401)
            .json({errorMessage: "Unauthorized"})
    }
}

export { auth }