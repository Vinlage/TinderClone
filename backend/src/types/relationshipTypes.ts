import { Document } from "mongoose"

export interface IRelationship extends Document{
    userId: string,
    likesId: string[],
    dislikesId: string[],
    relId: string[][]
}

export interface IMessage extends Document{
    relId: string,
    message: {
        message: string,
        user: string,
        date: number
    },
}