const jwt = require('jsonwebtoken');

module.exports = async(req, res, next) => {
  try {
    const token = await req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {email: decodedToken.email, userId: decodedToken.userId}
    next();
  } catch {
    res.status(401).json({ message: "You are not authenticated! :(" });
  }
};
