require('dotenv').config();

const request = require('request');
const CHECK_IP_URL = 'http://ipinfo.io/ip';

const name = process.argv[2];
if (!name) {
  console.error('Second param needed.');
  process.exit(1);
}
const updateIpUrl = process.env.UPDATE_IP_URL_BASE + name;

request(CHECK_IP_URL, function(error, response, body) {
  if (!error && response.statusCode === 200 && body) {
    updateHomeIp(body.trim());
  }
});

function updateHomeIp(ip) {
  request.post({
    url: updateIpUrl,
    form: { ip },
    auth: {
      user: process.env.AUTH_NAME,
      pass: process.env.AUTH_PWD,
      sendImmediately: true,
    },
  }, function(error, response, body) {
    if (error) {
      console.error(error);
    } else {
      console.log(body, '-', new Date());
    }
  });
}
