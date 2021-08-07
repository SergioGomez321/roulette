//Install express server


const express = require('express');
const app = express(); 


app.use(express.static(__dirname + '/dist/ruleta'));

app.get('*', function(req,res) {
  return  req.hostname;
});



app.listen(process.env.PORT || 8080);