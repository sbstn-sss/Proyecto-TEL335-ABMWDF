class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString }; // an object with every req.query fields
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // we will use them later

    excludedFields.forEach(field => delete queryObj[field]); // we exclude the elements of the queryObj

    // 2) advanced filtering for : gte, gt, lte, lt

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    const queryAdv = JSON.parse(queryStr);

    this.query = this.query.find(queryAdv);

    return this; // return the entire object so we can chain the methods
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' '); // secondary criteria

      this.query = this.query.sort(sortBy); // asc: sort=price \\ desc: sort=-price
    } else {
      // sort by creation date
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  projectFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v -secretTour'); // fields that we dont want to see
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = limit * (page - 1);

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
module.exports = APIFeatures;
