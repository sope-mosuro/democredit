import { registerUser } from "../Controllers/userController";
import { createUser, updateUserBlacklistStatus } from "../Models/userModel";
import { checkUserRisk } from "../Services/adjutorServices";
import { Request, Response } from "express";
import AuthService from "../Services/authService";

// Mock dependencies
jest.mock("../Models/userModel");
jest.mock("../Services/adjutorServices");
jest.mock("../Services/authService");

describe("UserController", () => {
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

  describe("registerUser", () => {
    it("should successfully register a user and update blacklist status", async () => {
      const mockUser = {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        bvn: "12345678901",
        created_at: new Date(),
      };

      const mockRiskResult = {
        isRisky: false,
        reason: "",
      };

      const mockToken = "mockToken";

      (checkUserRisk as jest.Mock).mockResolvedValue(mockRiskResult);
      (createUser as jest.Mock).mockResolvedValue(mockUser);
      (updateUserBlacklistStatus as jest.Mock).mockResolvedValue(undefined);
      (AuthService.generateToken as jest.Mock).mockReturnValue(mockToken);

      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          bvn: "12345678901",
        },
      } as Request;

      const res = createMockResponse();

      await registerUser(req, res);

      expect(checkUserRisk).toHaveBeenCalledWith("john@example.com");
      expect(createUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        bvn: "12345678901",
      });
      expect(updateUserBlacklistStatus).toHaveBeenCalledWith(1, false);
      expect(AuthService.generateToken).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered",
        user: mockUser,
        token: mockToken,
      });
    });

    it("should handle blacklisted user registration", async () => {
      const mockRiskResult = {
        isRisky: true,
        reason: "High risk due to past due loans",
      };

      (checkUserRisk as jest.Mock).mockResolvedValue(mockRiskResult);
      (createUser as jest.Mock).mockResolvedValue(null); // Simulate that user creation fails

      const req = {
        body: {
          name: "Jane Doe",
          email: "jane@example.com",
          phone: "0987654321",
          bvn: "98765432101",
        },
      } as Request;

      const res = createMockResponse();

      await registerUser(req, res);

      expect(checkUserRisk).toHaveBeenCalledWith("jane@example.com");
      expect(createUser).not.toHaveBeenCalled(); // User should not be created
      expect(updateUserBlacklistStatus).not.toHaveBeenCalled(); // No update to blacklist status
      expect(res.status).toHaveBeenCalledWith(400); // Assuming we want to return a 400 status for blacklisted users
      expect(res.json).toHaveBeenCalledWith({
        message: "User is blacklisted and cannot be registered",
        reason: "High risk due to past due loans",
      });
    });

    it("should handle user registration failure", async () => {
      const req = {
        body: {
          name: "John Doe",
          email: "john@example.com",
          phone: "1234567890",
          bvn: "12345678901",
        },
      } as Request;

      const res = createMockResponse();
      (checkUserRisk as jest.Mock).mockRejectedValue(new Error("Risk check failed"));

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Error registering user" });
    });
  });
});
