import ClientError from '../utils/exceptions/ClientError.js';

const errorHandler = (error, req, res, next) => {
  // Handle all ClientError subclasses (InvariantError, NotFoundError, ServiceUnavailableError, etc.)
  if (error instanceof ClientError) {
    return res.status(error.statusCode).json({
      status: 'fail',
      message: error.message,
    });
  }

  // Unhandled server error — log it but don't leak details to client
  console.error('[Server Error]', error);
  return res.status(500).json({
    status: 'error',
    message: 'Maaf, terjadi kegagalan pada server kami.',
  });
};

export default errorHandler;

