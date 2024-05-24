const catchAsync = require('../tools/catchAsync');
const AppError = require('../tools/appError');
const APIFeatures = require('../tools/APIFeatures');
// generic functions that returns the async function
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOneAndDelete({ _id: req.params.id });

    const modelName = Model.modelName.toLowerCase();
    if (!doc) {
      return next(new AppError(`No ${modelName} found with that id`, 404)); // return to not execute the following code
    }

    res.status(204).json({
      status: 'success',
      message: null
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true // apply the validators of the model
    });
    const modelName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that id`, 404)); // return to not execute the following code
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    const modelName = Model.modelName.toLowerCase();

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that id`, 404)); // return to not execute the following code
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    // TO ALLOW NESTED GET REVIEWS ON TOUR
    let filter = {};
    // if nested route (get 1 tour)
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE THE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .projectFields()
      .paginate();
    const doc = await features.query; // the await belongs to the final query that we want

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc
      }
      // user: req.user // now we have access to it from the protect middleware
    });
  });
