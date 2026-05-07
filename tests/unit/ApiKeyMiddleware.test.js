import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import apiKeyMiddleware from '../../src/middleware/api-key.js';

describe('ApiKeyMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    process.env.API_KEY = 'valid-api-key';
  });

  it('should call next() when valid API key is provided', () => {
    req.header.mockReturnValue('valid-api-key');
    apiKeyMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 403 when API key is missing', () => {
    req.header.mockReturnValue(undefined);
    apiKeyMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'fail' }));
  });

  it('should return 403 when API key is invalid', () => {
    req.header.mockReturnValue('invalid-key');
    apiKeyMiddleware(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
