const getPrediction = async (req, res, next) => {
  try {
    const { commodity, region } = req.query;

    if (!commodity || !region) {
      return res.status(400).json({ message: 'Commodity and Region are required' });
    }

    // Call FastAPI Service (LSTM Model)
    const FASTAPI_URL = process.env.FASTAPI_URL || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${FASTAPI_URL}/predict?commodity=${commodity}&region=${region}`);
      
      if (!response.ok) {
        throw new Error('AI Service (FastAPI) returned an error');
      }

      const data = await response.json();
      res.json(data);
    } catch (err) {
      console.error('FastAPI Error:', err.message);
      // Fallback or mock data if AI service is not running
      res.status(503).json({ 
        message: 'AI Prediction service currently unavailable',
        error: err.message 
      });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPrediction,
};
