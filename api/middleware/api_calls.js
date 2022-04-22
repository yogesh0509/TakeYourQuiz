const request = require('request');

module.exports = {
    make_API_call: function(url, options){
        return new Promise((resolve, reject) =>{
            request(url, options, (err, res, body) =>{
                if(err) reject(err)
                resolve(body)
            });
        })
        // request(url, options, (err, res, body) =>{
        //     //console.log(JSON.parse(body));
        // });
    }
}