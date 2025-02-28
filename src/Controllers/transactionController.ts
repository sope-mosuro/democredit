import { Request, Response } from "express";
import { createTransaction } from "../Models/transactionModel";
import { getWalletByUserId, updateWalletBalance } from "../Models/walletModel";

/**
 * @desc Deposit funds into the user's wallet
 * @route POST /api/transactions/deposit
 * @access Private (Authenticated)
 */
export const deposit = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { amount } = req.body;

    if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than zero" });

    const wallet = await getWalletByUserId(userId);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    await updateWalletBalance(wallet.id, amount);
    const transaction = await createTransaction({ wallet_id: wallet.id, type: "deposit", amount });

    return res.status(200).json({ message: "Deposit successful", transaction });
  } catch (error) {
    return res.status(500).json({ message: "Transaction failed" });
  }
};

/**
 * @desc Withdraw funds from the user's wallet
 * @route POST /api/transactions/withdraw
 * @access Private (Authenticated)
 */
export const withdraw = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { amount } = req.body;

    if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than zero" });

    const wallet = await getWalletByUserId(userId);
    if (!wallet) return res.status(404).json({ message: "Wallet not found" });

    if (wallet.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    await updateWalletBalance(wallet.id, -amount);
    const transaction = await createTransaction({ wallet_id: wallet.id, type: "withdrawal", amount });

    return res.status(200).json({ message: "Withdrawal successful", transaction });
  } catch (error) {
    return res.status(500).json({ message: "Transaction failed" });
  }
};

/**
 * @desc Transfer funds from one wallet to another
 * @route POST /api/transactions/transfer
 * @access Private (Authenticated)
 */
export const transfer = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const { recipientId, amount } = req.body;

    if (amount <= 0) return res.status(400).json({ message: "Amount must be greater than zero" });

    const senderWallet = await getWalletByUserId(userId);
    const recipientWallet = await getWalletByUserId(recipientId);

    if (!senderWallet) return res.status(404).json({ message: "Sender wallet not found" });
    if (!recipientWallet) return res.status(404).json({ message: "Recipient wallet not found" });

    if (senderWallet.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

    await updateWalletBalance(senderWallet.id, -amount);
    await updateWalletBalance(recipientWallet.id, amount);

    const transaction = await createTransaction({ wallet_id: senderWallet.id, type: "transfer", amount });

    return res.status(200).json({ message: "Transfer successful", transaction });
  } catch (error) {
    return res.status(500).json({ message: "Transaction failed" });
  }
};