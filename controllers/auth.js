import { StatusCodes } from "http-status-codes";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { User } from "../models/User.js";
import { BadRequest, UnauthenticatedError } from "../errors/index.js";

export const register = asyncWrapper(async (req, res, next) => {
  // const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   return next(new BadRequest("Please Provide name, email and password"));
  // }
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
});

export const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequest("Please provide email and password"));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new UnauthenticatedError("User doesn't exist!"));
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    return next(new UnauthenticatedError("Invalid Credentials"));
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
});
