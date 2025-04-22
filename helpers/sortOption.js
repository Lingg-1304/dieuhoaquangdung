module.exports = (req) => {
  let sortOption;
  switch (req.query.sort) {
    case "price_asc":
      sortOption = { price: 1 };
      break;
    case "price_desc":
      sortOption = { price: -1 };
      break;
    case "popular":
      sortOption = { stock: -1 }; // hoặc trường viewCount nếu có
      break;
    case "newest" || undefined:
      sortOption = { position: -1 };
      break;
  }
  return sortOption;
};
