import ClientError from '../utils/exceptions/ClientError.js';

const errorHandler = (error, req, res, next) => {
  if (error instanceof ClientError) {
    const response = res.status(error.statusCode).json({
      status: 'fail',
      message: error.message,
    });
    return response;
  }

  // Server error
  console.error(error);
  const response = res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
  return response;
};

export default errorHandler;
