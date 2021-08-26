const request = require('request');

const fetchMyIP = cb => {
  request('https://api.ipify.org?format=json', (error, resp, body) => {
    if (error) return cb(error, null);

    if (resp.statusCode !== 200) {
      return cb(Error(`Status code ${resp.statusCode} when fetching IP. Response: ${body}`), null);
    }

    const data = JSON.parse(body);
    return cb(null, data.ip);
  });
};

const fetchCoordsByIP = (ip, cb) => {
  request('https://freegeoip.app/json/24.85.229.228', (error, resp, body) => {
    if (error) return cb(error, null);

    if (resp.statusCode !== 200) {
      return cb(Error(`Status code ${resp.statusCode} when fetching IP. Response: ${body}`), null);
    }

    const data = JSON.parse(body);
    const coords = { latitude: data.latitude, longitude: data.longitude };
    return cb(null, coords);

  });
};

const fetchISSFlyOverTimes = (coords, cb) => {
  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error, resp, body) => {
    if (error) return cb(error, null);

    if (resp.statusCode !== 200) {
      return cb(Error(`Status code ${resp.statusCode} when fetching IP. Response: ${body}`), null);
    }

    return cb(null, JSON.parse(body).response);
  });
};

const nextISSTimesForMyLocation = cb => {

  fetchMyIP((error, ip) => {
    if (error) return cb(error, null);

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) return cb(error, null);

      fetchISSFlyOverTimes(coords, (error, passTimes) => {
        if (error) return cb(error, null);

        return cb(null, passTimes);
      });
    });
  });
};


module.exports = { nextISSTimesForMyLocation };