const requestHelper = {
  validateMethod(req, string) {
    if (req.method === string) {
      return true;
    } else {
      return false;
    }
  },
};

module.exports = requestHelper;
