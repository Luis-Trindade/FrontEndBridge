var express = require('express');
var restRequest = require('../modules/httpRestRequest');
var cfg = require('../modules/config');
var async = require('async');
var router = express.Router();


/* GET home page. */
router.get('/short', function(req, res, next) {
    var restUrlContra = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/contra/short';
    var countUrlContra = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/contra/count';
    var countFilteredUrlContra = countUrlContra;

    var queryParams='?';


    if ( req.query.start > 0 ) {
        queryParams = queryParams + 'start=' + req.query.start;
    }

    queryParams = queryParams + '&nrec=' + req.query.length;
    if ( req.query.clinum ){
        queryParams = queryParams + '&ctocli=' + req.query.clinum;
    }
    if(req.query.search.value ){
        queryParams = queryParams + '&criterio=' + req.query.search.value;
    }

    if(req.query.order.length > 0){
        var ordem = "&order=";
        var ordemAsc = "";
        var ordemDesc = "";
        req.query.order.forEach(function(x){
            var columnIndex = parseInt(x.column, 10) + 1;
            if(x.dir == "asc"){
                ordemAsc += columnIndex + ",";
            }
            if(x.dir == "desc"){
                ordemDesc += columnIndex + ",";
            }
        });
        if(ordemAsc.length > 0 ){
            ordemAsc = ordemAsc.slice(0, -1);
            ordem += ordemAsc + " asc";
        }
        if(ordemDesc.length > 0 ){
            ordemDesc = ordemDesc.slice(0, -1);
            ordem += ordemDesc + " desc";
        }
        queryParams = queryParams + ordem;
    }
    for (var key in req.query ) {
        if( key != 'start' &&
            key != 'length' &&
            key != 'search' &&
            key != 'order' ) {
            queryParams = queryParams + '&' + key + '=' + req.query[key];
        }
    }
    restUrlContra = restUrlContra + queryParams;
    countFilteredUrlContra = countFilteredUrlContra + queryParams;

    async.parallel([
        function(callback) {
            restRequest.getRestRequest(restUrlContra, function (err, resultados) {
                if(err) { console.log(err); callback(true); return; }
                callback(false, resultados);
            });
        },
        function(callback) {
            restRequest.getRestRequest(countUrlContra, function (err, resultados) {
                if(err) { console.log(err); callback(true); return; }
                callback(false, resultados);
            });
        },
        function(callback) {
            restRequest.getRestRequest(countFilteredUrlContra, function (err, resultados) {
                if(err) { console.log(err); callback(true); return; }
                callback(false, resultados);
            });
        }
    ],
        function(err, results) {
            if(err) { console.log(err); res.status(500).send("Server Error"); return; }
            var resposta = {
                draw: req.query.draw,
                recordsTotal: results[1],
                recordsFiltered: results[2],
                data: results[0]
            };
            res.json(resposta);
        }
    );

});


module.exports = router;