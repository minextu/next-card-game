function Player(drawX, drawY, show_cards, card_pos, no_cards, key)
{
	this.drawX = drawX;
	this.drawY = drawY;
	this.width = 100
	this.height = 100;
	this.key = key;
	this.text = "";
	this.selected_cards = 0;
	this.win_cards = false;
	this.skip_timeout = false;
	this.disabled = false;
	this.updated_cards = false;
	
	this.show_cards = show_cards;
	

	this.card_pos = card_pos;
	
	if (this.card_pos == "left")
		this.rotate = 0;
	else if (this.card_pos == "right")
		this.rotate = 180;
	else if (this.card_pos == "bottom")
		this.rotate = -90;
	else
		this.rotate = 90;
		
	this.cards = [];
	
	if (this.key != 0)
		this.enable_ai = true;
	else
		this.enable_ai = false;
	
	this.enable_multiplayer = false;
	
	this.played_card = false;
	this.skipped = false;
}

Player.prototype.draw = function()
{	
	if (player_turn == this.key && can_play && game_finished == false && !is_giving)
	{
		if (this.enable_ai)
			this.ai();
		else if (this.enable_multiplayer == true)
			this.check_multiplayer();
	}
	
	main_ctx.save();
	main_ctx.translate(this.drawX.ratio(0) + (this.width/2).ratio(0,1), this.drawY.ratio(1) + (this.height/2).ratio(1,1));
	main_ctx.rotate(this.rotate*Math.PI / 180);
	main_ctx.drawImage(player_image, 0,0,this.width,this.height,(-this.width / 2).ratio(0,1), (-this.height / 2).ratio(1,1), (this.width).ratio(0,1), (this.height).ratio(1,1))
	main_ctx.restore();
	
	if (this.text != "")
	{
		var font_size = 30;

		var drawX = this.drawX + this.width / 2;
		main_ctx.textAlign = "center";

		if (this.card_pos == "bottom")
		{
			var drawY = this.drawY - font_size;
			var rectY = this.drawY - 2*font_size;
			main_ctx.textBaseline = "bottom";
		}
		else if (this.card_pos == "top" || this.card_pos == "left" || this.card_pos == "right")
		{
			var drawY = this.drawY + this.height;
			var rectY = this.drawY + this.height
			main_ctx.textBaseline = "top";
		}
		var rectWidth = 200;
		var rectX = this.drawX.ratio(0) + (this.width / 2 - rectWidth / 2).ratio(0,1);
		
		main_ctx.fillStyle = "black";
		main_ctx.globalAlpha = 0.5;
		main_ctx.fillRect(rectX, rectY.ratio(1), rectWidth.ratio(0,1), font_size.ratio(0,1));
		main_ctx.globalAlpha = 1;
		
		main_ctx.fillStyle = "white";
		main_ctx.font = (font_size).ratio(0,1) + "px Arial";
		main_ctx.fillText(this.text, drawX.ratio(0), (drawY).ratio(1));
	}
	
	if (this.win_cards !== false)
	{
		if (this.win_cards == 2)
			var text = "Big Winner";
		else if (this.win_cards == 1)
			var text = "Small Winner";
		else if (this.win_cards == 0)
			var text = "Neutral";
		else if (this.win_cards == -1)
			var text = "Small Loser";
		else if (this.win_cards == -2)
			var text = "Big Loser";
		else
			var text = "Unknown!";
		
		var font_size = 30;

		var drawX = this.drawX + this.width / 2;
		main_ctx.textAlign = "center";

		if (this.card_pos == "bottom")
		{
			var drawY = this.drawY;
			var rectY = this.drawY - font_size;
			main_ctx.textBaseline = "bottom";
		}
		else if (this.card_pos == "top" || this.card_pos == "left" || this.card_pos == "right")
		{
			var drawY = this.drawY + this.height + font_size;
			var rectY = this.drawY + this.height + font_size
			main_ctx.textBaseline = "top";
		}
		var rectWidth = 200;
		var rectX = this.drawX.ratio(0) + (this.width / 2 - rectWidth / 2).ratio(0,1);
		
		main_ctx.fillStyle = "black";
		main_ctx.globalAlpha = 0.5;
		main_ctx.fillRect(rectX, rectY.ratio(1), rectWidth.ratio(0,1), font_size.ratio(0,1));
		main_ctx.globalAlpha = 1;
		
		main_ctx.fillStyle = "lightblue";
		main_ctx.font = (font_size).ratio(0,1) + "px Arial";
		main_ctx.fillText(text, drawX.ratio(0), (drawY).ratio(1));
	}
	
	if (player_turn == this.key && can_play)
		main_ctx.drawImage(arrow_image, this.drawX.ratio(0) + (this.width / 2 - 50 / 2).ratio(0,1), this.drawY.ratio(1), (50).ratio(0,1), (50).ratio(1,1));
	if ((!game_finished && player_turn == this.key && can_play) && (!this.enable_ai && is_multiplayer || !is_multiplayer && table_cards.length != 0 && table_cards[table_cards.length-1].done != true && this.key == 0))
	{
		var skipWidth = 30;
		var skipHeight = 30;
		var skipX = this.drawX + this.width / 2 - skipWidth / 2;
		var skipY = this.drawY + this.height / 2;
		
		var skipRectX = this.drawX;
		var skipRectY = skipY;
		var skipRectWidth = this.width;
		var skipRectHeight = skipHeight;
		
		main_ctx.globalAlpha = 0.5;
		main_ctx.fillStyle = "white";
		main_ctx.fillRect(skipRectX.ratio(0), skipRectY.ratio(1), skipRectWidth.ratio(0,1), skipRectHeight.ratio(1,1));
		main_ctx.globalAlpha = 1;
		
		if (this.skip_timeout !== false && !this.disabled)
		{
			var skip_time =3*6000;
			var target_skip = this.skip_timeout + skip_time;
			skip_diff = target_skip - (new Date().getTime());
			var skipProgressWidth = skipRectWidth - skipRectWidth /  skip_time * skip_diff;
		
			main_ctx.globalAlpha = 0.9;
			main_ctx.fillStyle = "red";
			main_ctx.fillRect(skipRectX.ratio(0), skipRectY.ratio(1), skipProgressWidth.ratio(0,1), skipRectHeight.ratio(1,1));
			main_ctx.globalAlpha = 1;
			
			if (skip_diff <= 0 && this.key == 0 && !this.enable_multiplayer && !this.enable_ai)
			{
				if (table_cards.length != 0 && table_cards[table_cards.length-1].done != true && this.key == 0)
				{
					skipped_players[skipped_players.length] = this.key;
						
					if (is_multiplayer && this.key == 0 && this.enable_multiplayer == false)
						multiplayer_played_cards[multiplayer_played_cards.length] = "skip";
				}
				else
					this.cards[this.cards.length-1].play();
				
				this.skip_timeout = false;
			}
		}
		
		if (table_cards.length != 0 && table_cards[table_cards.length-1].done != true && this.key == 0 && !this.enable_multiplayer && !this.enable_ai)
		{
			table_cards.length != 0 && table_cards[table_cards.length-1].done != true
			if (!mouse_is_down && !is_touch_end && mouseX >= skipRectX.ratio(0) && mouseX <= skipRectX.ratio(0) + skipRectWidth.ratio(0,1) && mouseY >= skipRectY.ratio(1) && mouseY <= skipRectY.ratio(1) + skipRectHeight.ratio(1,1) || startX >= skipRectX.ratio(0) && startX <= skipRectX.ratio(0) + skipRectWidth.ratio(0,1) && startY >= skipRectY.ratio(1) && startY <= skipRectY.ratio(1) + skipRectHeight.ratio(1,1))
			{
				main_ctx.globalAlpha = 0.5;
				main_ctx.fillStyle = "blue";
				main_ctx.fillRect(skipRectX.ratio(0), skipRectY.ratio(1), skipRectWidth.ratio(0,1), skipRectHeight.ratio(1,1));
				main_ctx.globalAlpha = 1;
				
				if (mouse_is_down || is_touch_end)
				{
					skipped_players[skipped_players.length] = this.key;
					
					if (is_multiplayer && this.key == 0 && this.enable_multiplayer == false)
						multiplayer_played_cards[multiplayer_played_cards.length] = "skip";
					
					mouse_is_down = false;
					is_touch = false;
					is_touch_end = false;
				}
			}
			
			main_ctx.drawImage(skip_image, (skipX).ratio(0), (skipY).ratio(1), (skipWidth).ratio(0,1),(skipHeight).ratio(1,1));
		}
	}
	
	
	if (this.updated_cards)
	{
		this.updated_cards = false;
		this.update_cards();
	}
	
	for (var i = this.cards.length-1; i >= 0; i--)
	{
		this.cards[i].check_play();
	}
	
	for (var i = 0; i < this.cards.length; i++)
	{
		this.cards[i].draw();
	}
};

