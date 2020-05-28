const fetch = require('node-fetch');
/**
 * Generate the header object with provided token
 * @param  {string} token Token
 */
const getHeaders = async (token) => {
    let headers = {
        'Content-Type' : 'application/json'
    }
    if(token) headers.Authorization = `Bearer ${token}`
    return headers
}
/**
 * Made API request to directline endpoint v3
 * 
 * @param  {String} method Request Method
 * @param  {String} url Request URL
 * @param  {String} token Request Authorization Token
 * @param  {Object} body Request Payload
 * 
 * returns
 *  - Array|Object|Array of Activity|Array of watermarks
 */
const request = async (method, url, token, body) =>{
    return new Promise(async (resolve, reject)=>{
        let options = {}
        if(body){
            options.body = JSON.stringify(body)
        }
        const headers = await getHeaders(token);
        options.method = method;
        options.headers = headers;
        fetch(url, options)
        .then((result) => result.text())
        .then((result) => {
            let output = JSON.parse(result);
            resolve(output);
        })
        .catch((err)=> {
            reject(err)
        })
    })
}

module.exports = {
    request
}