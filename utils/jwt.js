const jwt = require("jsonwebtoken");

const createJWT = (user) => {
  return jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  );
};

// const attachCookiesToResponse = ({ res, userToken }) => {
//   const token = createJWT(userToken);
//   const oneDay = 1000 * 60 * 60 * 24;
//   res.cookie("token", token, {
//     httpOnly: true,
//     expired: oneDay,
//     secure: process.env.NODE_ENV === "production",
//     signed: true,
//   });
// };

module.exports = { createJWT };
