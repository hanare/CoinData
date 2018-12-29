const express=  require('express')
const app = express()
const path = require('path')
//const port = 3000
const port = process.env.PORT || 3000

app.use(express.static(path.join(__dirname,"public/coindata")));
app.get('/',(req,res)=>{
	res.sendFile(path.join(__dirname+"/public/coindata/index.html"));

//	res.send("Hi welcome ");

});

app.listen(port,()=>{
console.log("Listening on port 3000");
});
