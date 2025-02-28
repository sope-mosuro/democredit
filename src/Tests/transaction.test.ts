import { deposit, withdraw, transfer } from "../Controllers/transactionController";
import { createTransaction } from "../Models/transactionModel";
import { getWalletByUserId, updateWalletBalance } from "../Models/walletModel";

// Mock dependencies
jest.mock("../Models/transactionModel");
jest.mock("../Models/walletModel");

describe("TransactionController", () => {
  describe("deposit", () => {
    it("should successfully deposit funds", async () => {
      const mockWallet = {
        id: 1,
        user_id: 1,
        balance: 1000,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
      (updateWalletBalance as jest.Mock).mockResolvedValue(undefined);
      (createTransaction as jest.Mock).mockResolvedValue({
        id: 1,
        wallet_id: 1,
        type: "deposit",
        amount: 500,
        created_at: new Date(),
      });

      const req = {
        user: { id: 1 },
        body: { amount: 500 },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await deposit(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(updateWalletBalance).toHaveBeenCalledWith(1, 500);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Deposit successful" })
      );
    });
  });

  describe("withdraw", () => {
    it("should successfully withdraw funds", async () => {
      const mockWallet = {
        id: 1,
        user_id: 1,
        balance: 1000,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
      (updateWalletBalance as jest.Mock).mockResolvedValue(undefined);
      (createTransaction as jest.Mock).mockResolvedValue({
        id: 1,
        wallet_id: 1,
        type: "withdrawal",
        amount: 500,
        created_at: new Date(),
      });

      const req = {
        user: { id: 1 },
        body: { amount: 500 },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await withdraw(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(updateWalletBalance).toHaveBeenCalledWith(1, -500);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Withdrawal successful" })
      );
    });
  });

  describe("transfer", () => {
    it("should successfully transfer funds", async () => {
      const mockSourceWallet = {
        id: 1,
        user_id: 1,
        balance: 1000,
        created_at: new Date(),
      };

      const mockDestinationWallet = {
        id: 2,
        user_id: 2,
        balance: 500,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock)
        .mockResolvedValueOnce(mockSourceWallet)
        .mockResolvedValueOnce(mockDestinationWallet);

      (updateWalletBalance as jest.Mock)
        .mockResolvedValue(undefined)
        .mockResolvedValue(undefined);

      (createTransaction as jest.Mock).mockResolvedValue({
        id: 1,
        wallet_id: 1,
        type: "transfer",
        amount: 500,
        created_at: new Date(),
      });

      const req = {
        user: { id: 1 },
        body: { amount: 500, recipient_wallet_id: 2 },
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await transfer(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(getWalletByUserId).toHaveBeenCalledWith(2);
      expect(updateWalletBalance).toHaveBeenCalledWith(1, -500);
      expect(updateWalletBalance).toHaveBeenCalledWith(2, 500);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Transfer successful" })
      );
    });
  });
});
