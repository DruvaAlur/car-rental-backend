const { UserSchema } = require("./index");

function getUserByEmail(email) {
  return UserSchema.findOne({
    email,
  }).then((result) => {
    return result;
  });
}

function insertUser(user) {
  const newUser = new UserSchema(user);
  return newUser.save().then((res) => {
    return res;
  });
}

module.exports = {
  getUserByEmail,
  insertUser,
};
