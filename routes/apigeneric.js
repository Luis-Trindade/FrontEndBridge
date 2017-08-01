var express = require('express');
var restRequest = require('../modules/httpRestRequest');
var cfg = require('../modules/config');
var async = require('async');
var router = express.Router();


/* GET home page. */
router.get('/:table/short', function(req, res, next){
    var restUrlGeneric = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/' + req.params.table + '/short';
    restRequest.getRestRequest(restUrlGeneric, function (err, resultados) {
        if(err) { console.log(err); res.json(null); return; }
        res.json(resultados);
    });
});

router.get('/:table', function(req, res, next){
    var restUrlGeneric = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/' + req.params.table;
    if( Object.keys(req.query).length > 0 ){
        restUrlGeneric = restUrlGeneric + '?';
        Object.keys(req.query).forEach(function (key) {
            restUrlGeneric = restUrlGeneric + key + '=' + req.query[key] + '&';
        });
    }
    restRequest.getRestRequest(restUrlGeneric, function (err, resultados) {
        if(err) { console.log(err); res.json(null); return; }
        res.json(resultados);
    });
});



module.exports = router;