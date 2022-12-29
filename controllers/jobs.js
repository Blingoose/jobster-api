import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { Job } from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequest } from "../errors/index.js";

export const getAllJobs = asyncWrapper(async (req, res, next) => {
  const { search, status, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  let result = Job.find(queryObject);

  //! less optimized sort
  // switch (req.query.sort) {
  //   case "latest":
  //     result = result.sort("-createdAt");
  //     break;
  //   case "oldest":
  //     result = result.sort("createdAt");
  //     break;
  //   case "a-z":
  //     result = result.sort("position");
  //     break;
  //   case "z-a":
  //     result = result.sort("-position");
  //     break;
  // }

  //!!! a way better approach to sort
  const sortCriteria = {
    latest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  if (sort in sortCriteria) {
    result = result.sort(sortCriteria[sort]);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
});

export const getJob = asyncWrapper(async (req, res, next) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    return next(new NotFoundError(`No job with id ${jobId}`));
  }
  res.status(StatusCodes.OK).json({ job });
});

export const createJob = asyncWrapper(async (req, res, next) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
});

export const updateJob = asyncWrapper(async (req, res, next) => {
  const {
    body: { company, position },
    user: { userId, testUser },
    params: { id: jobId },
  } = req;

  // restrict test user from editing jobs
  if (testUser) {
    return next(new BadRequest("Error: test user is read only!"));
  }

  if (company === "" || position === "") {
    return next(new BadRequest("Fields cannot be empty"));
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    return next(new NotFoundError(`No job with id ${jobId}`));
  }
  res.status(StatusCodes.OK).json({ job });
});

export const deleteJob = asyncWrapper(async (req, res, next) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });

  if (!job) {
    return next(new NotFoundError(`No job with id ${jobId}`));
  }

  res.status(StatusCodes.OK).json({ removed: { job } });
});
