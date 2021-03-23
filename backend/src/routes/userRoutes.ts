import { Router } from "express"
import { create_user, update_password, delete_user, login, logout } from "../controllers/auth/userController" 
import { auth } from "../middleware/auth"

const router: Router = Router()

router.post("/create-user", create_user)
router.put("/update-password", auth, update_password)
router.delete("/delete-user", auth, delete_user)
router.post("/login", login)
router.get("/logout", logout)

export default router