const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { config } = require('../config/config');

const userService = require('./service.user');

const service = new userService();

class authService {
  async getUser(email, password) {
    const user = await service.findEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.userId,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token,
    };
  }

  async sendRecovery(email) {
    const user = await service.findEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = {
      sub: user.userId,
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    await service.update(user.userId, { recoveryToken: token });
    const mail = {
      from: config.smtpEmail,
      to: `${user.email}`,
      subject: 'email para recuperacion de contrasena',
      html: `<a href="http://localhost:8080/login?token=${token}">link</a>`,
    };
    const rta = await this.sendMail(mail);
    return rta;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.userId, { recoveryToken: null, password: hash });
      return { message: 'password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMailUser(body) {
    const payload = {
      sub: 1,
      name: body.name,
      surname: body.surname,
      number: body.number,
      email: body.email,
      password: body.password,
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });

    const mail = {
      from: config.smtpEmail,
      to: `${body.email}`,
      subject: 'email para verificacion de usuario',
      html: `<a href="http://localhost:5173/verify?token=${token}">link</a>`,
    };
    const rta = await this.sendMail(mail);
    return rta;
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: config.smtpEmail,
        pass: config.smtpPassword,
      },
    });
    await transporter.sendMail(infoMail);
    return { message: 'mail sent' };
  }

  async sendRecovery(email) {
    const user = await service.findEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = {
      sub: user.userId,
    };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    await service.update(user.userId, { recoveryToken: token });
    const mail = {
      from: config.smtpEmail,
      to: `${user.email}`,
      subject: 'email para recuperacion de contrasena',
      html: `<a href="http://localhost:8080/recovery?token=${link}">link</a>`,
    };
    const rta = await this.sendMail(mail);
    return rta;
  }
}

module.exports = authService;
