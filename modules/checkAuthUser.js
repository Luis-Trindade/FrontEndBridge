var ActiveDirectory = require('activedirectory');
var cfg = require('./config');

var config = {
    url: cfg.ldap_url,
    baseDN: cfg.ldap_baseDN,
    username: cfg.ldap_username,
    password: cfg.ldap_password
};

var ad = new ActiveDirectory(config);

exports.getUserByName = function(name,funcaocallback){
    var userWithDomain = name + cfg.ldap_userDomain;
    ad.userExists(userWithDomain, function(err, exists) {
        funcaocallback(err, exists);
    });
};

exports.checkAuthUser = function(username,password,funcaocallback){
    var userWithDomain = username + cfg.ldap_userDomain;
    ad.authenticate(userWithDomain, password, function(err, auth) {
        funcaocallback(auth);
        if (auth) {
            console.log('Authenticated!');
        }
        else {
            console.log('Authentication failed! Invalid User or Password!');
        }
    });
};