const isAuthenticated = (req) => {
  const accessToken = req.cookies["access_token"];
  console.log("access Token: ", accessToken);
  return accessToken ? true : false;
};

module.exports = { isAuthenticated };
