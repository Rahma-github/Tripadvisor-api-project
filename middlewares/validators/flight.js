const chickIfAvailable = (req, res, next) => {
  const { type, numberOfSeats } = req.query;

  if (!type || !numberOfSeats) {
    let err = new Error("type of seat and number of seat is required");
    err.status = 400;
    return next(err);
  }

  next();
};

module.exports = {
  chickIfAvailable,
};
