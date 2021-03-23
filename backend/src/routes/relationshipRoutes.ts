import { Router } from "express"
import { new_liked_profile, get_liked_profiles, get_matches, remove_liked_profile } from "../controllers/relationship/relationshipController" 
import { auth } from "../middleware/auth"

const router: Router = Router()

router.post("/new-liked-profile", auth, new_liked_profile)
router.get("/get-liked-profiles", auth, get_liked_profiles)
router.get("/get-matches", auth, get_matches)
router.post("/remove-liked-profile", auth, remove_liked_profile)

export default router