const fetch = require("node-fetch")

exports.ytdl = async(url) => {
  const response = await fetch('https://api.youtubedl.site/get-direct-url', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
      'Referer': 'https://youtubedl.site/'
    },
    body: JSON.stringify({
      url: url,
      format_id: '18'
    })
  });

  const data = await response.json();
  return data;
}
