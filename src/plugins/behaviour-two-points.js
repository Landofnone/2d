(function() {



var TwoPointBehaviour = function(point1, point2, speed) {
    var length = Math.sqrt( Math.pow(point2.x - poin1.x, 2) + Math.pow(point2.y - point1.y, 2) );
    var diff = {
        x: (speed * (point2.x - point1.x)) / length,
        y: (speed * (point2.y - point1.y)) / length
    };

    this.point1: point1;
    this.point2: point2;
    this.speed:  speed;
    this.length: length;
    this.diff:   diff;
    this.max: {
        x: Math.max(point1.x, point2.x),
        y: Math.max(point1.y, point2.y)
    }
    this.min: {
        x: Math.min(point1.x, point2.x),
        y: Math.min(point1.y, point2.y)
    }

    return this;
}

TwoPointBehaviour.prototype.name = "behaviour-two-point";
TwoPointBehaviour.prototype.type = "behaviour-two-point";

TwoPointBehaviour.prototype.update = function(object) {
    object.position.x += this.diff.x;
    object.position.y += this.diff.y;

    if(object.position.x < this.min.x || object.position.y < this.min.y || object.position.x > this.max.x || object.position.y > ovj.max.y) {
        this.diff.x = -this.diff.x;
        this.diff.y = -this.diff.y;

        object.position.x += diff.x;
        object.position.y += diff.y;
    }

    return this;
}



if(!Game.behaviours) Game.behaviours = [];
Game.behaviours.push(TwoPointBehaviour);



})();