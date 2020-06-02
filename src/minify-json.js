var fs = require('fs');

fs.readFile('/dev/stdin', (err, data) => {
  if (err) throw err;
  console.log(JSON.stringify(JSON.parse(data)));
});

