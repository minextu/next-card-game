function start_loop()
{
	is_playing = true;
	loop();
	new_game(0);
	is_menu = true;
}
function stop_loop()
{
	is_playing = false;
	cancelaframe(loop_timeout);
}

var last_loop = new Date();
var fps_array = new Array();
var fps_array_length = 5;
var this_fps_entry = 0;
var loop_num = 0;
var fps = "?";
var this_fps = 60;
var redraw_canvas = false;

function loop()
{
	is_hover = true;
	
	buttons_num = 0;
	main_ctx.clearRect(0,0,game_width,game_height);
	
	if (loop_num / 12 == Math.round(loop_num / 12))
	{
		/* Update Width, Height */
		if (window.innerHeight != game_height || window.innerWidth != game_width)
		{
		  game_width = window.innerWidth;
		  game_height = window.innerHeight;
		  
		  main_canvas.width = game_width;
		  main_canvas.height = game_height;
		  bg_canvas.width = game_width;
		  bg_canvas.height = game_height;
		  
		  redraw_canvas = true;
		}
  }
  
	check_changes();
	
	/*Loop function*/
	if (is_menu)
	{
		if (typeof game_finished != "undefined" && game_type != "multiplayer_table")
			game();
		menu();
	}
	else
	{
		switch (game_type)
		{
			case "game":
				game();
				break;
			case "multiplayer_table":
				break;
			case "multiplayer_new_room":
				break;
			default:
				console.error("Unknown Gamemode!");
				break;
		}
	}
	
	if (is_touch_end)
	{
		mouseX = 0;
		mouseY = 0;
		is_touch_end = false;
	}
	
	/*FPS*/
	var this_loop = new Date();
	this_fps = 1000 / (this_loop - last_loop);
	last_loop = this_loop;
	fps_array[this_fps_entry] = this_fps;
	this_fps_entry++;
	if (this_fps_entry > fps_array_length)
		this_fps_entry = 0;
	
	if (loop_num / 12 == Math.round(loop_num / 12))
	{
		fps = 0;
		for (var i = 0; i < fps_array.length; i++)
		{
			fps += fps_array[i];
		}
		fps = Math.round(fps / fps_array.length * 10) / 10;
	}
	main_ctx.fillStyle = "#FFF";
	main_ctx.font = (30).ratio(1) + "px Arial"
	main_ctx.textBaseline = "bottom";
	main_ctx.textAlign = "left";
	main_ctx.fillText("FPS: " + fps, 0, game_height);
	
	/* END */
	loop_num++;
	if (is_playing)
	{
		//window.setTimeout(loop, 1000 / 10)
		requestaframe(loop);
	}
}

function check_changes()
{
	if (is_menu != old_is_menu)
	{
		if (!is_menu)
			show_hide_menu("hide");
		else
			show_hide_menu("true");
		
		if (!is_menu && !is_multiplayer && game_type == "game")
			show_hide_options("true");
		else
			show_hide_options("hide");
	}
	if (old_game_type != game_type)
	{
		if (game_type == "multiplayer_table")
			show_hide_multiplayer_table("true");
		else
			show_hide_multiplayer_table("hide");
		
		if (game_type == "multiplayer_new_room")
			show_hide_multiplayer_new_room("true");
		else
			show_hide_multiplayer_new_room("hide");
		
		if (!is_menu && (game_type == "game" && !is_multiplayer || game_type == "multiplayer_new_room"))
			show_hide_options("true");
		else
			show_hide_options("hide");
	}
		
	
	old_is_menu = is_menu;
	old_game_type = game_type;
}