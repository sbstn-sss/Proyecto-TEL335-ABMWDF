const filterObj = (obj, ...allowedFields) => {
  //if (!allowedFields) return obj;
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

module.exports = filterObj;
