const isAuthenticated = (req) => {
  const accessToken = req.cookies["access_token"];
  return accessToken ? true : false;
};

module.exports = { isAuthenticated };
