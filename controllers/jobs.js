import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { Job } from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError, BadRequest } from "../errors/index.js";

export const getAllJobs = asyncWrapper(async (req, res, next) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
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
    user: { userId },
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    return next(new BadRequest("Company or Positioin fields cannot be empty"));
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
