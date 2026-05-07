const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.header('x-api-key');
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(403).json({
      status: 'fail',
      message: 'Forbidden: Invalid API Key',
    });
  }

  next();
};

export default apiKeyMiddleware;
