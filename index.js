require('dotenv').config();

const path = require('path');
const fs = require('fs');
const request = require('request');
const CHECK_IP_URL = 'http://ipinfo.io/ip';
const CACHE_PATH = path.join(__dirname, './cache');

const name = process.argv[2];
if (!name) {
  console.error('Second param needed.');
  process.exit(1);
}

const updateIpUrl = process.env.UPDATE_IP_URL_BASE + name;

request(CHECK_IP_URL, function(error, response, body) {
  if (!error && response.statusCode === 200 && body) {
    const ip = body.trim();
    const isCacheUpdated = updateCache(ip);
    if (isCacheUpdated) {
      updateHomeIp(ip);
    } else {
      console.log('ip not changed:', ip, '-', new Date());
    }
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
      console.log('update home ip', body , '-', new Date());
    }
  });
}

/**
 * updateCache
 *
 * @param ip
 * @returns Boolean isCacheUpdated
 */
function updateCache(ip) {
  let isSameIp = false;
  if (fs.existsSync(CACHE_PATH)) {
    const cachedIp = fs.readFileSync(CACHE_PATH).toString().trim();
    isSameIp = cachedIp === ip;
  }

  if (!isSameIp) {
    fs.writeFileSync(CACHE_PATH, ip);
  }

  return !isSameIp;
}
