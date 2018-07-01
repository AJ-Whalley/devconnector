const Validator = require("validator");
const isEmpty = require("./is-empty");
module.exports = function validateRegistrationInput(data) {
  let errors = {};

  data.name = isEmpty(data.name) ? "" : data.name;
  data.email = isEmpty(data.email) ? "" : data.email;
  data.password = isEmpty(data.password) ? "" : data.password;
  data.password2 = isEmpty(data.password2) ? "" : data.password2;

  if (
    !Validator.isLength(data.name, {
      min: 2,
      max: 30
    })
  ) {
    errors.name = "Name must be between 2 and 30 characters";
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

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

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (
    !Validator.isLength(data.password, {
      min: 6,
      max: 30
    })
  ) {
    errors.password = "Password must be between 6 & 30 characters";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm password field is required";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
