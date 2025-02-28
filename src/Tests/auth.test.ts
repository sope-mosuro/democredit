import { authenticateUser } from '../Middlewares/authMiddleware';
import AuthService from '../Services/authService';
import { Request } from 'express';

// Mock the AuthService
jest.mock('../Services/authService');

type MockResponse = {
  status: jest.Mock<MockResponse, [number]>;
  json: jest.Mock<void, [unknown]>;
  send: jest.Mock<void, [string]>;
};

describe('Auth Middleware', () => {
  describe('authenticateUser', () => {
    it('should successfully authenticate a user with a valid token', async () => {
      // Mock the verifyToken method to return a user ID
      const mockUserId = '12345';
      (AuthService.verifyToken as jest.Mock).mockReturnValue(mockUserId);

      // Create a mock request with a valid token
      const req: Partial<Request> = {
        headers: { authorization: 'Bearer valid-token' },
      };

      // Create a mock response
      const res: MockResponse = {
        status: jest.fn<MockResponse, [number]>(() => res),
        json: jest.fn<void, [unknown]>(() => res),
        send: jest.fn<void, [string]>(() => {}),
      };

      // Call the middleware
      await authenticateUser(req as Request, res as Response, jest.fn());

      // Assert that the response was sent with a 200 status
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should fail to authenticate a user with an invalid token', async () => {
      // Mock the verifyToken method to return null for invalid token
      (AuthService.verifyToken as jest.Mock).mockReturnValue(null);

      // Create a mock request with an invalid token
      const req: Partial<Request> = {
        headers: { authorization: 'Bearer invalid-token' },
      };

      // Create a mock response
      const res: MockResponse = {
        status: jest.fn<MockResponse, [number]>(() => res),
        json: jest.fn<void, [unknown]>(() => res),
        send: jest.fn<void, [string]>(() => {}),
      };

      // Call the middleware
      await authenticateUser(req as Request, res as Response, jest.fn());

      // Assert that the response was sent with a 401 status
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Invalid token' })
      );
    });

    it('should handle a missing token in the request', async () => {
      // Create a mock request without an authorization header
      const req: Partial<Request> = {};

      // Create a mock response
      const res: MockResponse = {
        status: jest.fn<MockResponse, [number]>(() => res),
        json: jest.fn<void, [unknown]>(() => res),
        send: jest.fn<void, [string]>(() => {}),
      };

      // Call the middleware
      await authenticateUser(req as Request, res as Response, jest.fn());

      // Assert that the response was sent with a 401 status
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'No token provided' })
      );
    });
  });
});
