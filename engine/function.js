const axios = require("axios")

exports.fetchJson = async(url, options) => {
    options ? options : {}
    const res = await axios({
        method: 'GET',
        url: url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
        },
        ...options
    })
    return res.data
}

exports.sleep = async(ms) => {
    new Promise(resolve => setTimeout(resolve, ms));
}