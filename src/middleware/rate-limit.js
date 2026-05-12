import rateLimit from 'express-rate-limit';

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5, // Batasi setiap IP maksimal 5 request login per windowMs
  message: {
    status: 'fail',
    message: 'Terlalu banyak percobaan login, silakan coba lagi setelah 15 menit.',
  },
  standardHeaders: true, // Kembalikan info rate limit di header `RateLimit-*`
  legacyHeaders: false, // Matikan header `X-RateLimit-*`
});

export { loginRateLimiter };