Player.prototype.update_cards = function()
{
	for (var i = 0; i < this.cards.length; i++)
	{
		if (this.cards[i].disabled === true)
		{
			this.cards.splice(i, 1);
			i = -1;
			continue;
		}
	}
	
	if (this.enable_ai)
		this.cards.sort(compare_card_ai);
	else
		this.cards.sort(compare_card);
	
	var card_num = this.cards.length;
	
	for (var i = 0; i < this.cards.length; i++)
	{
		var test_card = this.cards[i];
		
		if (this.card_pos == "top" || this.card_pos == "bottom")
		{
			if (this.show_cards)
			{
				if ((this.cards.length*(test_card.width / 2)).ratio(0,1) > game_width)
					var drawX = this.drawX - (card_num*(test_card.width / 3)) / 2 + (test_card.width / 3)*i + this.width / 6;
				else if ((this.cards.length*test_card.width).ratio(0,1) > game_width)
					var drawX = this.drawX - (card_num*(test_card.width / 2)) / 2 + (test_card.width / 2)*i + this.width / 4;
				else
					var drawX = this.drawX - (card_num*test_card.width) / 2 + test_card.width*i + this.width / 2;
			}
			else if (this.cards.length <= 8)
				var drawX = this.drawX - (card_num*(test_card.width / 3)) / 2 + (test_card.width/3)*i + this.width / 3;
			else
				var drawX = this.drawX - (card_num*(test_card.width / 6)) / 2 + (test_card.width/6)*i + this.width / 6;
			
		}
		else if (this.card_pos == "left")
		{
			if (this.show_cards)
				var drawX = this.drawX - test_card.width - test_card.width*i;
			else if (this.cards.length <= 8)
				var drawX = this.drawX - test_card.width - (test_card.width / 3)*i;
			else
				var drawX = this.drawX - test_card.width - (test_card.width / 6)*i;
		}
		else
		{
			if (this.show_cards)
				var drawX = this.drawX + this.width + test_card.width*i;
			else if (this.cards.length <= 8)
				var drawX = this.drawX + this.width + (test_card.width / 3)*i;
			else
				var drawX = this.drawX + this.width + (test_card.width / 6)*i;
		}
			
		if (this.card_pos == "top")
			var drawY = this.drawY - test_card.height;
		else if (this.card_pos == "bottom")
			var drawY = this.drawY + this.height;
		else
			var drawY = this.drawY + this.height / 2 - test_card.height / 2;
		
		
		if (this.show_cards == false)
		{
			var diff = (i -(this.cards.length-1)/2);
			if (this.card_pos == "top")
				diff = -diff;
			
			if (this.cards.length > 8)
				diff = diff / 3;
			
			drawY-= Math.abs(diff*3);
			this.cards[i].newRotate = diff*8;
		}
		else
			this.cards[i].newRotate = 0;
		
		this.cards[i].newDrawX = drawX;
		this.cards[i].newDrawY = drawY;
		
		this.cards[i].is_moving = true;
		this.cards[i].moving_type = "fix";
		this.cards[i].key = i;
		this.cards[i].player_id = this.key;
	}
};

