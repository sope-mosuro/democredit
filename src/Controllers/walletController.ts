import { Request, Response } from "express";
import { getWalletByUserId, createWallet } from "../Models/walletModel";

/**
 * @desc Get the authenticated user's wallet
 * @route GET /api/wallet
 * @access Private (Authenticated)
 */
export const getWallet = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    let wallet = await getWalletByUserId(userId);
    if (!wallet) wallet = await createWallet(userId);

    return res.status(200).json({ wallet });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving wallet" });
  }
};
