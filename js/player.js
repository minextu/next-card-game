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
	this.played_card = false;
	this.skipped = false;
	
	/*if (key == 0)
		this.win_cards = 2;
	else if (key == 1)
		this.win_cards = 1;
	else if (key == 2)
		this.win_cards = -1;
	else if (key == 3)
		this.win_cards = -2;
	else
		this.win_cards = 0;
	
	if (this.win_cards == 2)
		this.text = "Big Winner";
	else if (this.win_cards == 1)
		this.text = "Small Winner";
	else if (this.win_cards == 0)
		this.text = "Neutral";
	else if (this.win_cards == -1)
		this.text = "Small Loser";
	else if (this.win_cards == -2)
		this.text = "Big Loser";
	else
		this.text = "Unknown!";*/
}

Player.prototype.draw = function()
{
	if (this.enable_ai && player_turn == this.key && can_play)
		this.ai();
	
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
			var drawY = this.drawY;
			var rectY = this.drawY - font_size;
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
	
	for (var i = 0; i < this.cards.length; i++)
	{
		this.cards[i].draw();
	}
	
	if (player_turn == this.key && can_play)
		main_ctx.drawImage(arrow_image, this.drawX.ratio(0) + (this.width / 2 - 50 / 2).ratio(0,1), this.drawY.ratio(1), (50).ratio(0,1), (50).ratio(1,1));
	if (player_turn == this.key && table_cards.length != 0 && table_cards[table_cards.length-1].done != true && can_play && this.key == 0)
	{
		var skipX = this.drawX;
		var skipY = this.drawY;
		var skipWidth = 100;
		var skipHeight = 100;
		
		if (mouseX >= skipX.ratio(0) && mouseX <= skipX.ratio(0) + skipWidth.ratio(0,1) && mouseY >= skipY.ratio(1) && mouseY <= skipY.ratio(1) + skipHeight.ratio(1,1))
		{
			main_ctx.globalAlpha = 0.2;
			main_ctx.fillStyle = "blue";
			main_ctx.fillRect(skipX.ratio(0), (skipY).ratio(1), (skipWidth).ratio(0,1), (skipHeight).ratio(1,1));
			main_ctx.globalAlpha = 1;
			
			if (mouse_is_down)
			{
				skipped_players[skipped_players.length] = this.key;
				if (player_turn < player_num - 1)
					player_turn++;
				else
					player_turn = 0;
				
				mouse_is_down = false;
			}
		}
		main_ctx.drawImage(skip_image, (skipX).ratio(0), (skipY).ratio(1), (skipWidth).ratio(0,1),(skipHeight).ratio(1,1));
	}
};

Player.prototype.updated_cards = function()
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
			var drawX = this.drawX - (card_num*test_card.width) / 2 + test_card.width*i + this.width / 2;
		else if (this.card_pos == "left")
			var drawX = this.drawX - test_card.width - test_card.width*i;
		else
			var drawX = this.drawX + this.width + test_card.width*i;
			
		if (this.card_pos == "top")
			var drawY = this.drawY - test_card.height;
		else if (this.card_pos == "bottom")
			var drawY = this.drawY + this.height;
		else
			var drawY = this.drawY + this.height / 2 - test_card.height / 2;
		
		this.cards[i].newDrawX = drawX;
		this.cards[i].newDrawY = drawY;
		this.cards[i].newRotate = 0;
		this.cards[i].is_moving = true;
		this.cards[i].moving_action = "fix";
		this.cards[i].key = i;
		this.cards[i].player_id = this.key
	}
	
	if (this.cards.length <= 0)
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
		
		if (this.win_cards == 2)
			this.text = "Big Winner";
		else if (this.win_cards == 1)
			this.text = "Small Winner";
		else if (this.win_cards == 0)
			this.text = "Neutral";
		else if (this.win_cards == -1)
			this.text = "Small Loser";
		else if (this.win_cards == -2)
			this.text = "Big Loser";
		else
			this.text = "Unknown!";
			
		
		finished_players[finished_players.length] = this.key;
		
		if (table_cards[table_cards.length-1].num == 14)
		{
			for (var i = 0; i < player_num; i++)
			{
				if (player_turn < player_num - 1)
					player_turn++;
				else
					player_turn = 0;
				
				if (finished_players.indexOf(player_turn) == -1)
					break;
			}
		}
		else
		{
			var new_player = this.key;
			for (var i = 0; i < player_num; i++)
			{
				if (new_player+1 < player_num - 1)
					new_player++;
				else
					new_player = 0;
				
				if (finished_players.indexOf(player_turn) == -1)
					break;
			}
			table_cards[table_cards.length-1].from_player = new_player;
		}
	}
};

Player.prototype.ai = function()
{
	if (this.played_card == false && this.skipped == false)
	{
		for (var i = 0; i < this.cards.length; i++)
		{
			if (table_cards.length == 0)
			{
				if (this.cards[i].num == 7)
				{
					this.cards[i].play(false, 0, true);
					this.played_card = true;
					break;
				}
			}
			else if (table_cards[table_cards.length-1].done == true)
			{
				this.cards[i].play(false, 0, true);
				this.played_card = true;
				break;
			}
			else if (table_cards[table_cards.length-1].num < this.cards[i].num)
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
			if (ai_speed == "auto")
				var timeout = Math.round(Math.random()*2000);
			else
				var timeout = ai_speed;
			var player = this;
			window.setTimeout(function() {
				skipped_players[skipped_players.length] = player.key;
				if (player_turn < player_num - 1)
						player_turn++;
				else
					player_turn = 0;
			}, timeout);
		}
	}
}

function compare_card(a,b) 
{
	if (a.num > b.num)
		return -1;
	if (a.num < b.num)
		return 1;
	return 0;
}

function compare_card_ai(a,b) 
{
	if (a.num < b.num)
		return -1;
	if (a.num > b.num)
		return 1;
	return 0;
}