import { Request, Response } from "express"
import { IProfile } from "../../types/userType"
import jwt from "jsonwebtoken"
import Profile from "../../entities/profile/profileEntity"
import Relationship from "../../entities/relationship/relationshipEntity"

const create_profile = async (req: Request, res: Response): Promise<void> => {
    try{
        const { name, description, local } = req.body as Pick<IProfile, "name" | "description" | "local">
        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }

        if(!name || !local){
            res
              .status(400)
              .json({errorMessage: "Please enter all required fields!"})
            return
        }

        const existingProfile = await Profile.findOne({'userId': user})

        if(existingProfile){
            res
              .status(400)
              .json({errorMessage: "Profile already created!"})
            return
        }

        const newProfile: IProfile = new Profile({
            userId: user,
            name: name,
            description: description,
            local: local
        })

        const savedProfile = await newProfile.save();
        
        res
            .status(201)
            .json({ message: "New profile created", newProfile: savedProfile })
    } catch(error){
        throw error
    }
}

const get_profile = async (req: Request, res: Response): Promise<void> => {
    try{
        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }
        const existingProfile = await Profile.findOne({'userId': user})

        res
            .status(200)
            .json({ message: "Profile obtido", profile: existingProfile })
    } catch (error) {
        throw error
    }
}

const get_unseen_profiles = async (req: Request, res: Response): Promise<void> => {
    try{
        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }

        const relationship = await Relationship.findOne({ userId: user })
        const profiles_to_remove = relationship?.likesId.concat(relationship.dislikesId).concat(user)
        const profiles = await Profile.find({ userId: { $nin: profiles_to_remove }})

        res
            .status(200)
            .json({ profile: profiles })
    } catch (error) {
        throw error
    }
}

const update_profile = async (req: Request, res: Response): Promise<void> => {
    try{
        const body  = req.body as Pick<IProfile, "description" | "local">
        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }
        const existingProfile = await Profile.findOne({ 'userId': user })

        const updateProfile: IProfile | null = await Profile.findByIdAndUpdate(
            { _id: existingProfile?._id },
            body
        )

        res
            .status(200)
            .json({ message: "Profile updated", profile: updateProfile })
    } catch (error) {
        throw error
    }
}

export { create_profile, get_profile, get_unseen_profiles, update_profile }