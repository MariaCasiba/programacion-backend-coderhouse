
export const authentication = async (req, res, next) => {
  if (req.session.user.role !== "admin") {
    return res.status(401).send("error de autenticación del admin");
  }
  next();
};
