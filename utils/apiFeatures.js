class Api {
  constructor(query, tourQuery) {
    this.query = query;
    this.tourQuery = tourQuery;
  }

  filter() {
    console.log(this.query);
    const queryObj = { ...this.query };
    const specialString = ['page', 'sort', 'limit', 'fields'];
    specialString.forEach(el => {
      delete queryObj[el];
    });
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      match => `$${match}`
    );
    this.tourQuery = this.tourQuery.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    if (this.query.sort) {
      const str = this.query.sort.split(',').join(' ');
      console.log(str);
      this.tourQuery = this.tourQuery.sort(str);
    } else {
      this.tourQuery = this.tourQuery.sort('createdAt');
    }
    return this;
  }

  fieldSelect() {
    if (this.query.fields) {
      const select = this.query.fields.split(',').join(' ');
      console.log(select);
      this.tourQuery = this.tourQuery.select(select);
    } else {
      this.tourQuery = this.tourQuery.select('-__v');
    }
    return this;
  }

  paginate() {
    if (this.query.page) {
      const pageNo = this.query.page * 1;
      const limitNo = this.query.limit * 1;
      const skip = (pageNo - 1) * limitNo;
      // const total = await Tours.countDocuments();
      // if (skip >= total) {
      //   throw new Error('This is an error!');
      // }else
      this.tourQuery.skip(skip).limit(limitNo);
    }
    return this;
  }
}
module.exports = Api;
