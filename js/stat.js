function Stat(player_id, value)
{
	this.player_id = player_id;
	this.value = value;
	
	this.enable = false;
	for (var i = 0; i < players.length; i++)
	{
		if (players[i].multiplayer_id == this.player_id)
		{
			this.enable = true;
			this.player = players[i];
			break;
		}
	}
}

Stat.prototype.draw = function(width, font_size, drawY)
{
	main_ctx.textAlign = "left";
	main_ctx.textBaseline = "top";
	main_ctx.font = font_size.ratio(1,1) + "px Arial";
	
	main_ctx.fillStyle = "black";
	main_ctx.globalAlpha = 0.8;
	main_ctx.fillRect(game_width - width.ratio(0,1), drawY.ratio(0,1), width.ratio(0,1), font_size.ratio(1,1));
	main_ctx.globalAlpha = 1;
	main_ctx.fillStyle = "white";
					
	var name = this.player.text;
	main_ctx.fillText(name, game_width - (width - 10).ratio(0,1), drawY.ratio(1,1));
	
	main_ctx.textAlign = "right";
	main_ctx.fillText(this.value, game_width - (10).ratio(0,1), drawY.ratio(1,1));
}

function stat_compare(a,b) 
{
	if (a.value > b.value)
		return -1;
	else if (a.value < b.value)
		return 1;
	return 0;
}