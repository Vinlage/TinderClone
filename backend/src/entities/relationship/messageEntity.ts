import { IMessage } from "../../types/relationshipTypes"
import { model, Schema } from "mongoose"

const messageSchema: Schema = new Schema(
    {
        relId: {
            type: String,
            required: true
        },
        message: {
            message: {
                type: String
            },
            user: {
                type: String
            },
            date: {
                type: Number
            }
        }
    },
    { timestamps: true }
)

export default model<IMessage>("Message", messageSchema)