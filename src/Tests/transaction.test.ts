import { deposit, withdraw, transfer } from "../Controllers/transactionController";
import { createTransaction } from "../Models/transactionModel";
import { getWalletByUserId, updateWalletBalance } from "../Models/walletModel";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("../Models/transactionModel");
jest.mock("../Models/walletModel");

describe("TransactionController", () => {
  const createMockResponse = () => {
    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      jsonp: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
    };
    return res as Response;
  };

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

      // Create mock request and response objects
      const req = {
        body: { userId: 1, amount: 500 },
      } as Request;
      const res = createMockResponse();

      // Call the controller function directly
      await deposit(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(updateWalletBalance).toHaveBeenCalledWith(1, 500);
      expect(createTransaction).toHaveBeenCalledWith({
        wallet_id: 1,
        type: "deposit",
        amount: 500,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Deposit successful",
        transaction: expect.any(Object),
      });
    });

    it("should return an error if amount is less than or equal to zero", async () => {
      const req = {
        body: { userId: 1, amount: 0 },
      } as Request;
      const res = createMockResponse();

      await deposit(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Amount must be greater than zero",
      });
    });

    it("should return an error if wallet is not found", async () => {
      (getWalletByUserId as jest.Mock).mockResolvedValue(null);

      const req = {
        body: { userId: 1, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await deposit(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Wallet not found",
      });
    });

    it("should handle transaction failure", async () => {
      const mockWallet = {
        id: 1,
        user_id: 1,
        balance: 1000,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
      (updateWalletBalance as jest.Mock).mockResolvedValue(undefined);
      (createTransaction as jest.Mock).mockRejectedValue(new Error("Transaction error"));

      const req = {
        body: { userId: 1, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await deposit(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction failed",
      });
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
        body: { userId: 1, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await withdraw(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(updateWalletBalance).toHaveBeenCalledWith(1, -500);
      expect(createTransaction).toHaveBeenCalledWith({
        wallet_id: 1,
        type: "withdrawal",
        amount: 500,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Withdrawal successful",
        transaction: expect.any(Object),
      });
    });

    it("should return an error if amount is less than or equal to zero", async () => {
      const req = {
        body: { userId: 1, amount: 0 },
      } as Request;
      const res = createMockResponse();

      await withdraw(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Amount must be greater than zero",
      });
    });

    it("should return an error if wallet is not found", async () => {
      (getWalletByUserId as jest.Mock).mockResolvedValue(null);

      const req = {
        body: { userId: 1, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await withdraw(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Wallet not found",
      });
    });

    it("should return an error if insufficient funds", async () => {
      const mockWallet = {
        id: 1,
        user_id: 1,
        balance: 300,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);

      const req = {
        body: { userId: 1, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await withdraw(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Insufficient funds",
      });
    });

    it("should handle transaction failure", async () => {
      const mockWallet = {
        id: 1,
        user_id: 1,
        balance: 1000,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);
      (updateWalletBalance as jest.Mock).mockResolvedValue(undefined);
      (createTransaction as jest.Mock).mockRejectedValue(new Error("Transaction error"));

      const req = {
        body: { userId: 1, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await withdraw(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction failed",
      });
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
        body: { userId: 1, recipientId: 2, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await transfer(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(getWalletByUserId).toHaveBeenCalledWith(2);
      expect(updateWalletBalance).toHaveBeenCalledWith(1, -500);
      expect(updateWalletBalance).toHaveBeenCalledWith(2, 500);
      expect(createTransaction).toHaveBeenCalledWith({
        wallet_id: 1,
        type: "transfer",
        amount: 500,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transfer successful",
        transaction: expect.any(Object),
      });
    });

    it("should return an error if amount is less than or equal to zero", async () => {
      const req = {
        body: { userId: 1, recipientId: 2, amount: 0 },
      } as Request;
      const res = createMockResponse();

      await transfer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Amount must be greater than zero",
      });
    });

    it("should return an error if sender wallet is not found", async () => {
      (getWalletByUserId as jest.Mock).mockResolvedValueOnce(null);

      const req = {
        body: { userId: 1, recipientId: 2, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await transfer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Sender wallet not found",
      });
    });

    it("should return an error if recipient wallet is not found", async () => {
      const mockSourceWallet = {
        id: 1,
        user_id: 1,
        balance: 1000,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock).mockResolvedValueOnce(mockSourceWallet).mockResolvedValueOnce(null);

      const req = {
        body: { userId: 1, recipientId: 2, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await transfer(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Recipient wallet not found",
      });
    });

    it("should return an error if insufficient funds", async () => {
      const mockSourceWallet = {
        id: 1,
        user_id: 1,
        balance: 300,
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

      const req = {
        body: { userId: 1, recipientId: 2, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await transfer(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Insufficient funds",
      });
    });

    it("should handle transaction failure", async () => {
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

      (updateWalletBalance as jest.Mock).mockResolvedValue(undefined);
      (createTransaction as jest.Mock).mockRejectedValue(new Error("Transaction error"));

      const req = {
        body: { userId: 1, recipientId: 2, amount: 500 },
      } as Request;
      const res = createMockResponse();

      await transfer(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Transaction failed",
      });
    });
  });
});
