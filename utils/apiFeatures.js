class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    const title = this.queryString.title
      ? {
          title: {
            $regex: this.queryString.title,
            $options: 'i',
          },
        }
      : {};

    this.query = this.query.find({ ...title });
    return this;
  }
}

export default APIFeatures;
