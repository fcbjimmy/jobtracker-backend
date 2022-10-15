const User = require("../models/User");
const Job = require("../models/Job");
const CustomError = require("../error");
const { StatusCodes } = require("http-status-codes");

const createJob = async (req, res) => {
  const { company, position, status, date } = req.body;
  if (!company || !position) {
    throw new CustomError.BadRequestError("Please provide all required values");
  }
  const job = await Job.create({
    company,
    position,
    createdBy: req.user.userId,
    date,
    status,
  });
  console.log(job);

  res.status(StatusCodes.OK).json({ msg: "Job created" });
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).select(
    "-createdBy"
  );
  if (!jobs) {
    throw new CustomError.UnauthenticatedError("Invalid user");
  }
  res.status(StatusCodes.OK).json({ jobs });
};

const getSingleJob = async (req, res) => {
  const jobId = req.params.id;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: req.user.userId,
  }).select("-createdBy");

  if (!job) {
    throw new CustomError.BadRequestError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position, status, date },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (company === "" || position === "") {
    throw new CustomError.BadRequestError("Required fields cannot be empty");
  }
  const job = await Job.findOneAndUpdate(
    {
      _id: jobId,
      createdBy: req.user.userId,
    },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new CustomError.BadRequestError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ msg: "Job updated" });
};

const deleteJob = async (req, res) => {
  const {
    params: { id: jobId },
    user: { userId },
  } = req;
  const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new CustomError.BadRequestError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ msg: "Job deleted!" });
};

module.exports = { createJob, getAllJobs, getSingleJob, updateJob, deleteJob };
