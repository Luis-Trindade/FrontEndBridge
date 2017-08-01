var express = require('express');
var router = express.Router();
var passport = require('passport');
var users = require('../modules/checkAuthUser');
var cfg = require('../modules/config');
var jwt = require("jwt-simple");
var jwt2 = require('jsonwebtoken');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('login', {layout: false});
});

/* POST autenticar e devolver webtoken. */
router.post('/', function(req, res, next) {
    if (req.body.name && req.body.password) {
        var name = req.body.name;
        var password = req.body.password;

        var user = users.checkAuthUser(name, password, function(auth){
            if (auth) {
                var payload = {username: name };
               /* var token = jwt.encode(payload, cfg.jwtSecret); */
                var token = jwt2.sign(payload, cfg.jwtSecret, {
                    expiresIn: 1800 // 30min
                });
                res.json({token: token});
                console.log('Authenticated!');
            }
            else {
                res.sendStatus(401);
                console.log('Authentication failed! Invalid User or Password!');
            }
        });

    } else {
        res.sendStatus(401);
    }

});


module.exports = router;
