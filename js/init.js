function init()
{
	original_width = 1920;
	original_height = 1080;
	
	game_width = window.innerWidth;
	game_height = window.innerHeight;
  
	Number.prototype.ratio = function(l, ll)
	{
		if (l == 0)
		{
			n = Number(this) / original_height * game_height;
			if (ll != true)
				n = Number(this) / original_height * game_height + game_width / 2;
		}
		else
			n = Number(this) / original_height * game_height;
		
			
		return n;
	};
	Number.prototype.speed = function()
	{
		n = Number(this) / fps * 60;
		return n;
	};
  
	document.getElementById("game_object").innerHTML = "<canvas width='" + game_width + "' height= '" + game_height + 
		"' id='bg_canvas' style='background: gray;'></canvas>" + 
		"<canvas width='" + game_width + "' height= '" + game_height + 
		"' id='main_canvas'>Dein Browser ist zu alt, um dass Spiel zu starten.</canvas><span" +
		" style='bottom: 0px; position: fixed; margin-left: 50px; font-size: " + (15).ratio(1) + "px' id='debug'></span>";
	
	main_canvas = document.getElementById("main_canvas");
	main_ctx = main_canvas.getContext('2d');
  	bg_canvas = document.getElementById("bg_canvas");
	bg_ctx = bg_canvas.getContext('2d');
	
	requestaframe = (function(){
		return  window.requestAnimationFrame       || 
				window.webkitRequestAnimationFrame || 
				window.mozRequestAnimationFrame    || 
				window.oRequestAnimationFrame      || 
				window.msRequestAnimationFrame     || 
				function( callback ){
					window.setTimeout(callback, 1000 / 60);
				};
	})();
	cancelaframe = (function(){
		return  window.cancelAnimationFrame       || 
				window.webkitCancelAnimationFrame || 
				window.mozCancelAnimationFrame    || 
				window.oCancelAnimationFrame      || 
				window.msCancelAnimationFrame     || 
				function( cancel ){
					window.clearTimeout(cancel);
				};
	})();
  
	loop_timeout = undefined;
	is_playing = false;
	is_menu = true;
	old_is_menu = false;
	game_type = "menu";
	old_game_type = game_type;
	is_debug = true;
  
	init_mouse();
	load_media();
	start_loop();
}

init(); 
