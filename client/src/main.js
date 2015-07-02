var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)

var renderer = new PIXI.WebGLRenderer(800, 600);
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
	

var bunny = new Sprite('bunny.png', null, 
					  Math.random()*0xFFFFFF + 0xFF000000, stage, null)
global.bunny = bunny.sprite
bunny = bunny.sprite

var otherBunnies = {}
var carrots= {}
var keyboard = new KeyboardJS()

animate();

function animate() {
    requestAnimationFrame(animate);
    
    if(keyboard.char('W')) bunny.position.y -= 10;
    if(keyboard.char('S')) bunny.position.y += 10;
    if(keyboard.char('D')) bunny.position.x += 10;
    if(keyboard.char('A')) bunny.position.x -= 10;
    socket.emit('update_position', bunny.position, bunny.color)
    
    renderer.render(stage);
}

socket.on('update_position', function (pos, color) {
	var sprite = otherBunnies[pos.id]
	if (!sprite) {
		otherBunnies[pos.id] = new Sprite('bunny.png', pos, color, stage, null).sprite
	}
	else {
		sprite.position.x = pos.x
		sprite.position.y = pos.y
	}
})

socket.on('connect', function () {
	console.log('connected')
	socket.emit('update_position', bunny.position, bunny.color)
})

socket.on('user_disconnect', function(id) {
	if(otherBunnies[id]) {
		stage.removeChild(otherBunnies[id])
		delete otherBunnies[id]
	}
})

socket.on('pickup_carrot', function(carrotId) {
	if(carrots[carrotId]) {
		stage.removeChild(carrots[carrotId])
		delete carrots[carrotId]
	}
})

socket.on('carrot', function(pos, carrotId) {
	var carrot = carrots[carrotId]
	if (!carrot) {
		carrots[carrotId] = new Sprite('carrot.png', pos, null, stage, 0.1).sprite
	}
	
})
