import { IProfile } from "../../types/userType"
import { model, Schema } from "mongoose"

const profileSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        local: {
            type: String
        }
    },
    { timestamps: true }
)

export default model<IProfile>("Profile", profileSchema)