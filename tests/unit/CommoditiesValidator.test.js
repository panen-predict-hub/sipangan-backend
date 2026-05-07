import { describe, it, expect } from '@jest/globals';
import CommoditiesValidator from '../../src/validator/commodities/index.js';

describe('CommoditiesValidator', () => {
  it('should not throw error when valid commodity payload is provided', () => {
    const payload = {
      name: 'Beras Super',
      unit: 'kg',
    };
    expect(() => CommoditiesValidator.validateCommodityPayload(payload)).not.toThrow();
  });

  it('should use default unit "kg" if not provided', () => {
    const payload = { name: 'Beras Super' };
    const value = CommoditiesValidator.validateCommodityPayload(payload);
    expect(value.unit).toBe('kg');
  });

  it('should throw error for unknown fields', () => {
    const payload = { name: 'Beras', unknown: 'field' };
    expect(() => CommoditiesValidator.validateCommodityPayload(payload)).toThrow();
  });
});
