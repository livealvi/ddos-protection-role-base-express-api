const createError = require("http-errors");
const Role = require("../../models/role/role");

const roles = async (req, res, next) => {
  try {
    const roles = await Role.find({});
    if (roles === null || roles.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, roles });
  } catch (error) {
    return next(createError(error));
  }
};

const role = async (req, res, next) => {
  try {
    const id = req.params.id;
    const role = await Role.findById({ _id: id });
    if (role === null || role.length == 0) {
      throw createError(404, "NO DATA FOUND");
    }
    return res.status(200).json({ success: 1, role });
  } catch (error) {
    return next(createError(error));
  }
};

module.exports = {
  roles,
  role,
};
