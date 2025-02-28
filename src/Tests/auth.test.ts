import { authenticateUser } from "../Middlewares/authMiddleware";
import AuthService from "../Services/authService";
import { NextFunction, Request, Response } from "express";

// Mock the AuthService
jest.mock("../Services/authService");

describe("Auth Middleware", () => {

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

  it("should successfully authenticate a user with a valid token", async () => {
    // Mock the verifyToken method to return a user ID
    const mockUserId = "12345";
    (AuthService.verifyToken as jest.Mock).mockReturnValue(mockUserId);

    // Create mock request and response objects
    const req = {
      headers: { authorization: "Bearer valid-token" },
      body:{},
    } as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    // Call the middleware function with all required arguments
   authenticateUser(req, res, next);

    // Assert that next was called with the user ID
    expect(next).toHaveBeenCalledWith();

     // Assert that the userId was set in the request body
     expect(req.body.userId).toBe(mockUserId);
    });
  

  

  it("should fail to authenticate a user with an invalid token", async () => {
    // Mock the verifyToken method to return null for invalid token
    (AuthService.verifyToken as jest.Mock).mockReturnValue(null);

    // Create mock request and response objects
    const req = {
      headers: { authorization: "Bearer invalid-token" },
      body:{},
    } as Request;
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    // Call the middleware function with all required arguments
    await authenticateUser(req, res, next);

    // Assert that next was called with an error
    expect(res.status).toHaveBeenCalledWith(401);
     // Assert that the response json method was called with the error message
     expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - Invalid token' });
  });

  it("should handle a missing token in the request", async () => {
    // Create mock request and response objects
    const req = {
      headers:{},
      body:{},
    }as Request
    const res = createMockResponse();
    const next = jest.fn() as NextFunction;

    // Call the middleware function with all required arguments
    await authenticateUser(req, res, next);

  // Assert that the response status was set to 401
  expect(res.status).toHaveBeenCalledWith(401);
  // Assert that the response json method was called with the error message
  expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized - No token provided' });
});

});
