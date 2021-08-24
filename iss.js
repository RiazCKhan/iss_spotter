const request = require('request');

const fetchMyIP = function(callback) {
  request("https://api.ipify.org?format=json", function(error, response, body) {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`https://freegeoip.app/json/${ip}`, function(error, response, body) {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching coordinates for IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const { latitude, longitude } = JSON.parse(body);

    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {

  const url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, function(error, response, body) {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS Fly Over times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const time = JSON.parse(body).response;
    
    callback(null, time);
  });
};

const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((error, ip) => {
      if (error) {
        return callback(error, null);
      }
  
    fetchCoordsByIP(ip, (error, coords) => {
        if (error) {
          return callback(error, null);
        }
    
      fetchISSFlyOverTimes(coords, (error, time) => {
          if (error) {
            return callback(error, null);
          }

          callback(null, time);
        });
      });
    });
  };

module.exports = {
  nextISSTimesForMyLocation
};
