var serverURL = 'localhost:9000'
var socket = require('socket.io-client')(serverURL)

var renderer = new PIXI.WebGLRenderer(800, 600);

document.body.appendChild(renderer.view);

var stage = new PIXI.Container();

var bunnyTexture = PIXI.Texture.fromImage('bunny.png');
var bunny = new PIXI.Sprite(bunnyTexture);
global.bunny = bunny
var otherBunnies = {}

bunny.position.x = Math.random() * 800
bunny.position.y = Math.random() * 600
bunny.anchor.set(0.5, 0.5)
bunny.color = Math.random()*0xFFFFFF + 0xFF000000
bunny.tint = bunny.color
stage.addChild(bunny);

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
    sprite = new PIXI.Sprite(bunnyTexture)
    stage.addChild(sprite)
    otherBunnies[pos.id] = sprite
    sprite.anchor.set(0.5, 0.5)
    sprite.tint = color
  }
  sprite.position.x = pos.x
  sprite.position.y = pos.y
})

socket.on('connect', function () {
  console.log('connected')
  socket.emit('update_position', bunny.position, bunny.color)
})

socket.on('user_disconnect', function(id) {
  stage.removeChild(otherBunnies[id])
})

function KeyboardJS () {
  this.keys = [];
  this.char = function(x) { return this.keys[x.charCodeAt(0)]; }
  var scope = this;
  document.addEventListener("keydown", function (evt) {
  scope.keys[evt.keyCode] = true;
  });
  document.addEventListener("keyup", function (evt) {
  scope.keys[evt.keyCode] = false;
  });
}