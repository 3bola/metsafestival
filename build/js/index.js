function DustParticle(){this.settings={ttl:16e3,max_speed:{x:2,y:1.5},max_radius:4.5,rt:1,origin:{x:960,y:540},random:!0,blink:!0}}function render(){canvas.width=WIDTH;for(var t=0;t<particles.length;t++)particles[t].fade(),particles[t].move(),particles[t].draw()}function animaItem(t){world||(world=a.world());var i=world.items.indexOf(t);return-1!==i?world.items[i]:world.add(t)}function cloudAnim(){var t="#cloud_"+clouds[curCloud],i=$(t).addClass("active").get(0),n=animaItem(i);n.animate({scale:[2.9,2.9],rotate:[0,0,-10],opacity:0,duration:0,delay:0}).animate([{translate:[2*$(window).width(),0,0],rotate:[0,0,20],scale:[2.9,2.9],duration:75e3,easing:"linear"},{opacity:.5,duration:5e3,easing:"linear"}]),curCloud+1>=clouds.length?curCloud=0:curCloud++}function startCloudAnimation(){animationStarted?(animationTimeout&&clearTimeout(animationTimeout),animationTimeout=setTimeout(function(){cloudAnim(),cloudAnimInt=setInterval(cloudAnim,6e4)},3e4)):(cloudAnim(),cloudAnimInt=setInterval(cloudAnim,6e4),animationStarted=!0)}var canvas,context,WIDTH,HEIGHT,interval=50,particles=[];DustParticle.prototype.reset=function(){this.x=this.settings.random?WIDTH*Math.random():this.settings.origin.x,this.y=this.settings.random?HEIGHT*Math.random():this.settings.origin.y,this.r=(this.settings.max_radius-1)*Math.random()+1,this.dx=Math.random()*this.settings.max_speed.x*(Math.random()<.5?-1:1),this.dy=Math.random()*this.settings.max_speed.y*(Math.random()<.5?-1:1),this.hl=this.settings.ttl/interval*(this.r/this.settings.max_radius),this.rt=Math.random()*this.hl,this.settings.rt=Math.random()+1,this.stop=.2*Math.random()+.4,this.settings.xdrift*=Math.random()*(Math.random()<.5?-1:1),this.settings.ydrift*=Math.random()*(Math.random()<.5?-1:1)},DustParticle.prototype.fade=function(){this.rt+=this.settings.rt},DustParticle.prototype.draw=function(){this.settings.blink&&(this.rt<=0||this.rt>=this.hl)?this.settings.rt=-1*this.settings.rt:this.rt>=this.hl&&this.reset();var t=1-this.rt/this.hl;context.beginPath(),context.arc(this.x,this.y,this.r,0,2*Math.PI,!0),context.closePath(),t=Math.round(100*t)/100;var i=this.r*t;g=context.createRadialGradient(this.x,this.y,0,this.x,this.y,0>=i?1:i),g.addColorStop(0,"rgba(255,255,255,"+t+")"),g.addColorStop(this.stop,"rgba(224,193,110,"+.3*t+")"),g.addColorStop(1,"rgba(224,193,110,0)"),context.fillStyle=g,context.fill()},DustParticle.prototype.move=function(){this.x+=this.rt/this.hl*this.dx,this.y+=this.rt/this.hl*this.dy,(this.x>WIDTH||this.x<0)&&(this.dx*=-1),(this.y>HEIGHT||this.y<0)&&(this.dy*=-1)},window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}();var resizeTimeout;$(window).on("resize",function(){clearTimeout(resizeTimeout),resizeTimeout=setTimeout(function(){console.log("redraw canvas"),WIDTH=$(window).width(),HEIGHT=$(window).height(),canvas.width=WIDTH,canvas.height=HEIGHT},250)}),$(document).ready(function(){WIDTH=$(window).width(),HEIGHT=$(window).height(),canvas=document.getElementById("dust"),canvas.width=WIDTH,canvas.height=HEIGHT,context=canvas.getContext("2d");for(var t,i=800>WIDTH?400:800,t=0;i>t;t++)particles[t]=new DustParticle,particles[t].reset();!function n(){requestAnimFrame(n),render()}()});var clouds=[1,2,3,4,5,6,7],curCloud=0,world=anima.world(),cloudAnimInt,animationStarted=!1,animationTimeout;$(window).focus(function(){startCloudAnimation()}).blur(function(){clearInterval(cloudAnimInt)}),startCloudAnimation();