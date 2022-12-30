import { BadRequest } from "../errors/index.js";
// import { asyncWrapper } from "./asyncWrapper.js";

export const testUser = (req, res, next) => {
  if (req.user.testUser) {
    throw new BadRequest("Error: test user is read only!");
  }
  next();
};
