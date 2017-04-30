menu_nav =document.getElementById("main-menu");
menu_ul = document.getElementById("main-menu").childNodes[1];

function show_hide_menu(type)
{
	if (type != "hide")
	{
		main_canvas.style.background = "none";
		menu_nav.style.visibility = "visible";
		menu_nav.style.display = "block";
		console.debug("show menu");
	}
	else
	{
		menu_nav.style.visibility = "hidden";
		menu_nav.style.display = "none";
	}
}

try{gui = require('nw.gui');}catch(e){}
menu_place = "main";
old_menu_place = menu_place;
old_buttons = "";

function menu()
{
	main_ctx.drawImage(background_image, 0, 0, game_width, game_height);
	if (old_menu_place == menu_place)
	{
		is_error = false;
		switch (menu_place)
		{
			case "main":
				menu_buttons = {};
				menu_buttons["Singleplayer"] = 'menu_place = "singleplayer";';
				menu_buttons["Multiplayer"] = 'is_menu = false; game_type = "multiplayer_table"';
				menu_buttons["Options"] = "";
				menu_buttons["Credits"] = "";
				menu_buttons["Exit"] = 'try { gui.App.quit(); } catch(e) { alert("You are playing in a Browser. Just close the tab ;)"); }';
				break;
			case "singleplayer":
				menu_buttons = {};
				menu_buttons["1 Enemy"] = 'new_game(1)';
				menu_buttons["2 Enemies"] = 'new_game(2)';
				menu_buttons["3 Enemies"] = 'new_game(3)';
				menu_buttons["4 Enemies"] = 'new_game(4)';
				menu_buttons["5 Enemies"] = 'new_game(5)';
				menu_buttons["6 Enemies"] = 'new_game(6)';
				menu_buttons["Back"] = 'menu_place = "main";';
				break;
			case "pause":
				menu_buttons = {};
				menu_buttons["Return"] = 'is_menu = false;';
				menu_buttons["Back to mainmenu"] = 'menu_place = "main";';
				break;
			default:
				menu_buttons ={};
				menu_buttons["Error"] = "";
				menu_buttons["Back to mainmenu"] = 'menu_place = "main";';
				is_error = true;
				break;
		}

		buttons = "";
		for (var index in menu_buttons)
		{
			buttons += "<li><a href='JavaScript:void(0)' onclick='";
		
			if (menu_buttons[index] != "")
				buttons += menu_buttons[index];
			else
				buttons += 'alert("In Development...")';
		
			buttons += "'>" + index + "</a></li>";
		}
		if (old_buttons != buttons)
			menu_ul.innerHTML = buttons;
		
		old_buttons = buttons;
	}
	else 
		anim_menu();
}

default_menu_anim = 10;
menu_anim = default_menu_anim;
function anim_menu()
{
	if (menu_anim == default_menu_anim)
	{
		menu_ul.style.opacity = "0";
		menu_anim = menu_anim - (1).speed();
	}
	else
		menu_anim = menu_anim - (1).speed();
	if (menu_anim <= 0)
	{
		old_menu_place = menu_place;
		menu_anim = default_menu_anim;
		menu_ul.style.opacity = "1";
	}
}
