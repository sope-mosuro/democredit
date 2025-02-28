import { getWallet } from "../Controllers/walletController";
import { getWalletByUserId } from "../Models/walletModel";

// Mock dependencies
jest.mock("../Models/walletModel");

describe("WalletController", () => {
  describe("getWallet", () => {
    it("should successfully retrieve wallet details", async () => {
      const mockWallet = {
        id: 1,
        user_id: 1,
        balance: 1000,
        created_at: new Date(),
      };

      (getWalletByUserId as jest.Mock).mockResolvedValue(mockWallet);

      const req = { user: { id: 1 } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await getWallet(req, res);

      expect(getWalletByUserId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockWallet);
    });

    it("should handle wallet retrieval failure", async () => {
      (getWalletByUserId as jest.Mock).mockResolvedValue(null);

      const req = { user: { id: 1 } };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
      };

      await getWallet(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Wallet not found" })
      );
    });
  });
});
