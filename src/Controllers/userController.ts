import { Request, response, Response } from "express";
import { createUser, updateUserBlacklistStatus } from "../Models/userModel";
import { checkUserRisk } from "../Services/adjutorServices";
import { createWallet } from "../Models/walletModel";
import AuthService from "../Services/authService";

/**
 * @desc create and register a user
 * @route POST /api/users/register
 * @access Public
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, bvn } = req.body;

    // Check if user is blacklisted using Adjutor service
    const riskResult = await checkUserRisk(email);
    const isBlacklisted = riskResult.isRisky;
 
    if (isBlacklisted) {
      return res.status(400).json({ message: "User is blacklisted and cannot be registered", reason: riskResult.reason });
    }

    const user = await createUser({ name, email, phone, bvn });
    
    await updateUserBlacklistStatus(user.id, isBlacklisted);
// Generate authentication token after user has been checked
    const token = AuthService.generateToken(user.id);
    const wallet = await createWallet(user.id)

    return res.status(201).json({ message: "User registered", user,wallet, token });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
};
