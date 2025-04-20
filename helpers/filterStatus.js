module.exports = (find, query) => {
  let objectStatus = find;
  if (query.status) {
    objectStatus.status = query.status;
  }
  return objectStatus;
};
