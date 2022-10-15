const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../error");
const { createJWT } = require("../utils/jwt");

const register = async (req, res) => {
  const { name, password, email } = req.body;

  const isValid = await User.findOne({ email: email });

  if (isValid) {
    throw new CustomError.BadRequestError("Please use another email");
  }

  const user = await User.create({ name, password, email });

  const token = createJWT(user);

  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, email }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide both values");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError(`No user with email ${email}`);
  }

  const validPassword = await user.comparePasswords(password);
  if (!validPassword) {
    throw new CustomError.UnauthenticatedError("Password does not match");
  }

  const token = createJWT(user);

  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email }, token });
};

const logout = async (req, res) => {
  res
    .clearCookie("token")
    .status(StatusCodes.OK)
    .json({ message: "User successfully logged out" });
};

module.exports = { register, login, logout };
