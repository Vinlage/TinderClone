import { Router } from "express"
import { auth } from "../middleware/auth"
import { get_messages, new_message } from "../controllers/relationship/messageController"

const router: Router = Router()

router.get("/get-messages", auth, get_messages)
router.post("/new-message", auth, new_message)

export default router