var request = require('request');

exports.getRestRequest = function(hostUrl, processResult){
    request({ method: 'GET', uri: hostUrl }, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); processResult(true); return; }
        try {
            var obj = JSON.parse(body);
        } catch (e) {
            console.log(e.toString());
            processResult(true);
            return;
        }
        processResult(false, obj);
    });
}


exports.putRestRequest = function(hostUrl, requestData,processResult){
    request({
            method: 'PUT',
            uri: hostUrl,
            headers: {"content-type": "application/json",    },
            json: requestData
    }, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); processResult(true); return; }
        if(response.statusCode != 200 && response.statusCode != 201 ) {
            var obj = body;
            processResult(true,obj); return;
        }
        var obj = body;
        processResult(false, obj);
    });
}


exports.postRestRequest = function(hostUrl, requestData, processResult){
    request({
            method: 'POST',
            uri: hostUrl,
            headers: {
                "content-type": "application/json",
            },
            json: requestData
    }, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); processResult(true); return; }
        if(response.statusCode != 200 && response.statusCode != 201 ) {
            var obj = body;
            processResult(true,obj); return;
        }
        var obj = body;
        processResult(false, obj);
    });
}


exports.deleteRestRequest = function(hostUrl, processResult){
    request({ method: 'DELETE', uri: hostUrl }, function(err, response, body) {
        // JSON body
        if(err) { console.log(err); processResult(true); return; }
        if( response.statusCode != 200 ) {
            var obj = body;
            processResult(true,obj); return;
        }
        //var obj = JSON.parse(body);
        processResult(false);
    });
}


