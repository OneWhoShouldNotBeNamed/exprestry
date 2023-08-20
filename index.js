const express = require('express');
const app = express();
 
app.get('/', (req, res) => {
  res
    .status(200)
    .send('Hello server is running')
    .end();
});
app.get("/user", function(req, res){
  
    var name = req.query.name
    var age = req.query.age
      
    res
    .status(200)
    .send(`Hello ${name} , Aged ${age} years old.`)
    .end()
})
// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit. ');
});
module.exports = app;
