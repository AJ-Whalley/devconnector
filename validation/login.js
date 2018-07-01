const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;

  const emailLocalPart = data.email.split("@");
  if (
    !Validator.isLength(emailLocalPart[0], {
      min: 6,
      max: 50
    })
  ) {
    errors.email = "Email must contain 6 characters before the @ sign";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
