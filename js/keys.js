 is_leftkey = false;
 is_rightkey = false;
 is_upkey = false;
 is_downkey = false;
 is_spacebar = false;
 
function key_down(e)
{
	var key_id = e.keyCode || e.which;
	if (key_id == 40 || key_id == 83) //down key or s key
	{
		is_downkey = true;
		e.preventDefault();
	}
	if (key_id == 38 || key_id == 87) //up key or w key
	{
		is_upkey = true;
		e.preventDefault();
	}
	if (key_id == 37 || key_id == 65) //left key or a key
	{
	 	is_leftkey = true;
	 	e.preventDefault();
	}
	if (key_id == 39|| key_id == 68) //right key or d key
	{
		is_rightkey = true;
		e.preventDefault();
	}
	if (key_id == 32) //spacebar
	{
	 	is_spacebar = true;
	 	e.preventDefault();
	}
	if (key_id == 27 || key_id == 80) //esc or p key_down
	{
		if (game_type != "menu")
		{
			if (is_menu)
				is_menu = false;
			else
			{
				is_menu = true;
				menu_place = 'pause';
			}
		}
	}
}

function key_up(e)
{
	var key_id = e.keyCode || e.which;
	if (key_id == 40 || key_id == 83) //down key or s key
	{
		is_downkey = false;
		e.preventDefault();
	}
	if (key_id == 38 || key_id == 87) //up key or w key
	{
		is_upkey = false;
		e.preventDefault();
	}
	if (key_id == 37 || key_id == 65) //left key or a key
	{
		is_leftkey = false;
		e.preventDefault();
	}
	if (key_id == 39|| key_id == 68) //right key or d key
	{
		is_rightkey = false;
		e.preventDefault();
	}
	if (key_id == 32) //spacebar
	{
	 	is_spacebar = false;
	 	e.preventDefault();
	}
}
document.addEventListener("keydown", key_down, false);
document.addEventListener("keyup", key_up, false);