Player.prototype.check_finished = function()
{
	if (this.cards.length <= 0 && finished_players.indexOf(this.key) === -1)
	{
		if (finished_players.length == 0)
			this.win_cards = 2;
		else if (finished_players.length == 1)
		{
			if (player_num > 3)
				this.win_cards = 1;
			else if (player_num == 3)
				this.win_cards = 0;
			else
				this.win_cards = -2;
		}
		else if (finished_players.length == 2)
		{
			if (player_num > 4)
				this.win_cards = 0;
			else if (player_num == 4)
				this.win_cards = -1;
			else if (player_num == 3)
				this.win_cards = -2;
		}
		else if (finished_players.length == 3)
		{
			if (player_num > 5)
				this.win_cards = 0;
			else if (player_num == 5)
				this.win_cards = -1;
			else if (player_num == 4)
				this.win_cards = -2;
		}
		else if (finished_players.length == 4)
		{
			if (player_num > 6)
				this.win_cards = 0;
			else if (player_num == 6)
				this.win_cards = -1;
			else if (player_num == 5)
				this.win_cards = -2;
		}
		else if (finished_players.length == 5)
		{
			if (player_num > 7)
				this.win_cards = 0;
			else if (player_num == 7)
				this.win_cards = -1;
			else if (player_num == 6)
				this.win_cards = -2;
		}
		else if (finished_players.length == 6)
		{
			if (player_num > 8)
				this.win_cards = 0;
			else if (player_num == 8)
				this.win_cards = -1;
			else if (player_num == 7)
				this.win_cards = -2;
		}
		
		finished_players[finished_players.length] = this.key;
	}
};


