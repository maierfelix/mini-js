module.exports = {
  console: console,
  error: function(msg) {
    console.error("Error: " + msg);
  },
  createArray: function() {
    return ([]);
  }
};