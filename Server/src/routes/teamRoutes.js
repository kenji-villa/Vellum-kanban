import { Router } from "express";
import {
  getTeam,
  sendInvitation,
  acceptInvite,
  declineInvite,
  cancelInvitation,
  removeTeammate,
} from "../controllers/teamController.js";

const router = Router();

router.get("/", getTeam);
router.post("/invitations", sendInvitation);
router.post("/invitations/:id/accept", acceptInvite);
router.post("/invitations/:id/decline", declineInvite);
router.delete("/invitations/:id", cancelInvitation);
router.delete("/members/:userId", removeTeammate);

export default router;