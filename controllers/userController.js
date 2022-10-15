const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { createJWT } = require("../utils/jwt");
const CustomError = require("../error");

const showCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId }).select("-password");
  if (!user) {
    throw new CustomError.UnauthenticatedError(
      "Invalid User, please login again"
    );
  }
  res.status(StatusCodes.OK).json({ name: user.name, email: user.email });
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;

  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    new: true,
    runValidators: true,
  });

  const token = createJWT(user);

  res
    .status(StatusCodes.OK)
    .json({
      user: { name: user.name, email: user.email },
      token,
      msg: "User credentials edited",
    });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }

  const user = await User.findOne({ _id: req.user.userId });
  const validPassword = await user.comparePasswords(oldPassword);

  if (!validPassword) {
    throw new CustomError.UnauthenticatedError("Wrong password");
  }
  user.password = newPassword;
  await user.save();

  //compare password
  //hash password again
  res.status(StatusCodes.OK).json({ msg: "Success! password updated" });
};

module.exports = { showCurrentUser, updateUser, updatePassword };
