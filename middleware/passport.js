const createError = require("http-errors");
const passport = require("passport");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const User = require("../models/user/user");

passport.use(
  new StrategyJwt(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    function (jwtPayload, done) {
      return User.findOne({ email: jwtPayload.email })
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          //console.log(err);
          return done(err);
        });
    }
  )
);
