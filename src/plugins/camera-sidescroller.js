var Camera;

(function () {



Camera = function(options) {
    if(!options) options = {};

    this.x = options.x || 0;
    this.y = options.y || 0;
    this.static = !!options.static;
    return this;
}

Camera.prototype.name = "camera-sidescroller";
Camera.prototype.type = "Camera";

Camera.prototype.Init = function(game) {
    this.game   = game;
    this.offset = {
        x: 0,
        y: 0
    }

    return this;
}

Camera.prototype.Update = function(game) {
    if(!this.static) {
        var player = game.Categories.Player;
        this.x = player.x - ((game.width/2)  - (player.width/2))  + this.offset.x;
        this.y = player.y - ((game.height/2) - (player.height/2)) + this.offset.y;
    }

    return this;
}

Camera.prototype.translate = function(vector) {
    if(this.static) {
        this.x += vector.x;
        this.y += vector.y;
    }
    else {
        this.offset.x += vector.x;
        this.offset.y += vector.y;
        // (x,y) will be updated on next Update
    }

    return this;
}

Camera.prototype.moveTo = function(vector) {
    this.static = true;
    this.x = vector.x;
    this.y = vector.y;

    return this;
}

Camera.prototype.followPlayer = function() {
    var player = this.game.Categories.Player;

    this.static = false;
    this.offset.x = (player.x - this.x) - ((this.game.width/2)  - (player.width/2));
    this.offset.y = (player.y - this.y) - ((this.game.height/2) - (player.height/2));
    // (x,y) will be updated on next Update

    return this;
}

Camera.prototype.unFollowPlayer = function() {
    var player = this.game.Categories.Player;

    this.static = true;
    this.x += offset.x;
    this.y += offset.y;
    this.offset.x = 0;
    this.offset.y = 0;

    return this;
}



})()