function key_down(e)
{
	var key_id = e.keyCode || e.which;
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

}
document.addEventListener("keydown", key_down, false);
document.addEventListener("keyup", key_up, false);
