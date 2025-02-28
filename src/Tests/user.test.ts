import { registerUser } from "../Controllers/userController";
import { createUser } from "../Models/userModel";
import { checkUserRisk } from "../Services/adjutorServices";
import { Request } from "express";



// Mock dependencies
jest.mock("../Models/userModel");
jest.mock("../Services/adjutorServices");

type MockResponse = {
  status: jest.Mock<MockResponse, [number]>;
  json: jest.Mock<void, [unknown]>;
  send: jest.Mock<void, [string]>;
};

describe("UserController", () => {
  describe("registerUser", () => {
    it("should successfully register a new user", async () => {
      const mockUser = {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        bvn: "12345678901",
      };

      // Mock user creation
      (createUser as jest.Mock).mockResolvedValue(mockUser);

      // Mock risk check
      (checkUserRisk as jest.Mock).mockResolvedValue({ isRisky: false });

      const req = { body: mockUser };
      const res :MockResponse = {
        status: jest.fn<MockResponse, [number]>(() => res),
        json: jest.fn<void, [unknown]>(() => res),
        send: jest.fn<void, [string]>(() => {}),
      };

      await registerUser(req, res);

      expect(createUser).toHaveBeenCalledWith(mockUser);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "User registered successfully" })
      );
    });

    it("should handle user registration failure", async () => {
      const mockUser = {
        name: "John Doe",
        email: "john@example.com",
        phone: "1234567890",
        bvn: "12345678901",
      };

      // Mock user creation to throw error
      (createUser as jest.Mock).mockRejectedValue(new Error("Database error"));

      const req = { body: mockUser };
      const res :MockResponse = {
        status: jest.fn<MockResponse, [number]>(() => res),
        json: jest.fn<void, [unknown]>(() => res),
        send: jest.fn<void, [string]>(() => {}),
      };

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Failed to register user" })
      );
    });
  });
});
