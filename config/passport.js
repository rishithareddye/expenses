var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

// load up the user model
var config = require('../config/database'); // get db config file

module.exports = function(passport) {
  var opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = config.secret;
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    connection.query("select id,email,friendlyname,fullname from login where id="+connection.escape(jwt_payload.id), function (error, results, fields) {
          if(error){
            return done(err, false);
          } else if(results.length <= 0) {
            return done(null, false);
          }
           else {
            return done(null, results[0]);
          }
      });
  }));
};