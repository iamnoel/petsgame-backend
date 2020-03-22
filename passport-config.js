const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const initialize = (passport, getUserByEmail, getUserById) => {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, {message: 'No user exists with that email '});
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        console.log(user);
        return done(null, user);
      } else {
        return done(null, false, {message: 'Password is incorrect'});
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser));
  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
};

module.exports = initialize;
