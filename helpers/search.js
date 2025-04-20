module.exports = (find, keyword) => {
  let objectSearch = find;
  if (keyword) {
    objectSearch.title = { $regex: keyword, $options: "i" }; // 'i' = ignore case
  } else if (keyword == "") {
    objectSearch.title = undefined;
  }
  return objectSearch;
};
