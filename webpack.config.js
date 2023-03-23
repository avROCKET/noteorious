const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      querystring: require.resolve('querystring-es3'),
    },
  },
};