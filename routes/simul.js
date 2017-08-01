var express = require('express');
var async = require('async');
var restRequest = require('../modules/httpRestRequest');
var cfg = require('../modules/config');
var router = express.Router();

router.post('/', function(req, res, next) {
    var simul = {};
    var gruposrendas = [];

    simul.ctoap = req.body.ctoap;
    simul.ctodado = req.body.ctodado;
    simul.ctoiva = req.body.ctoiva;
    simul.ctojurdif = req.body.ctojurdif;
    simul.cto2dat = req.body.cto2dat.toString().substr(8,2) + req.body.cto2dat.toString().substr(5,2) + req.body.cto2dat.toString().substr(0,4);
    simul.ctotcon = req.body.ctotcon;
    simul.ctopraz = req.body.ctopraz;
    simul.ctoper = req.body.ctoper;
    simul.cto1ren = req.body.cto1ren.toString().substr(8,2) + req.body.cto1ren.toString().substr(5,2) + req.body.cto1ren.toString().substr(0,4);
    simul.ctovaljurdif = req.body.ctovaljurdif;
    simul.ctotxim = req.body.ctotxim;

    if(req.body.qtd1) {
        gruposrendas[0] = {};
        gruposrendas[0].quantidade = req.body.qtd1;
        gruposrendas[0].valor = req.body.valor1;
        gruposrendas[0].factor = req.body.factor1;
    }
    if(req.body.qtd2) {
        gruposrendas[1] = {};
        gruposrendas[1].quantidade = req.body.qtd2;
        gruposrendas[1].valor = req.body.valor2;
        gruposrendas[1].factor = req.body.factor2;
    }
    if(req.body.qtd3) {
        gruposrendas[2] = {};
        gruposrendas[2].quantidade = req.body.qtd3;
        gruposrendas[2].valor = req.body.valor3;
        gruposrendas[2].factor = req.body.factor3;
    }
    simul.gruposrendas = gruposrendas;

    var restUrlPostSimulacao = 'http://' + cfg.lease_rest_host + ':'+ cfg.lease_rest_port + '/lease/api/simul';

    restRequest.postRestRequest(restUrlPostSimulacao, simul, function (err, resposta) {
        if(err) {
            res.status(406).json( resposta );
            return;
        }

        res.status(200).json({ simul: resposta.simul, gruposrendas: resposta.gruposrendas, cashflow: resposta.cashflow});
    });

});
module.exports = router;

