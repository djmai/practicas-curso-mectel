var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);
var io=require('socket.io')(server);
var {SerialPort} = require('serialport');
var path=require('path');

var {ReadlineParser}=require('@serialport/parser-readline');

var serialport = new SerialPort(
	{ path: 'COM5', 
	baudRate: 9600 }
);

const parser=serialport.pipe(new ReadlineParser({delimiter: '\r\n' }))

app.engine('ejs', require('ejs').__express);
app.set('view engine', 'ejs');
//app.use(express.static(__dirname+'/public'));
app.use(express.static(path.join(__dirname, 'public'))); 
app.get('/',function(req,res){
	res.render("index")
});
 
serialport.on('open', function(){
	console.log('serial port opened');
 });

io.on('connection',function(socket){
	console.log('connection to client established');
	parser.on('data',function(data){
	//serialport.on('data',function(data){
		data= data.toString().trim();
		socket.emit('data',data);
	});
	socket.on('disconnect',function(){
		console.log('disconnected');
	});
	
});

server.listen(3000, function() {
 console.log('Listening on port 3000...');
});
