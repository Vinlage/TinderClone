import { Request, Response } from "express"
import { IRelationship, IMessage } from "../../types/relationshipTypes"
import Relationship from "../../entities/relationship/relationshipEntity"
import Message from "../../entities/relationship/messageEntity"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

const new_liked_profile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body

        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }

        const existingUser = await Relationship.findOne({ userId: userId })

        if(!existingUser){
            res
                .status(200)
                .json({ message: "User do not exists" })
            return
        }

        if(userId == user){
            res
                .status(200)
                .json({ message: "You cannot like yourself" })
            return
        }

        const existingRelationship = await Relationship.findOne({ userId: user })
        const existingLike = await Relationship.findOne({ userId: user, likesId: userId })

        if(existingLike){
            res
                .status(200)
                .json({ message: "You already liked this user" })
            return
        }else{
            const updateRelationship: IRelationship | null = await Relationship.findByIdAndUpdate(
                { _id: existingRelationship?._id },
                { $push: { likesId: userId }}
            )
        }

        const existingAnotherLike = await Relationship.findOne({ userId: userId, likesId: user })

        if(existingAnotherLike){
            //match
            const salt = await bcrypt.genSalt()
            const matchId = await bcrypt.hash(existingRelationship?._id+userId, salt)
            
            const updateRelationship: IRelationship | null = await Relationship.findByIdAndUpdate(
                { _id: existingRelationship?._id },
                { 
                    $push: { 
                        relId: [matchId, userId]
                    }
                }
            )
            const updateAnotherRelationship: IRelationship | null = await Relationship.findOneAndUpdate(
                { userId: userId },
                { $push: { relId: [matchId, user] }}
            )

            const newMessage: IMessage = new Message({
                relId: matchId
            })
    
            const savedMessage = await newMessage.save()

            res
                .status(200)
                .json({ message: "You have a match!" })
            return
        }
        
        res
            .status(200)
            .json({ message: "New Like" })
        return
    
    } catch(error) {
        throw error
    }
}

const get_liked_profiles = async (req: Request, res: Response): Promise<void> => {
    try{
        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }

        const likes = await Relationship.find({ userId: user }).select('likesId')

        console.log(likes)
    } catch(error) {
        throw error
    }
}

const get_matches = async (req: Request, res: Response): Promise<void> => {
    try{
        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }

        const matches = await Relationship.find({ userId: user }).select('relId')

        console.log(matches[0].relId)

        res
            .status(200)
            .json({ matches: matches[0].relId })
    } catch(error) {
        throw error
    }
}

const remove_liked_profile = async (req: Request, res: Response): Promise<void> => {
    try{
        const { relId, userId } = req.body

        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }

        const messageRel: IMessage = new Message({
            relId: relId
        })

        await Message.findOneAndDelete({relId: messageRel.relId})
        await Relationship.findOneAndUpdate({ userId: user },
        { 
            $pull: { 
                relId: [relId, userId]
            }
        })
        
        res
            .status(200)
            .json({ message: "Profile removed" })
    } catch(error) {
        throw error
    }
}

export { new_liked_profile, get_liked_profiles, get_matches, remove_liked_profile }