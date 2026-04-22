import ServiceUnavailableError from '../utils/exceptions/ServiceUnavailableError.js';

class PredictService {
  constructor() {
    this._fastApiUrl = process.env.FASTAPI_URL || 'http://localhost:8000';
  }

  async getPrediction(commodity, region) {
    try {
      const response = await fetch(
        `${this._fastApiUrl}/predict?commodity=${encodeURIComponent(commodity)}&region=${encodeURIComponent(region)}`
      );

      if (!response.ok) {
        throw new Error(`AI Service returned ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('FastAPI Error:', err.message);
      throw new ServiceUnavailableError('AI Prediction service currently unavailable');
    }
  }
}

export default PredictService;
