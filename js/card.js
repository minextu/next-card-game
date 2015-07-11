function Card(id, drawX, drawY, show, rotate, player_id, key)
{
	var symbols = ["heart", "diamond", "club", "spade"];
	
	this.show = show;
	this.is_moving = false;
	this.player_id = player_id;
	this.drawX = drawX;
	this.drawY = drawY;
	this.error = false;
	this.key = key;
	this.is_down = false;
	
	this.rotate = rotate;
	if (this.rotate == undefined)
		this.rotate = 0;

	this.disabled = false;
	
	this.original_width = 100;
	this.original_height = 136;
	
	if (this.show == false)
	{
		this.width = this.original_width / 2;
		this.height = this.original_height / 2;
	}
	else
	{
		this.width = this.original_width;
		this.height = this.original_height;
	}
	
	this.srcWidth = 200;
	this.srcHeight = 272;
	
	if (this.show)
		this.srcX = 200;
	else
		this.srcX = 0;
	
	this.srcY = 0;
	
	this.id = Number(id);
	if (this.id >= 0 && this.id < 4)
	{
		this.name = "7";
		this.num = 7;
		this.symbol = symbols[this.id];
	}
	else if (this.id >= 4 && this.id < 8)
	{
		this.name = "8";
			this.num = 8;
		this.symbol = symbols[this.id - 4];
	}
	else if (this.id >= 8 && this.id < 12)
	{
		this.name = "9";
		this.num = 9;
		this.symbol = symbols[this.id - 8];
	}
	else if (this.id >= 12 && this.id < 16)
	{
		this.name = "10";
		this.num = 10;
		this.symbol = symbols[this.id - 12];
	}
	else if (this.id >= 16 && this.id < 20)
	{
		this.name = "jack";
		this.num = 11;
		this.symbol = symbols[this.id - 16];
	}
	else if (this.id >= 20 && this.id < 24)
	{
		this.name = "queen";
		this.num = 12;
		this.symbol = symbols[this.id - 20];
	}
	else if (this.id >= 24 && this.id < 28)
	{
		this.name = "king";
		this.num = 13;
		this.symbol = symbols[this.id - 24];
	}
	else if (this.id >= 28 && this.id < 32)
	{
		this.name = "ace";
		this.num = 14;
		this.symbol = symbols[this.id - 28];
	}
	else if (this.id >= 32 && this.id < 36)
	{
		this.name = "2";
		this.num = 2;
		this.symbol = symbols[this.id - 32];
	}
	else if (this.id >= 36 && this.id < 40)
	{
		this.name = "3";
		this.num = 3;
		this.symbol = symbols[this.id - 36];
	}
	else if (this.id >= 40 && this.id < 44)
	{
		this.name = "4";
		this.num = 4;
		this.symbol = symbols[this.id - 40];
	}
	else if (this.id >= 44 && this.id < 48)
	{
		this.name = "5";
		this.num = 5;
		this.symbol = symbols[this.id - 44];
	}
	else if (this.id >= 48 && this.id < 52)
	{
		this.name = "6";
		this.num = 6;
		this.symbol = symbols[this.id - 48];
	}
	
	this.symbol_srcWidth = 34;
	this.symbol_srcHeight = 38;
	this.symbol_width = 34;
	this.symbol_height = 38;
	
	if (this.symbol == "club")
		this.symbol_srcX = 78;
	else if (this.symbol == "diamond")
		this.symbol_srcX = 39;
	else if (this.symbol == "spade")
		this.symbol_srcX = 0;
	else
		this.symbol_srcX = 118;
	
	this.symbol_srcY = 0;
	this.hide_old_cards = false;
	
	this.generate_canvas();
}
Card.prototype.generate_canvas = function()
{
    this.card_canvas = document.createElement('canvas');
    this.card_canvas.width = this.width;
    this.card_canvas.height = this.height;
    this.card_ctx = this.card_canvas.getContext('2d');

	// blank card
	if (cards_image[this.id] == undefined || this.show == false)
		this.card_ctx.drawImage(card_image, this.srcX, this.srcY, this.srcWidth, this.srcHeight, 0, 0, this.width, this.height);
	else if (cards_image[this.id] != undefined)
		this.card_ctx.drawImage(cards_image[this.id], 0, 0, this.width, this.height);
}
Card.prototype.draw = function()
{
	if (this.disabled == false)
	{
		main_ctx.save();
		main_ctx.translate(this.drawX.ratio(0) + (this.width/2).ratio(0,1), this.drawY.ratio(1) + (this.height/2).ratio(1,1));
		
		if (this.moving_action != "fix")
			main_ctx.rotate(Math.PI / this.rotate);
		else
			main_ctx.rotate(this.rotate * Math.PI / 180);
		
		
	
		/*if (this.show)
		{
			if (cards_image[this.id] != undefined)
			{
				this.card_ctx.drawImage(cards_image[this.id], 0, 0, this.width, this.height);
			}
			else
			{
				// suit / symbol
				this.card_ctx.drawImage(suits_image, this.symbol_srcX, this.symbol_srcY, this.symbol_srcWidth, this.symbol_srcHeight, -(this.symbol_width / 2).ratio(0,1), -(this.symbol_height / 2).ratio(1,1), this.symbol_width.ratio(0,1), this.symbol_height.ratio(1,1));
				
				// name
				if (this.symbol == "heart" || this.symbol == "diamond")
					main_ctx.fillStyle = "#a31919";
				else
					main_ctx.fillStyle = "black";
			}
			
			
		}*/
		main_ctx.drawImage(this.card_canvas, (-this.width / 2).ratio(0,1), (-this.height / 2).ratio(1,1), this.width.ratio(0,1), this.height.ratio(1,1));
			
		
		if (this.hover)
		{
			main_ctx.globalAlpha = 0.3;
			main_ctx.fillStyle = "red";
			main_ctx.fillRect(-(this.width / 2).ratio(0,1), (-this.height / 2).ratio(1,1), this.width.ratio(0,1), this.height.ratio(1,1));
			main_ctx.globalAlpha = 1;
			
			if (highlight == "" && players[this.player_id] != undefined)
				players[this.player_id].selected_cards = 1;
			
			if (players[this.player_id] != undefined && players[this.player_id].cards[this.key+1] != undefined && players[this.player_id].cards[this.key+1].num == this.num)
			{
				players[this.player_id].selected_cards++;
				highlight = this.player_id + "" + (this.key+1);
				players[this.player_id].cards[this.key+1].hover = true;
			
				if (this.error != false)
					players[this.player_id].cards[this.key+1].error = this.error;
			}
			else
				highlight = "";
		}
		
		if (this.error !== false)
		{
			this.error -= (1).speed();
			if (this.error <= 0)
				this.error = false;
			
			
			main_ctx.fillStyle = "red";
			main_ctx.textBaseline = "middle";
			main_ctx.textAlign = "center";
			main_ctx.font = (50).ratio(0,1) + "px Arial";
			main_ctx.fillText("X", (0).ratio(0,1), (0).ratio(1,1));
		}
		if (this.is_down && !mouse_is_down && this.player_id !== false)
		{
			players[this.player_id].updated_cards = true;
			this.is_down = false;
			start_card = false;
		}
		
		/*
		if (this.show && cards_image[this.id] == undefined)
		{
			//name
			main_ctx.textBaseline = "top";
			main_ctx.textAlign = "left";
			main_ctx.font = (15).ratio(0,1) + "px Arial";
			main_ctx.fillText(this.name, -(this.width / 2 - 5).ratio(0,1), -(this.height / 2 - 5).ratio(1,1));
		}*/
		
		if (this.is_moving)
		{
			if (this.moving_action == "fix")
			{
				this.diffX = this.newDrawX  - this.drawX;
				this.diffY = this.newDrawY - this.drawY;
			}
			else
			{
				this.diffX = this.newDrawX  - this.drawX + this.width / 2;
				this.diffY = this.newDrawY - this.drawY + this.height / 2;
			}
			
			this.speed = (Math.abs(this.diffX) + Math.abs(this.diffY)) / 20;
			this.angle = Math.atan2(this.diffY, this.diffX);
			this.drawX += Math.cos(this.angle) * this.speed.speed();
			this.drawY += Math.sin(this.angle) * this.speed.speed();
			
			this.rotateSpeed = (this.newRotate - this.rotate) / 100;
			this.rotate += this.rotateSpeed.speed();
			
			if (this.speed < 1 && this.moving_action !== "fix" || this.speed <= 0.1)
			{
				this.is_moving = false;
				
				if (this.player_id !== false && this.moving_action !== "fix")
				{
					players[this.player_id].played_card = false;
					this.disabled = true;
					table_cards[table_cards.length] = new Card(this.id, this.drawX, this.drawY, true, this.rotate, false);
					table_cards[table_cards.length-1].from_player = this.player_id;
					
					var no_update = false;
					for (var i = 0; i < players[this.player_id].cards.length; i++)
					{
						if (players[this.player_id].cards[i].is_moving && players[this.player_id].cards[i].moving_action != "fix")
							no_update = true;
					}
					if (no_update == false)
					{
						var player_id = this.player_id;
						
						if (is_multiplayer && multiplayer_cards_to_play.length > 0 && players[0].enable_multiplayer == true)
							players[this.player_id].update_cards();
						else
							players[this.player_id].updated_cards = true;
						
						
						can_play = true;

						if (this.hide_old_cards)
							hide_cards();
					}
				}
				else if (this.moving_action == "fix")
				{
					this.drawX = this.newDrawX;
					this.drawY = this.newDrawY;
					this.rotate = this.newRotate;
				}
			}
		}
		
		main_ctx.restore();
	}
};

