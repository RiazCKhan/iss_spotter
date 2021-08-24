const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0); // How is the 'new' keyword being utilized here - no comprehendo

console.log(Date(0))

    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};


module.exports = { printPassTimes }