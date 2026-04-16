import InvariantError from '../utils/exceptions/InvariantError.js';

class PredictService {
  constructor() {
    this._fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
  }

  async getPrediction(commodity, region) {
    if (!commodity || !region) {
      throw new InvariantError('Commodity and Region are required');
    }

    try {
      const response = await fetch(`${this._fastApiUrl}/predict?commodity=${commodity}&region=${region}`);
      
      if (!response.ok) {
        throw new Error('AI Service (FastAPI) returned an error');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('FastAPI Error:', err.message);
      throw new Error('AI Prediction service currently unavailable');
    }
  }
}

export default PredictService;