Card.prototype.check_play = function()
{
	if (
		(!this.is_moving || this.moving_action == "fix")
		&& 
		(this.player_id === 0 && player_turn === this.player_id && can_play && !is_existing_game)
		&& 
		(highlight == this.player_id + "" + this.key 
		|| !mouse_is_down && is_hover && mouseX >= (this.drawX).ratio(0) && mouseX <= (this.drawX).ratio(0) + (this.width).ratio(0,1) && mouseY >= (this.drawY).ratio(1) && mouseY <= (this.drawY).ratio(1) + (this.height).ratio(1,1) 
		|| mouse_is_down && is_hover && (start_card === this.player_id + "" + this.key || mouseX >= (this.drawX).ratio(0) && mouseX <= (this.drawX).ratio(0) + (this.width).ratio(0,1) && mouseY >= (this.drawY).ratio(1) && mouseY <= (this.drawY).ratio(1) + (this.height).ratio(1,1) && start_card === false)))
	{
		if (highlight != this.player_id + "" + this.key)
			is_hover = false;
		
		this.hover = true;
			
		if (mouse_is_down && this.player_key !== false)
		{
			if (start_card === false)
				start_card = this.player_id + "" + this.key;
			
			this.is_down = true;
			this.is_moving = false;
			var diff = (startY - mouseY) / game_height * original_height;
			this.drawY = this.newDrawY - diff;
				
			for (var i = 1; i < players[this.player_id].cards.length; i++)
			{
				if (players[this.player_id].cards[this.key+i] != undefined && players[this.player_id].cards[this.key+i].num == this.num)
				{
					players[this.player_id].cards[this.key+i].drawY = players[this.player_id].cards[this.key+i].newDrawY - diff;;
					players[this.player_id].cards[this.key+i].is_moving = false;
				}
			}
			
			if (this.drawY < this.newDrawY - this.height)
			{
				if (table_cards.length == 0 && this.num == 7 || table_cards.length == 0 && game_first_player != "7" || table_cards.length > 0 && table_cards[table_cards.length-1].done == true)
					this.play();
				else if (table_cards.length > 0 && table_cards[table_cards.length-1].num < this.num && players[this.player_id].selected_cards == cards_played)
					this.play();
				else
					this.error = 50;
				
				mouse_is_down = false;
			}
		}
	}
	else
		this.hover = false;
}

