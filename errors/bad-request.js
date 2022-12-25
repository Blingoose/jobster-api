import { CustomAPIError } from "./custom-api.js";
import { StatusCodes } from "http-status-codes";

export class BadRequest extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
