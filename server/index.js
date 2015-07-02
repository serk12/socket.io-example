var port = process.env.PORT || 9000
var io = require('socket.io')(port)
var players = {}
var carrots = {}
make_carrots(carrots)
io.on('connection', function (socket) {
	socket.broadcast.emit('hi')
	console.log('connection', socket.id)
	
	for (var playerId in players) {
		var playerInfo = players[playerId]
		socket.emit('update_position', playerInfo.pos, playerInfo.color, playerInfo.score, playerInfo.name)
	}
	
	for (var carrotId in carrots) {
		var carrotsInfo = carrots[carrotId]
		socket.emit('carrot', carrotsInfo, carrotId)
	}
	
	socket.on('disconnect', function () {
		console.log('disconnection', socket.id)
		socket.broadcast.emit('user_disconnect', socket.id)
		delete players[socket.id]
	})
	
	socket.on('update_position', function (pos, color, score, name) {
		pos.id = socket.id
		if (players[socket.id]) {
			players[socket.id].pos   = pos
			players[socket.id].color = color
			players[socket.id].score = score
			players[socket.id].name  = name
		}
		else {
			players[socket.id] = new info(pos, color, score, name)
		}
		for (var carrotId in carrots) {
			if (collision(pos,carrots[carrotId])) {
				io.sockets.emit('pickup_carrot', carrotId, socket.id)
				delete carrots[carrotId]
				--carrots.size;
				if (!carrots.size) {
					make_carrots(carrots);
					console.log('more carrots')
					for (var carrotId in carrots) {
						var carrotsInfo = carrots[carrotId]
						io.sockets.emit('carrot', carrotsInfo, carrotId)
					}
				}
			}
		}
	})
})

setInterval(function() {
  	for (var playerId in players) {
		var playerInfo = players[playerId]
		io.sockets.emit('update_position', playerInfo.pos, playerInfo.color, playerInfo.score, playerInfo.name)
	}
}, 50)

function info(pos, color, score, name) {
	this.color = color
	this.pos   = pos
	this.score = score
	this.name  = name
}

function pos(x,y) {
	this.x = x
	this.y = y
}

function make_carrots(carrots) {
	carrots.size = 25
	for (var i = 0; i < 25; ++i) 
		carrots[i] = new pos(Math.random() * 800, Math.random() * 600)
}

function collision(bunny, carrot) {
  var dist_x = bunny.x - carrot.x
  var dist_y = bunny.y - carrot.y
  var sum_rad = 128/2 + 0.1*256/2
  return (dist_x*dist_x + dist_y*dist_y) < sum_rad*sum_rad
}
console.log('server started on port', port)
