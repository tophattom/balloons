document.addEventListener('DOMContentLoaded', function() {
	var canvas = document.getElementById('main-canvas'),
		ctx = canvas.getContext('2d'),

		width = window.innerWidth,
		height = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	var lastT = Date.now(),
		dt = 0;

	var drag = 1;

	var balloons = [];

	for (var i = 0; i < 150; i++) {
		var tmpX = Math.random() * width,
			tmpY = height + Math.random() * (height);

		balloons.push(new Balloon(tmpX, tmpY));	
	}
	

	var skyGradient = ctx.createLinearGradient(0, height, 0, 0);
	skyGradient.addColorStop(1, '#8ED6FF');
    skyGradient.addColorStop(0, '#004CB3');

	function run(t) {
		window.requestAnimationFrame(run);

		dt = (t - lastT) / 1000;
		lastT = t;

		if (dt < 0) {
			dt = 16 / 1000;
		}

		ctx.fillStyle = skyGradient;
		ctx.fillRect(0, 0, width, height);

		for (var i = 0; i < balloons.length; i++) {
			balloons[i].applyForce(new Vector(0, -50, 0));

			var tmp = new Vector(-500 + Math.random() * 1000, -15 + Math.random() * 30, 0);
			balloons[i].applyForce(tmp);
			balloons[i].update(dt, drag);

			if (balloons[i].pos.j < -20 || balloons[i].pos.i < -20 || balloons[i].pos.i > width) {
				var tmpX = Math.random() * width,
					tmpY = height + Math.random() * height;

				balloons[i].reset(tmpX, tmpY);
			}

			balloons[i].draw(ctx);

			
		}
	}

	window.requestAnimationFrame(run);
});