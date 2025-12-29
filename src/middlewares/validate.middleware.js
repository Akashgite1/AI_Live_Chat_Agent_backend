import ApiError from '../utils/ApiError.js';

export const validateMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    throw new ApiError(400, 'Message cannot be empty');
  }

  if (message.length > 2000) {
    req.body.message = message.slice(0, 2000);
  }

  next();
};
