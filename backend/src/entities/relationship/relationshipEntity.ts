import { IRelationship } from "../../types/relationshipTypes"
import { model, Schema } from "mongoose"

const relId: Schema = new Schema(
    {
        matchId: String,
        userId: String
    }
)

const relationshipSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true
        },
        likesId: {
            type: [String]
        },
        dislikesId: {
            type: [String]
        },
        relId: [[String]]
    },
    { timestamps: true }
)

export default model<IRelationship>("Relationship", relationshipSchema)