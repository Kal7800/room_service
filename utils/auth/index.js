const passport = require('passport');
const LocalStrategy = require('./strategies/local.strategy');
const jwtStrategy = require('./strategies/jwt.strategy');

passport.use(jwtStrategy);
passport.use(LocalStrategy);
