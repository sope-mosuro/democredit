import { getWallet } from "../Controllers/walletController";
import { getWalletByUserId, createWallet } from "../Models/walletModel";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("../Models/walletModel");

describe("WalletController", () => {
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

  describe("getWallet", () => {
    it("should successfully retrieve wallet details", async () => {
      const mockWallet = {
        id: 1,
        user_id: 1,
        balance: 1000,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);

      // Create mock request and response objects
      const req = {
        body: { userId: 1 },
      } as Request;
      const res = createMockResponse();

      // Call the controller function directly
      await getWallet(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ wallet: mockWallet });
    });

    it("should create a new wallet if none exists", async () => {
      const mockWallet = {
        id: 1,
        user_id: 1,
        balance: 0,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock).mockResolvedValue(null);
      (createWallet as jest.Mock).mockResolvedValue(mockWallet);

      // Create mock request and response objects
      const req = {
        body: { userId: 1 },
      } as Request;
      const res = createMockResponse();

      // Call the controller function directly
      await getWallet(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(createWallet).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ wallet: mockWallet });
    });

    it("should handle wallet retrieval failure", async () => {
      (getWalletByUserId as jest.Mock).mockRejectedValue(new Error("Database error"));

      // Create mock request and response objects
      const req = {
        body: { userId: 1 },
      } as Request;
      const res = createMockResponse();

      // Call the controller function directly
      await getWallet(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error retrieving wallet" });
    });
  });
});
