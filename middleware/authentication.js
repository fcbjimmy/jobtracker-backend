const { verify } = require("jsonwebtoken");
const CustomError = require("../error");
const { StatusCodes } = require("http-status-codes");

const authenticateUser = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    throw new CustomError.UnauthenticatedError("Authentication invalid");
  }

  const token = authorization.split(" ")[1];
  try {
    const payload = verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: payload.userId,
      name: payload.name,
    };
    next();
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: `Request is not Authorized` });
  }
};

module.exports = { authenticateUser };