Card.prototype.play = function(no_new_turn, offsetX, is_ai, not_first_card)
{	
	this.is_down = false;
	start_card = false;
	
	if (this.player_id !== false && players[this.player_id] != undefined)
		players[this.player_id].skip_timeout = false;
	
	if (is_ai === true)
	{
		var card = this;
		
		if (is_multiplayer && multiplayer_cards_to_play.length > 0)
			var timeout = 0;
		else if (ai_speed == "auto")
			var timeout = Math.round(Math.random()*2000);
		else
			var timeout = ai_speed;
		
		window.setTimeout(function() { card.play(no_new_turn, offsetX, false) }, timeout);
		return false;
	}
	if (players[this.player_id] != undefined)
		players[this.player_id].played_card = false;
	
	if (is_ai != "2" && (table_cards.length == 0 || table_cards[table_cards.length-1].done == true))
		cards_played++;
	
	if (offsetX == undefined)
		offsetX = 0;
	
	if (players[this.player_id] != undefined && !players[this.player_id].enable_ki && players[this.player_id].cards[this.key+1] != undefined && players[this.player_id].cards[this.key+1].num == this.num)
	{
		if (offsetX == 0)
			offsetX-= 99;
		players[this.player_id].cards[this.key+1].play(true, offsetX+100, false, true);
	}
	
	this.is_moving = true;
	this.moving_action = false;
	can_play = false;
	this.newDrawX = 0 - this.width + offsetX;
	this.newDrawY = original_height / 2 - this.height;
	this.newRotate = Math.round(Math.random()*20);
	this.rotate = 0;
	this.show = true;
	this.width = this.original_width;
	this.height = this.original_height;
	this.srcX = 200;
	this.show = true;
	this.generate_canvas();
	
	if (this.player_id === 0 && is_multiplayer && not_first_card !== true && players[0].enable_multiplayer == false && !this.enable_ai)
	{
		multiplayer_played_cards[multiplayer_played_cards.length] = this.key;
		console.debug("saved card");
	}
	
	if (this.id >= 28 && this.id < 32)
	{
		this.hide_old_cards = true;
	}
	else if (no_new_turn !== true)
	{
		for (var i = 0; i < players.length; i++)
		{
			if (player_turn < players.length - 1)
				player_turn++;
			else
				player_turn = 0;
			
			if (skipped_players.indexOf(player_turn) == -1)
				break;
		}
	}
};

function hide_cards()
{
	skipped_players = new Array();
	skipped_players = finished_players.slice();
	
	console.debug("new Round!");
	
	cards_played = 0;
	var card = new Card(0,0,0, true);
	for (var i = 0; i < table_cards.length; i++)
	{
		table_cards[i].is_moving = true;
		table_cards[i].newDrawX = -table_width / 2;
		table_cards[i].newDrawY = original_height / 2 - table_height / 2 + card.height;
		table_cards[i].newRotate = 360;
		table_cards[i].show = false;
		table_cards[i].width = card.original_width / 2;
		table_cards[i].height = card.original_height / 2;
		table_cards[i].srcX = 0;
		table_cards[i].done = true;
		table_cards[i].generate_canvas();
	}
	
	for (var i = 0; i < players.length; i++)
	{
		players[i].skipped = false;
	}
}
