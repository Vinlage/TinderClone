import express, { Express } from "express"
import userRoutes from "./routes/userRoutes"
import profileRoutes from "./routes/profileRoutes"
import relationshipRoutes from "./routes/relationshipRoutes"
import messagesRoutes from "./routes/messagesRoutes"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"

const app: Express = express()

dotenv.config()

const PORT: string | number = process.env.PORT || 4000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(userRoutes)
app.use(profileRoutes)
app.use(relationshipRoutes)
app.use(messagesRoutes)

const uri: string = `mongodb://localhost:27017/tinder-database`
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.set("useFindAndModify", false)

mongoose
  .connect(uri, options)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch(error => {
    throw error
  })
