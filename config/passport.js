const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

const keys = require("../config/keys");

const User = mongoose.model("users");

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.SECRET
};

module.exports = passport => {
  passport.use(
    new JwtStrategy(options, (payload, done) => {
      User.findById(payload.id)
        .then(foundUser => {
          if (!foundUser) {
            return done(null, false);
          }
          return done(null, {
            id: foundUser.id
          });
        })
        .catch(error => {
          console.log("! Error", error);
          return done(error, false);
        });
    })
  );
};
