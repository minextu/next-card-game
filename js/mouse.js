function mouse_move(e) {mouse("move", e);}
function mouse_click(e) {mouse("click", e);}
function mouse_down(e) {mouse("down", e);}
function mouse_up(e) {mouse("up", e);}

function mouse(type, e)
{
	if (mouse_disable === false)
	{
		var e_x = e.pageX;
		var e_y = e.pageY;

		mouseX = e_x / (1).ratio(0); 
		mouseY = e_y / (1).ratio(1);


		if (type == "down")
			mouse_is_down = true;
		else if (type == "up")
			mouse_is_down = false;

		if (!is_menu && game_type == "editor")
			editor_mouse(mouseX, mouseY, type);
			
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

function init_mouse()
{
	mouseX = 0;
	mouseY = 0;
	mouse_is_down = false;
	mouse_disable = false;
	
	document.addEventListener("mousemove", mouse_move, false);
	document.addEventListener("mousedown", mouse_down, false);
	document.addEventListener("mouseup", mouse_up, false);
	document.addEventListener("click", mouse_click, false);
	document.addEventListener("wheel", mouseWheel, false);
}