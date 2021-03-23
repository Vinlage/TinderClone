import { Request, Response } from "express"
import { ILogin, ICreateUser, IProfile } from "../../types/userType"
import { IRelationship } from "../../types/relationshipTypes"
import Login from "../../entities/auth/userEntity"
import Profile from "../../entities/profile/profileEntity"
import Relationship from "../../entities/relationship/relationshipEntity"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const create_user = async (req: Request, res: Response): Promise<void> => {
    try{
        const { user, password, passwordConfirm } = req.body as Pick<ICreateUser, "user" | "password" | "passwordConfirm">

        if(!user || !password || !passwordConfirm){
            res
                .status(400)
                .json({errorMessage: "Please enter all required fields!"})
            return
        }

        if(password.length < 6){
            res
                .status(400)
                .json({ errorMessage: "Please enter a password of at least 6 characters!"})
            return
        }

        if(password !== passwordConfirm){
            res
                .status(400)
                .json({ errorMessage: "Please enter the same password twice!"})
            return
        }

        const existingUser = await Login.findOne({user})
        if(existingUser){
            res
                .status(400)
                .json({ errorMessage: "An account with this user already exists!"})
            return
        }

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser: ILogin = new Login({
            user: user,
            password: passwordHash
        })

        const savedUser = await newUser.save();

        const newRelationship: IRelationship = new Relationship({
            userId: savedUser._id
        })

        const savedRelationship = await newRelationship.save()

        const newProfile: IProfile = new Profile({
            userId: savedUser._id,
            name: user
        })

        const savedProfile = await newProfile.save()

        const token = jwt.sign({
            user: savedUser._id
        }, `${process.env.JWT_SECRET}`)

        res.cookie("token", token, {
            httpOnly: true
        }).send({message: "New user created: ", savedUser })

    } catch(error) {
        throw error
    }
}

const update_password = async (req: Request, res: Response): Promise<void> => {
    try {
        const { password } = req.body as Pick<ILogin, "password">
        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const updateUser: ILogin | null = await Login.findByIdAndUpdate(
            { _id: user },
            { password: passwordHash }
        )

        res
            .status(200)
            .json({ message: "Password updated", profile: updateUser })
    } catch(error) {
        throw error
    }
}

const delete_user = async (req: Request, res: Response): Promise<void> => {
    try{
        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }

        // const existingProfile = await Profile.findOne({ 'userId': user })
        await Profile.findOneAndDelete({ userId: user })
        await Login.findByIdAndDelete({ _id: user })
        await Relationship.findOneAndDelete({ userId: user })

        res
            .cookie("token", "", {
                httpOnly: true,
                expires: new Date(0)
            })
            .status(200)
            .json({ message: "User excluded" })
            
    } catch(error) {
        throw error
    }
}

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, password } = req.body as Pick<ILogin, "user" | "password">
        
        if(!user || !password){
            res
              .status(400)
              .json({errorMessage: "Please enter all required fields!"})
            return
        }
      
        const existingUser = await Login.findOne({user})
    
        if(!existingUser){
            res
                .status(401)
                .json({errorMessage: "Wrong email or password!"})
            return
        }
    
        const passwordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!passwordCorrect){
            res
                .status(401)
                .json({errorMessage: "Wrong email or password!"})
            return
        }
    
        const token = jwt.sign({
            user: existingUser._id
        }, `${process.env.JWT_SECRET}`)
    
        res.cookie("token", token, {
            httpOnly: true
        }).send({ message: "Login Successfully"})

    } catch(error) {
        throw error
    }
}

const logout = (req: Request, res: Response) => {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0)
    }).send({ message: "Logout Successfully"})
}

export { create_user, update_password, delete_user, login, logout }