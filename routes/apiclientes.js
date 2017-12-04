var express = require('express');
var restRequest = require('../modules/httpRestRequest');
var cfg = require('../modules/config');
var async = require('async');
var router = express.Router();

router.get('/valida_nif', function(req, res, next){
    var restUrlValidaNif = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/client/valida_nif';
    if ( req.query.nif > 0 ) {
        restUrlValidaNif = restUrlValidaNif + '?nif=' + req.query.nif;
    }
    async.parallel([
        function(callback) {
            restRequest.getRestRequest(restUrlValidaNif, function (err, resultados) {
                if(err) { console.log(err); callback(true); return; }
                callback(false, resultados);
            });
        } ],
        function(err, results) {
            if(err) { console.log(err); res.send(500,"Server Error"); return; }
            if(results == 1) {
                res.sendStatus(200);
            } else {
                res.sendStatus(400);
            }
        }
    );
});

/* GET home page. */
router.get('/', function(req, res, next) {
    var restUrlClientes = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/client/short';
    var countUrlClientes = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/client/count';
    var countFilteredUrlClientes = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/client/count';

    var queryParams='?';

    if ( req.query.start > 0 ) {
        queryParams = queryParams + 'start=' + req.query.start;
    }
    queryParams = queryParams + '&nrec=' + req.query.length;
    if(req.query.search.value ){
        queryParams = queryParams + '&criterio=' + req.query.search.value;
    }

    if(req.query.restricao != "--" ){
        queryParams = queryParams + '&restricao=' + req.query.restricao;
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
    restUrlClientes = restUrlClientes + queryParams;
    countFilteredUrlClientes = countFilteredUrlClientes + queryParams;

    async.parallel([
        function(callback) {
            restRequest.getRestRequest(restUrlClientes, function (err, resultados) {
                if(err) { console.log(err); callback(true); return; }
                callback(false, resultados);
            });
        },
        function(callback) {
            restRequest.getRestRequest(countUrlClientes, function (err, resultados) {
                if(err) { console.log(err); callback(true); return; }
                callback(false, resultados);
            });
        },
        function(callback) {
            restRequest.getRestRequest(countFilteredUrlClientes, function (err, resultados) {
                if(err) { console.log(err); callback(true); return; }
                callback(false, resultados);
            });
        }
    ],
        function(err, results) {
            if(err) { console.log(err); res.send(500,"Server Error"); return; }
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


router.get('/count', function(req, res, next) {
    var restUrlClientes = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/client/short';
    var countFilteredUrlClientes = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/client/count';

    var queryParams='?';

    if(req.query.search.value ){
        queryParams = queryParams + '&criterio=' + req.query.search.value;
    }

    if(req.query.restricao != "--" ){
        queryParams = queryParams + '&restricao=' + req.query.restricao;
    }
    countFilteredUrlClientes = countFilteredUrlClientes + queryParams;
    restRequest.getRestRequest(countFilteredUrlClientes, function (err, resultados) {
        if(err) { console.log(err); res.send(500,"Server Error"); return; }
        res.json(resultados);
    });

});


router.get('/mapas/:nomemapa', function(req, res, next){
    var restUrlMapas = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/mapas/' + req.params.nomemapa;
    var queryParams='?';

    for (var key in req.query ) {
        if( key != 'start' &&
            key != 'length' &&
            key != 'search' &&
            key != 'order' ) {
            queryParams = queryParams + '&' + key + '=' + req.query[key];
        }
    }
    restUrlMapas = restUrlMapas + queryParams;

    restRequest.getRestRequest(restUrlMapas, function (err, resultados) {
        if(err) { console.log(err); res.json(null); return; }
        res.json(resultados);
    });
    //res.json(resposta);

});

router.get('/:id', function(req, res, next){
    var serviceUrl = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/client/' + req.params.id;
    restRequest.getRestRequest(serviceUrl, function (err, resultados) {
        if(err) { console.log(err); res.json(null); return; }
        res.json(resultados);
    });
    //res.json(resposta);

});


/* PUT home page. */
router.put('/:numcliente', function(req, res, next) {
    console.log('Request Id:', req.params.numcliente);

    var cliente= {};
    var restocliente = {};
    var modificacliente = {};
    var restUrlClient = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/client/'+req.params.numcliente;

    //callback(false, restricao);
    cliente.clinum = req.body.clinum;
    cliente.clitcli = req.body.clitcli;
    cliente.clipais = req.body.clipais;
    cliente.clinfis = req.body.clinfis;
    cliente.clinom = req.body.clinom;
    cliente.climor = req.body.climor;
    cliente.climor2 = req.body.climor2;
    cliente.clicop = req.body.clicop;
    cliente.clicop2 = req.body.clicop2;
    cliente.cliloc = req.body.cliloc;
    cliente.clitlx = req.body.clitlx;
    cliente.cliwww = req.body.cliwww;
    cliente.clitel = req.body.clitel;
    if(req.body.datanascimento) {
        restocliente.datanascimento = req.body.datanascimento;
    }
    if(req.body.cliehsucursal){
        cliente.cliehsucursal = req.body.cliehsucursal;
    } else {
        cliente.cliehsucursal = 'N';
    }
    if(req.body.cliivacaixa){
        cliente.cliivacaixa = req.body.cliivacaixa;
    } else {
        cliente.cliivacaixa = 'N';
    }
    if(req.body.clibanco){
        cliente.clibanco = req.body.clibanco;
    } else {
        cliente.clibanco = 'N';
    }

    modificacliente.client = cliente;
    if(req.body.clitcli == 'P'){
        modificacliente.restocliente = restocliente;
    }

    restRequest.putRestRequest(restUrlClient, modificacliente, function (err, modificacliente) {
        if(err) {
            res.status(406).json( modificacliente );
            return;
        }
        res.status(200).json({ client: modificacliente.rClienteT, restocliente: modificacliente.rRestCliT });
    });

});

router.delete('/:numcliente', function(req, res, next) {
    console.log('Request Id:', req.params.numcliente);
    var restUrlClient = 'http://' + cfg.lease_rest_host + ':' + cfg.lease_rest_port + '/lease/api/client/' + req.params.numcliente;

    restRequest.deleteRestRequest(restUrlClient, function (err, body) {
        if (err) {
            res.status(406).json( body );
            //res.sendStatus(400, body);
            return;
        }
        res.status(200).json( "OK" );

        return;
    });
});

router.post('/', function(req, res, next) {
    var client = {};
    var restocliente = {};
    var registoCliente = {};


    client.clipais = req.body.clipais;
    client.clinfis = req.body.clinfis;
    client.clinom = req.body.clinom;
    client.climor = req.body.climor;
    client.climor2 = req.body.climor2;
    client.clicop = req.body.clicop;
    client.clicop2 = req.body.clicop2;
    client.cliloc = req.body.cliloc;
    client.clitlx = req.body.clitlx;
    client.cliwww = req.body.cliwww;
    client.clitel = req.body.clitel;
    if(req.body.cliehsucursal){
        client.cliehsucursal = 'S';
    } else {
        client.cliehsucursal = 'N';
    }
    if(req.body.cliivacaixa){
        client.cliivacaixa = 'S';
    } else {
        client.cliivacaixa = 'N';
    }
    if(req.body.clibanco){
        client.clibanco = 'S';
    } else {
        client.clibanco = 'N';
    }

    registoCliente.client = client;
    client.clitcli = req.body.clitcli;
    if(req.body.clitcli == 'P'){
        if(req.body.restocliente.datanascimento) {
            restocliente.datanascimento = req.body.restocliente.datanascimento.toString().substr(8, 2) + req.body.restocliente.datanascimento.toString().substr(5, 2) + req.body.restocliente.datanascimento.toString().substr(0, 4);
        }
        registoCliente.restocliente = restocliente;
    }
    var restUrlRegCliente = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/client';

    restRequest.postRestRequest(restUrlRegCliente, registoCliente, function (err, resposta) {
        if(err) {
            res.status(406).json( resposta );
            return;
        }

        res.status(200).json({ client: resposta.rClienteT, restocliente: resposta.rRestCliT });
    });

});

module.exports = router;