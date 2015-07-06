menu_nav =document.getElementById("main-menu");
menu_ul = document.getElementById("main-menu").childNodes[1];

function show_hide_menu(type)
{
	if (type != "hide")
	{
		bg_canvas.style.background = "url('css/images/menu_background.png')";
		main_canvas.style.background = "none";
		menu_nav.style.visibility = "visible";
		console.debug("show menu");
	}
	else
		menu_nav.style.visibility = "hidden";
}

try{gui = require('nw.gui');}catch(e){}
menu_place = "main";
old_menu_place = menu_place;
old_buttons = "";

function menu()
{
	if (old_menu_place == menu_place)
	{
		is_error = false;
		switch (menu_place)
		{
			case "main":
				menu_buttons = {};
				menu_buttons["Spiel starten"] = 'menu_place = "start_game";';
				menu_buttons["Optionen"] = "";
				menu_buttons["Credits"] = "";
				menu_buttons["Beenden"] = 'try { gui.App.quit(); } catch(e) { alert("Du spielst in einem Browser, schließ den Tab einfach :D"); }';
				break;
			case "start_game":
				menu_buttons = {};
				menu_buttons["Fortsetzen"] = "";
				menu_buttons["Neues Spiel"] = "new_game();";
				menu_buttons["Editor"] = "start_editor();";
				menu_buttons["Zur&uuml;ck"] = 'menu_place = "main";';
				break;
			default:
				menu_buttons ={};
				menu_buttons["Fehler"] = "";
				menu_buttons["Zur&uuml;ck zum Hauptmen&uuml;"] = 'menu_place = "main";';
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
				buttons += 'alert("Noch nicht vorhanden...")';
		
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