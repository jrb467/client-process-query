var EventEmitter = require('events').EventEmitter;

function cpQuery(cp, parser){
    var ee = new EventEmitter();

    var parseFunc = function(data){
        var parseResults = parser(data);
        if(parseResults){
            if(typeof parseResults === 'string'){
                ee.emit(parseResults);
            }else{
                ee.emit(parseResults.type, parseResults.data);
            }
        }
    };

    cp.stdout.on('data', parseFunc);

    //NOTE based on how this is set up, multiple queries on the same event MUST be done
    // through eachother's callback chain, or else there is a risk of conflicting results
    cp.query = function(input, encoding, eventName, cb){
        if(typeof eventName === 'function'){
            cb = eventName;
            eventName = encoding;
            encoding = null;
        }
        function ioerr(){
            cb('Input closed prematurely');
            ee.removeListener(eventName, querySuccess);
        }
        function querySuccess(data){
            cb(null, data);
            cp.stdout.removeListener('end', ioerr);
            cp.stdout.removeListener('close', ioerr);
        }
        cp.stdout.on('end', ioerr);
        cp.stdout.on('close', ioerr);
        ee.once(eventName, querySuccess);
        if(encoding){
            cp.stdin.write(input, encoding);
        }else{
            cp.stdin.write(input);
        }
    };
}

module.exports = cpQuery;
