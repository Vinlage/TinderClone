import { Request, Response } from "express"
import { IMessage } from "../../types/relationshipTypes"
import Message from "../../entities/relationship/messageEntity"
import jwt from "jsonwebtoken"

const get_messages = async (req: Request, res: Response): Promise<void> => {
    try{
        const { relId } = req.body as Pick<IMessage, "relId">

        if(!relId){
            res
                .status(200)
                .json({message: "No relationship id informed"})
            return
        }

        const message = await Message.findOne({relId: relId})

        res
            .status(200)
            .json({message: message})
    } catch(error) {
        throw error
    }
}

const new_message = async (req: Request, res: Response): Promise<void> => {
    try{
        const { relId, message } = req.body as Pick<IMessage, "relId" | "message">

        if(!message){
            res
                .status(200)
                .json({message: "No message informed"})
            return
        }

        const token = req.cookies.token
        const { user } = jwt.decode(token) as { user: string }

        message.user = user
        message.date = Date.now() 

        const existingMessage = await Message.findOne({ relId: relId })

        if(!existingMessage){
            res
                .status(200)
                .json({message: "Relationship Id do not exists"})
            return
        }

        const savedMessage = await Message.findOneAndUpdate({ relId: relId, 
            $push: { message: message }
        })

        res
            .status(200)
            .json({message: "New Message Created"})
    } catch(error) {
        throw error
    }
}

export { get_messages, new_message }