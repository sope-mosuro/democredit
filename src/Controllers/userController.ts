import { Request, Response } from "express";
import { createUser, updateUserBlacklistStatus } from "../Models/userModel";
import { checkUserRisk } from "../Services/adjutorServices";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, bvn } = req.body;

    const riskResult = await checkUserRisk(bvn);
    const isBlacklisted = riskResult.isRisky;

    const user = await createUser({ name, email, phone, bvn });
    await updateUserBlacklistStatus(user.id, isBlacklisted);

    return res.status(201).json({ message: "User registered", user, blacklistReason: riskResult.reason });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
};
