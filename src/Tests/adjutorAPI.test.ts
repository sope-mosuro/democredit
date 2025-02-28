import axios from "axios";
import { checkUserRisk } from "../Services/adjutorServices";
import "jest";
import { describe, it } from "node:test";

// Mock axios
jest.mock("axios");

describe("AdjutorService", () => {
  describe("checkUserRisk", () => {
    it("should return isRisky: true for high risk users", async () => {
      const mockResponse = {
        data: {
          data: {
            past_due_loan_amount_due: 6000,
          },
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await checkUserRisk("123");
      expect(result.isRisky).toBe(true);
      expect(result.reason).toMatch(/past due loans/);
    });

    it("should return isRisky: false for low risk users", async () => {
      const mockResponse = {
        data: {
          data: {
            past_due_loan_amount_due: 4000,
          },
        },
      };

      (axios.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await checkUserRisk("123");
      expect(result.isRisky).toBe(false);
    });

    it("should handle API errors", async () => {
      const error = new Error("Network Error");
      (axios.post as jest.Mock).mockRejectedValue(error);

      await expect(checkUserRisk("123")).rejects.toThrow(
        "Failed to check user risk status"
      );
    });
  });
});
