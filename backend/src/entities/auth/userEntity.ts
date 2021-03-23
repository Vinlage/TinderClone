import { ICreateUser } from "../../types/userType"
import { model, Schema } from "mongoose"

const loginSchema: Schema = new Schema(
    {
        user: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default model<ICreateUser>("Login", loginSchema)