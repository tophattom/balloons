var Balloon = function(x, y) {
	var colorArray = [
		'#FF0000',
		'#00FF00',
		'#0000FF',
		'#FFFF00',
		'#00FFFF',
		'#FF00FF'
	];

	this.pos = new Vector(x, y, 0);
	
	this.vel = new Vector(0, 0, 0);
	this.acc = new Vector(0, 0, 0);

	this.dir = this.vel.clone().normalize();

	this.mass = 1 + Math.random() * 2;

	this.color = colorArray[parseInt(Math.random() * (colorArray.length), 10)];
};


Balloon.drawBalloon = function(ctx, x, y, angle, scale) {
	ctx.save();

	ctx.translate(x, y);
	ctx.rotate(angle);

	//Balloon itself
	ctx.beginPath();

	ctx.moveTo(-20 * scale, 0);
	ctx.quadraticCurveTo(-20 * scale, -20 * scale, 0, -20 * scale);
	ctx.quadraticCurveTo(20 * scale, -20 * scale, 20 * scale, 0);

	ctx.quadraticCurveTo(20 * scale, 20 * scale, 0, 30 * scale);
	ctx.quadraticCurveTo(-20 * scale, 20 * scale, -20 * scale, 0);

	ctx.closePath();

	ctx.fill();

	ctx.strokeStyle = '#000000';
	ctx.strokeWidth = 3;
	ctx.stroke();


	//String
	ctx.rotate(-angle);
	ctx.beginPath();

	var startX = 30 * scale * Math.sin(-angle),
		startY = 30 * scale * Math.cos(-angle),

		dir = angle < 0 ? -1 : 1;

	ctx.moveTo(startX, startY);
	ctx.bezierCurveTo(startX - 20 * dir, startY + 20 * scale, startX + 20 * dir, startY + 30 * scale, startX, startY + 50 * scale);

	// ctx.closePath();

	ctx.stroke();
	ctx.closePath();

	ctx.restore();
};

Balloon.prototype.reset = function(x, y) {
	this.pos.set(x, y, 0);
	this.vel.set(0, 0, 0);
	this.acc.set(0, 0, 0);

	this.mass = 1 + Math.random() * 2;
};

Balloon.prototype.draw = function(ctx) {
	var gradient = ctx.createRadialGradient(this.pos.i + 10, this.pos.j + 10, 0, this.pos.i + 10, this.pos.j + 10, 20);
	gradient.addColorStop(0, shadeColor2(this.color, 0.6));
	gradient.addColorStop(1, this.color);

	ctx.fillStyle = gradient;

	var angle = -Vector.angle(this.dir, new Vector(1, 0, 0)) + Math.PI / 2,
		scale = 1 + this.mass / 6;

	Balloon.drawBalloon(ctx, this.pos.i, this.pos.j, angle, scale);
};

Balloon.prototype.applyForce = function(force) {
	this.acc.add(force.div(this.mass));
};

Balloon.prototype.update = function(dt, drag) {
	this.vel.add(this.acc.mul(dt));
	
	this.dir = this.vel.clone().normalize();

	this.pos.add(this.vel.clone().mul(dt));

	this.acc.set(0, 0, 0);
	this.dir = this.vel.clone().normalize();
};

//http://stackoverflow.com/a/13542669/3466050
function shadeColor2(color, percent) {   
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}