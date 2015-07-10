function mouse_move(e) 
{
	mouse("move", e);
	
	if (!is_menu && game_type == "game")
		e.preventDefault();
	
}
function mouse_click(e) 
{
	mouse("click", e);
	if (!is_menu && game_type == "game")
		e.preventDefault();
}
function mouse_down(e) 
{
	mouse("down", e);
	
	if (!is_menu && game_type == "game")
		e.preventDefault();
}
function mouse_up(e) 
{
	mouse("up", e);
	
	if (!is_menu && game_type == "game")
		e.preventDefault();
}

function mouse(type, e)
{
	if (mouse_disable === false)
	{
		var e_x = e.pageX;
		var e_y = e.pageY;

		mouseX = e_x;
		mouseY = e_y;


		if (type == "down")
		{
			mouse_is_down = true;
			startX = mouseX;
			startY = mouseY;
			is_touch_end = false;
		}
		else if (type == "up")
			mouse_is_down = false;
		else if (type == "touch_end")
		{
			is_touch_end = true;
			mouse_is_down = false;
		}
			
		if (is_debug)
			document.getElementById('debug').innerHTML = 'X: ' + Math.round(mouseX, 0) + ' Y: ' + Math.round(mouseY, 0);
	}
}

function mouseWheel(e)
{
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	if (!is_menu)
	{
		if(delta > 0)
			camera.new_zoom += camera.new_zoom*0.1;
		else
			camera.new_zoom -= camera.new_zoom*0.1;
	}

}

function touch_moved(event)
{
	if (!is_menu && game_type == "game")
	{
		var touches = event.changedTouches;
		mouse("moved", touches[0]);
		event.preventDefault();
	}
}
function touch_end(event)
{
	if (!is_menu && game_type == "game")
	{
		var touches = event.changedTouches;
		mouse("touch_end", touches[0]);
		
		/*e = {};
		e.pageX = 0;
		e.pageY = 0;
		
		mouse("moved", e);*/
		
		event.preventDefault();
	}
}
function touch_start(event)
{
	if (!is_menu && game_type == "game")
	{
		var touches = event.changedTouches;
		mouse("down", touches[0]);
		event.preventDefault();
	}
}

function init_mouse()
{
	mouseX = 0;
	mouseY = 0;
	startX = 0;
	startY = 0;
	start_card = false;
	
	mouse_is_down = false;
	mouse_disable = false;
	is_touch_end = false;
	
	game_object.addEventListener("mousemove", mouse_move, false);
	game_object.addEventListener("mousedown", mouse_down, false);
	game_object.addEventListener("mouseup", mouse_up, false);
	game_object.addEventListener("click", mouse_click, false);
	game_object.addEventListener("wheel", mouseWheel, false);
	game_object.addEventListener("touchend", touch_end, false);
	game_object.addEventListener("touchstart", touch_start, false);
	game_object.addEventListener("touchmove", touch_moved, false);

}