Player.prototype.ai = function()
{
	if (this.played_card == false && this.skipped == false)
	{
		for (var i = 0; i < this.cards.length; i++)
		{
			if (table_cards.length == lowest_card && game_first_player == "low")
			{
				if (this.cards[i].id == lowest_card)
				{
					this.cards[i].play(false, 0, true);
					this.played_card = true;
					break;
				}
			}
			else if (game_first_player != "low" && table_cards.length == 0 || table_cards.length > 0 && table_cards[table_cards.length-1].done == true)
			{
				this.cards[i].play(false, 0, true);
				this.played_card = true;
				break;
			}
			else if (table_cards.length > 0 && table_cards[table_cards.length-1].num < this.cards[i].num)
			{
				var current_played = 0;
				for (var ii = 0; ii < 4; ii++)
				{
					if (this.cards[i+ii] != undefined && this.cards[i+ii].num == this.cards[i].num)
						current_played++;
				}
				if (current_played == cards_played)
				{
					this.cards[i].play(false, 0, true);
					this.played_card = true;
					break;
				}
			}
		}
		
		if (this.played_card == false)
		{
			this.skipped = true;
			console.debug("Player " + this.key + " will skip")
			
			if (is_multiplayer && multiplayer_cards_to_play.length > 0)
				var timeout = 0;
			else if (ai_speed == "auto")
				var timeout = Math.round(Math.random()*2000);
			else
				var timeout = ai_speed;
			var player = this;
			window.setTimeout(function() {
				skipped_players[skipped_players.length] = player.key;
			}, timeout);
		}
	}
};

Player.prototype.check_multiplayer = function()
{
	for (var i = 0; i < multiplayer_cards_to_play.length; i++)
	{
		if (multiplayer_cards_to_play[i]['player_id'] == this.multiplayer_id)
		{
			if (multiplayer_cards_to_play[i]['card_key'] == "skip")
				skipped_players[skipped_players.length] = this.key;
			else if (multiplayer_cards_to_play[i]['card_key'] == "bot")
			{
				this.enable_multiplayer = false;
				this.enable_ai = true;
				this.text = "Offline (Bot)";
			}
			else
				this.cards[multiplayer_cards_to_play[i]['card_key']].play();
			
			multiplayer_cards_to_play.splice(i,1);
			break;
		}
	}
	
	if (this.enable_multiplayer == false)
	{
		for (var i = 0; i < multiplayer_cards_to_play.length; i++)
		{
			if (multiplayer_cards_to_play[i]['player_id'] == this.multiplayer_id)
			{
				multiplayer_cards_to_play[i].splice(i, 1);
				i = -1;
				continue;
			}
		}
			
	}
};

function compare_card(a,b) 
{
	if (a.num == b.num)
	{
		if (a.id > b.id)
			return -1;
		else if (a.id < b.id)
			return 1;
	}
	else if (a.num > b.num)
		return -1;
	else if (a.num < b.num)
		return 1;
	return 0;
}

function compare_card_ai(a,b) 
{
	if (a.num == b.num)
	{
		if (a.id < b.id)
			return -1;
		else if (a.id > b.id)
			return 1;
	}
	else if (a.num < b.num)
		return -1;
	else if (a.num > b.num)
		return 1;
	return 0;
}