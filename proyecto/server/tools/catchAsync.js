module.exports = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(err =>{
      console.error(`Error in catchAsync: ${err.message}`, err);
      next(err);
    });
  };
};
