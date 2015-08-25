var csv = require('csv');
var fs = require('fs');
fs.readFile('./1.csv', 'utf8', function(err, output){
    if (err) throw err;
    // console.log(data);
    csv.parse(output, function(err, data){
        console.log(data[0]);
    });
});
