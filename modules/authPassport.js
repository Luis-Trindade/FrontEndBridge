var passport = require("passport");
var passportJWT = require("passport-jwt");
var users = require("./checkAuthUser");
var cfg = require("./config");
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;

var params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromUrlQueryParameter("auth")
};


module.exports = function() {

    var strategy = new Strategy(params, function(payload, done) {
        var user = users.getUserByName(payload.username, function(err,exists){
            if(exists){
                return done(null, {username: payload.username});
            } else {
                return done(new Error("User not found"), null);
            }
        });
    });
    passport.use(strategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt", cfg.jwtSession);
        }
    };
};