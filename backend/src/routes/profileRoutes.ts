import { Router } from "express"
import { create_profile, get_profile, update_profile, get_unseen_profiles } from "../controllers/profile/profileController" 
import { auth } from "../middleware/auth"

const router: Router = Router()

router.post("/create-profile", auth, create_profile)
router.get("/get-profile", auth, get_profile)
router.get("/get-unseen-profiles", auth, get_unseen_profiles)
router.put("/update-profile", auth, update_profile)

export default router