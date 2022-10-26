const joi = require('joi');

const id = joi.number().integer();
const name = joi.string().min(5).max(20);
const surname = joi.string().min(5).max(20);
const email = joi.string().email();
const number = joi.string().min(8).max(9);
const password = joi.string().min(8);
const photo = joi.string();

const createUser = joi.object({
  name: name.required(),
  surname: surname.required(),
  email: email.required(),
  number: number.required(),
  password: password.required(),
  photo,
});

const updateUser = joi.object({
  id,
  name,
  email,
  surname,
  password,
  photo,
  number
});

const getUser = joi.object({
  id: id.required(),
});

module.exports = { createUser, updateUser, getUser };
