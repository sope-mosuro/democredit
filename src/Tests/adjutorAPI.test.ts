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

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await checkUserRisk("email@example.com");
      expect(result.isRisky).toBe(true);
      expect(result.reason).toMatch(/User is blacklisted/);
    });

    it("should handle API errors", async () => {
      const error = new Error("Network Error");
      (axios.get as jest.Mock).mockRejectedValue(error);

      await expect(checkUserRisk("email@example.com")).rejects.toThrow(
        "Failed to check user risk status"
      );
    });

    it("should return isRisky: false if no user data is found", async () => {
      const mockResponse = {
        data: {
          data: null,
        },
      };

      (axios.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await checkUserRisk("email@example.com");
      expect(result.isRisky).toBe(false);
    });
  });
});
