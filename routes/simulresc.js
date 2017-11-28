var express = require('express');
var async = require('async');
var restRequest = require('../modules/httpRestRequest');
var cfg = require('../modules/config');
var router = express.Router();

router.post('/', function(req, res, next) {
    var simul = {};

    simul.cliente = req.body.cliente;
    simul.contrato = req.body.contrato;
    simul.ctotipo = req.body.ctotipo;
    simul.data = req.body.data.toString().substr(8,2) + req.body.data.toString().substr(5,2) + req.body.data.toString().substr(0,4);
    simul.datarescisao = "";
    simul.valortotal = 0;
    simul.rescisaocomiva = 0;
    simul.rescisaosemiva = 0;
    simul.jurosmora = 0;
    simul.debitosatraso = 0;
    simul.despesasciva = 0;
    simul.caucao = 0;
    simul.proximarenda = "";
    simul.valorseguro = 0;
    simul.capital = 0;
    simul.juro = 0;

    var restUrlPostSimulacao = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/simulresc';

    restRequest.postRestRequest(restUrlPostSimulacao, simul, function (err, resposta) {
        if(err) {
            res.status(406).json( resposta );
            return;
        }
        res.status(200).json({ simul: resposta.simul });
    });

});
module.exports = router;

