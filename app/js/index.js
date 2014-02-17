/* Dust particles */

var canvas, context, WIDTH, HEIGHT, interval = 50, particles = [];

function DustParticle () {
  this.settings = { ttl: 16000, max_speed: { x: 2, y: 1.5 }, max_radius: 4.5, rt: 1, origin: { x: 960, y: 540 }, random: true, blink: true };
}

DustParticle.prototype.reset = function () {
  this.x = (this.settings.random ? WIDTH * Math.random() : this.settings.origin.x);
  this.y = (this.settings.random ? HEIGHT * Math.random() : this.settings.origin.y);
  this.r = ((this.settings.max_radius - 1) * Math.random()) + 1;
  this.dx = (Math.random() * this.settings.max_speed.x) * (Math.random() < .5 ? -1 : 1);
  this.dy = (Math.random() * this.settings.max_speed.y) * (Math.random() < .5 ? -1 : 1);
  this.hl = (this.settings.ttl / interval) * (this.r / this.settings.max_radius);
  this.rt = Math.random() * this.hl;
  this.settings.rt = Math.random() + 1;
  this.stop = Math.random() * .2 + .4;
  this.settings.xdrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
  this.settings.ydrift *= Math.random() * (Math.random() < .5 ? -1 : 1);
}

DustParticle.prototype.fade = function () {
  this.rt += this.settings.rt;
}

DustParticle.prototype.draw = function ()  {

  if(this.settings.blink && (this.rt <= 0 || this.rt >= this.hl)) {
    this.settings.rt = this.settings.rt * -1;
  } else if(this.rt >= this.hl) {
    this.reset();
  }

  var new_opacity = 1 - (this.rt / this.hl);

  context.beginPath();
  context.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
  context.closePath();

  new_opacity = Math.round(new_opacity * 100) / 100;

  var cr = this.r * new_opacity;
  g = context.createRadialGradient(this.x, this.y, 0, this.x, this.y, (cr <= 0 ? 1 : cr));
  
  g.addColorStop(0.0, 'rgba(255,255,255,' + new_opacity + ')');
  g.addColorStop(this.stop, 'rgba(224,193,110,' + (new_opacity * 0.3) + ')');
  g.addColorStop(1.0, 'rgba(224,193,110,0)');

  context.fillStyle = g;
  context.fill();
}

DustParticle.prototype.move = function () {
  this.x += (this.rt / this.hl) * this.dx;
  this.y += (this.rt / this.hl) * this.dy;
  if(this.x > WIDTH || this.x < 0) this.dx *= -1;
  if(this.y > HEIGHT || this.y < 0) this.dy *= -1;
}

function render () {
  canvas.width = WIDTH;
  for(var i = 0; i < particles.length; i++) {
    particles[i].fade();
    particles[i].move();
    particles[i].draw();
  }
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var resizeTimeout;
$(window).on('resize', function(){
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(function(){
    console.log('redraw canvas')
    WIDTH = $(window).width();
    HEIGHT = $(window).height();
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
  }, 250);
});

$(document).ready(function(){
  WIDTH = $(window).width();
  HEIGHT = $(window).height();
  
  canvas = document.getElementById('dust');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  context = canvas.getContext('2d');

  var i, amount = (WIDTH < 800 ? 400 : 800)
  
  for(var i = 0; i < amount; i++) {
    particles[i] = new DustParticle();
    particles[i].reset();
  }

  (function dustloop(){
    requestAnimFrame(dustloop);
    render();
  })();
});

// Cloud animations

var clouds = [1, 2, 3, 4, 5, 6, 7], curCloud = 0, world = anima.world();

function animaItem(el) {
  if (!world) world = a.world();
  var index = world.items.indexOf(el);
  return index !== -1 ? world.items[index] : world.add(el);
}

function cloudAnim() {

  var id = '#cloud_' + clouds[curCloud]
    , el = $(id).addClass('active').get(0)
    , item = animaItem(el);

  item.animate({
    scale: [2.9, 2.9],
    rotate: [0, 0, -10],
    opacity: 0,
    duration: 0,
    delay: 0
  }).animate([{
    translate: [$(window).width()*2, 0, 0],
    rotate: [0, 0, 20],
    scale: [2.9, 2.9],
    duration: 75000,
    easing: 'linear'
  }, {
    opacity: .6,
    duration: 5000,
    easing: 'linear'
  }]);
  
  if(curCloud + 1 >= clouds.length) curCloud = 0;
  else curCloud++;
}
var cloudAnimInt, animationStarted = false, animationTimeout;

function startCloudAnimation() {
  if(animationStarted) {
    if(animationTimeout) clearTimeout(animationTimeout);
    animationTimeout = setTimeout(function(){
      cloudAnim();
      cloudAnimInt = setInterval(cloudAnim, 60000);
    }, 30000);
  } else {
    cloudAnim();
    cloudAnimInt = setInterval(cloudAnim, 60000);
    animationStarted = true;
  }
}
$(window).focus(function(){
  startCloudAnimation();
}).blur(function(){
  clearInterval(cloudAnimInt);
});

startCloudAnimation();



