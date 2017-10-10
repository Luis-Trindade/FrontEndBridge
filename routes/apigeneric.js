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

    var queryParams='?';

    if ( req.query.start && req.query.start > 0 ) {
        queryParams = queryParams + 'start=' + req.query.start;
    }
    if(req.query.length) {
        queryParams = queryParams + '&nrec=' + req.query.length;
    }

    if(req.query.search && req.query.search.value != ""){
        queryParams = queryParams + '&criterio=' + req.query.search.value;
    }

    if(req.query.restricao != "--" ){
        queryParams = queryParams + '&restricao=' + req.query.restricao;
    }

    if( Object.keys(req.query).length > 0 ){
        restUrlGeneric = restUrlGeneric + queryParams;
        Object.keys(req.query).forEach(function (key) {
            if(key != 'search' && key != 'restricao' && key != 'start' && key != 'length') {
                restUrlGeneric = restUrlGeneric + '&' +  key + '=' + req.query[key];
            }
        });
    }
    restRequest.getRestRequest(restUrlGeneric, function (err, resultados) {
        if(err) { console.log(err); res.json(null); return; }
        res.json(resultados);
    });
});

router.get('/:table/count', function(req, res, next) {
    var restUrlClientes = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/' + req.params.table + '/short';
    var countFilteredUrlClientes = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/' + req.params.table + '/count';

    var queryParams='?';

    if ( req.query.start && req.query.start > 0 ) {
        queryParams = queryParams + 'start=' + req.query.start;
    }
    queryParams = queryParams + '&nrec=' + req.query.length;

    if(req.query.search && req.query.search.value != ""){
        queryParams = queryParams + '&criterio=' + req.query.search.value;
    }

    if(req.query.restricao != "--" ){
        queryParams = queryParams + '&restricao=' + req.query.restricao;
    }

    if( Object.keys(req.query).length > 0 ){
        Object.keys(req.query).forEach(function (key) {
            if(key != 'search' && key != 'restricao' && key != 'start'){
                queryParams = queryParams + '&' + key + '=' + req.query[key];
            }
        });
    }

    countFilteredUrlClientes = countFilteredUrlClientes + queryParams;
    restRequest.getRestRequest(countFilteredUrlClientes, function (err, resultados) {
        if(err) { console.log(err); res.send(500,"Server Error"); return; }
        res.json(resultados);
    });

});

/* GET home page. */
router.get('/:table/:clientId', function(req, res, next){
    var restUrlGeneric = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/' + req.params.table + '/' + req.params.clientId;
    restRequest.getRestRequest(restUrlGeneric, function (err, resultados) {
        if(err) { console.log(err); res.json(null); return; }
        res.json(resultados);
    });
});

router.post('/:table', function(req, res, next){
    var restUrlGeneric = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/' + req.params.table;
    var postPayload = req.body;
    restRequest.postRestRequest(restUrlGeneric, postPayload, function (err, resposta) {
    if(err) {
        res.status(406).json( resposta );
        return;
    }
        res.status(200).json(resposta);
    });
});


router.put('/:table/:clientId', function(req, res, next){
    var restUrlGeneric = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/' + req.params.table+ '/' + req.params.clientId;
    var putPayload = req.body;
    restRequest.putRestRequest(restUrlGeneric, putPayload, function (err, resposta) {
        if(err) {
            res.status(406).json( resposta );
            return;
        }
        res.status(200).json(resposta);
    });
});

router.delete('/:table/:idTabela', function(req, res, next) {
    var restUrlClient = 'http://' + cfg.lease_rest_host + ':' + cfg.lease_rest_port + '/lease/api/' + req.params.table + '/' + req.params.idTabela;

    restRequest.deleteRestRequest(restUrlClient, function (err) {
        if (err) {
            console.log(err);
            res.sendStatus(406, "Server Error");
            return;
        }
        res.sendStatus(200, "OK");
        return;
    });
});

module.exports = router;