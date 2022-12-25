import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    //set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong",
  };

  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue);
    customError.msg = `Duplicate value entered for ${field} field, choose another ${field}`;
    customError.statusCode = 400;
  }
  if (err.name === "ValidationError") {
    const field = Object.keys(err.errors);
    const replace = field.join(" ").replaceAll(" ", " and ");
    let plural = "s";
    if (field.length < 2) {
      plural = "";
    }
    customError.msg = `Missing values for ${replace} field${plural}, all values must be provided.`;
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `No job with id ${err.value}`;
    customError.statusCode = 404;
  }

  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(customError.statusCode).json({ msg: customError.msg });
};
