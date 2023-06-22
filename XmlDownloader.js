var request = require('request');

let cache = Cache()

function Cache() {

    let seen = {}
    let s1 = ''
    let s2 = ''

    return function(key, value) {

        if (value) {
            seen[key] = value
            // console.log('hit ' + value.length)
            return value
        }

        if (key in seen) {
            var l = key.split('?')[0]

            let del = []

            if (l != s1 && l!= s2) {

                let getrid = s1

                s1 = s2
                s2 = l

                if (getrid) {

                    for(let k in seen) {
                        let z = k.split('?')[0];

                        if (z == getrid) {
                            del.push(k)
                            //console.log('delete '+k)
                        }
                    }
                }
            }

            for (let i of del) delete seen[i]
            
            return seen[key]
        }
    }
}

exports.Download = function(env, table, query, cb) {

    //let query = 'sys_idSTARTSWITH' + id_prefix
    let p = '/' + table + '.do?JSONv2&sysparm_action=getRecords&sysparm_query=' + query

    //console.log('path is ' + env.Host + p)

    var auth = "Basic " + new Buffer(env.Auth).toString("base64");

    var requestOptions = {
        url: "https://" + env.Host + p,
        headers: {
            "Authorization": auth,
            "Content-Type": "application/json"
        }
    };

    let value = cache(p)

    if (value) {
        cb(value)
        return
    }

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

    try {

        request( requestOptions, (err, res, body) => {
            if (err) {
                return console.log(err);
            }

            let json = JSON.parse(body)
            
            if (json.error) {
                handleError(json.error)
            } 

            cache(p, json.records || [] )

            cb(cache(p))
            
        });

    } catch ( e ) {
        console.log('!!!!!!!!!!!!!!!!!! ' + e)
        cb([])
    }
}

function handleError(error) {
    if (error.indexOf('Invalid table') > -1) return

    console.log('Error: ' + error)
}