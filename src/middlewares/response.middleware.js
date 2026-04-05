const responseMiddleware = (req, res, next) => {
  res.success = ({
    data = null,
    message = "Success",
    meta = null,
    status = 200,
  }) => {
    const response = { success: true, message };
    if (data) response.data = data;
    if (meta) response.meta = meta;
    return res.status(status).json(response);
  };

  res.error = ({
    message = "Internal Server Error",
    status = 500,
    errors = null,
  }) => {
    const response = { success: false, message };
    if (errors) response.errors = errors;
    return res.status(status).json(response);
  };

  next();
};

module.exports = responseMiddleware;
