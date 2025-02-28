import axios from "axios";
import { checkUserRisk } from "../Services/adjutorServices";
import "jest";

// Mock axios
jest.mock("axios");

describe("AdjutorService", () => {
  describe("checkUserRisk", () => {
    it("should return isRisky: true for blacklisted user", async () => {
      const mockResponse = {
        data: {
          data: {
            karma_identity: "email@example.com",
            reason: "User is blacklisted",
          },
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await checkUserRisk("email@example.com");
      expect(result.isRisky).toBe(true);
      expect(result.reason).toMatch(/User is blacklisted/);
    });

    it("should return isRisky: false for non-blacklisted user", async () => {
      const mockResponse = {
        data: {
          data: null,
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await checkUserRisk("email@example.com");
      expect(result.isRisky).toBe(false);
    });

    it("should handle API errors", async () => {
      const error = new Error("Network Error");
      (axios.post as jest.Mock).mockRejectedValue(error);

      await expect(checkUserRisk("email@example.com")).rejects.toThrow(
        "Failed to check user risk status"
      );
    });
  });
});
