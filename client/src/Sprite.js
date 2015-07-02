function Sprite(texture_s, pos, tint, stage, scale) {
	var scope = this
	
	scope.texture = PIXI.Texture.fromImage(texture_s);
	scope.sprite  = new PIXI.Sprite(scope.texture);
	if (tint) {
		scope.sprite.color = tint;
		scope.sprite.tint = tint
	}
	if (pos === null) {
		scope.sprite.position.x = Math.random() * 800
		scope.sprite.position.y = Math.random() * 600
	}
	else {
		scope.sprite.position.x = pos.x
		scope.sprite.position.y = pos.y
	}
	scope.sprite.anchor.set(0.5, 0.5)
	if (stage) stage.addChild(scope.sprite)
	if (scale) scope.sprite.scale.x = scope.sprite.scale.y = scale
}

