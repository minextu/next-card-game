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
	this.has_landed = false;
	
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
		this.name = "2";
		this.num = 2;
		this.symbol = symbols[this.id];
	}
	else if (this.id >= 4 && this.id < 8)
	{
		this.name = "3";
		this.num = 3;
		this.symbol = symbols[this.id - 4];
	}
	else if (this.id >= 8 && this.id < 12)
	{
		this.name = "4";
		this.num = 4;
		this.symbol = symbols[this.id - 8];
	}
	else if (this.id >= 12 && this.id < 16)
	{
		this.name = "5";
		this.num = 5;
		this.symbol = symbols[this.id - 12];
	}
	else if (this.id >= 16 && this.id < 20)
	{
		this.name = "6";
		this.num = 6;
		this.symbol = symbols[this.id - 16];
	}
	else if (this.id >= 20 && this.id < 24)
	{
		this.name = "7";
		this.num = 7;
		this.symbol = symbols[this.id - 20];
	}
	else if (this.id >= 24 && this.id < 28)
	{
		this.name = "8";
		this.num = 8;
		this.symbol = symbols[this.id - 24];
	}
	else if (this.id >= 28 && this.id < 32)
	{
		this.name = "9";
		this.num = 9;
		this.symbol = symbols[this.id - 28];
	}
	else if (this.id >= 32 && this.id < 36)
	{
		this.name = "2";
		this.num = 10;
		this.symbol = symbols[this.id - 32];
	}
	else if (this.id >= 36 && this.id < 40)
	{
		this.name = "jack";
		this.num = 11;
		this.symbol = symbols[this.id - 36];
	}
	else if (this.id >= 40 && this.id < 44)
	{
		this.name = "queen";
		this.num = 12;
		this.symbol = symbols[this.id - 40];
	}
	else if (this.id >= 44 && this.id < 48)
	{
		this.name = "king";
		this.num = 13;
		this.symbol = symbols[this.id - 44];
	}
	else if (this.id >= 48 && this.id < 52)
	{
		this.name = "ace";
		this.num = 14;
		this.symbol = symbols[this.id - 48];
	}
	
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
		
		if (this.moving_type != "fix")
			main_ctx.rotate(Math.PI / this.rotate);
		else
			main_ctx.rotate(this.rotate * Math.PI / 180);
		
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
		
		this.check_move();
		
		main_ctx.restore();
	}
};

Card.prototype.check_play = function()
{
	if (
		(!this.is_moving || this.moving_type == "fix")
		&& 
		(this.player_id === 0)
		&& 
		(highlight == this.player_id + "" + this.key 
		|| !mouse_is_down && is_hover && mouseX >= (this.drawX).ratio(0) && mouseX <= (this.drawX).ratio(0) + (this.width).ratio(0,1) && mouseY >= (this.drawY).ratio(1) && mouseY <= (this.drawY).ratio(1) + (this.height).ratio(1,1) 
		|| mouse_is_down && is_hover && (start_card === this.player_id + "" + this.key || mouseX >= (this.drawX).ratio(0) && mouseX <= (this.drawX).ratio(0) + (this.width).ratio(0,1) && mouseY >= (this.drawY).ratio(1) && mouseY <= (this.drawY).ratio(1) + (this.height).ratio(1,1) && start_card === false)))
	{
		if (highlight != this.player_id + "" + this.key)
			is_hover = false;
		
		this.hover = true;
			
		if (mouse_is_down && this.player_id !== false && player_turn === this.player_id && can_play && !is_existing_game)
		{
			if (start_card === false)
				start_card = this.player_id + "" + this.key;
			
			if (this.is_down == false)
				this.audio_play();
			
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
				if (table_cards.length == 0 && this.num == lowest_num || table_cards.length == 0 && game_first_player != "low" || table_cards.length > 0 && table_cards[table_cards.length-1].done == true)
					this.play();
				else if (table_cards.length > 0 && table_cards[table_cards.length-1].num < this.num && players[this.player_id].selected_cards == cards_played)
					this.play();
				else
				{
					this.fake_play();
					this.error = 50;
				}
				
				mouse_is_down = false;
			}
		}
	}
	else
		this.hover = false;
}

Card.prototype.fake_play = function(no_new_turn, offsetX, is_ai, not_first_card, is_skip, done)
{	
	//reset mouse 
	this.is_down = false;
	start_card = false;
	
	if (players[this.player_id] == undefined || players[this.player_id].enable_ai == true)
		this.audio_play();
	
	if (offsetX == undefined)
		offsetX = 0;
	
	
	
	// disable this card (a copy is stored on table)
	var table_key = table_cards.length;
	this.disabled = true;
	table_cards[table_key] = new Card(this.id, this.drawX, this.drawY, true, this.rotate, false);
	table_cards[table_key].from_player = this.player_id;
			
	// if multible cards where played, set offset and play other card
	if (is_skip != true && (players[this.player_id] != undefined && players[this.player_id].cards[this.key+1] != undefined && players[this.player_id].cards[this.key+1].num == this.num))
	{
		if (offsetX == 0)
			offsetX-= 99;
		players[this.player_id].cards[this.key+1].fake_play(true, offsetX+100, false, true, false, done);
	}
	else if (is_skip !== true)
		table_cards[table_key].moving_action = "can_play";
		
	
	// set card to move to table
	table_cards[table_key].is_moving = true;
	table_cards[table_key].moving_type = false;
	
	table_cards[table_key].newDrawX = 0 - this.width + offsetX;
	table_cards[table_key].newDrawY = original_height / 2 - this.height;
	table_cards[table_key].newRotate = Math.round(Math.random()*20);
	table_cards[table_key].rotate = 0;
	
	
	
	// set played card to false, since can_play is false
	if (players[this.player_id] != undefined && players[this.player_id].enable_ai )
		players[this.player_id].played_card = false;
	
	// save card for multiplayer
	if (this.player_id === 0 && is_multiplayer && not_first_card !== true && players[0].enable_multiplayer == false && !players[0].enable_ai)
	{
		multiplayer_played_fake_cards[multiplayer_played_fake_cards.length] = this.key;
		console.debug("saved fake card");
	}
	
	var card = this;
	window.setTimeout(function() {
		// enable real card
		card.disabled = false;
		card.is_moving = true;
		card.drawX = table_cards[table_key].drawX;
		card.drawY = table_cards[table_key].drawY;
		card.moving_type = "fix";
		
		// delete fake card again
		table_cards.splice(table_key, 1);
		
		if (can_play_audio)
			fake_audio.play();
		
	}, 1000);
	
}; 

Card.prototype.play = function(no_new_turn, offsetX, is_ai, not_first_card, is_skip, done)
{	
	//reset mouse 
	this.is_down = false;
	start_card = false;
	
	// reset skip timeout
	if (this.player_id !== false && players[this.player_id] != undefined)
		players[this.player_id].skip_timeout = false;
	
	// ai timeout
	if (is_ai === true)
	{
		var card = this;
		
		if (is_multiplayer && multiplayer_cards_to_play.length > 0)
			var timeout = 0;
		else if (game_ai_speed == "auto")
			var timeout = Math.round(Math.random()*2000);
		else
			var timeout = game_ai_speed;
		
		window.setTimeout(function() { card.play(no_new_turn, offsetX, false) }, timeout);
		return false;
	}
	
	if (players[this.player_id] == undefined || players[this.player_id].enable_ai == true)
		this.audio_play();
	// count played cards
	if (table_cards.length == 0 || table_cards[table_cards.length-1].done == true || done == true)
	{
		done = true;
		cards_played++;
	}
	
	if (offsetX == undefined)
		offsetX = 0;
	
	
	
	// disable this card (a copy is stored on table)
	var table_key = table_cards.length;
	this.disabled = true;
	table_cards[table_key] = new Card(this.id, this.drawX, this.drawY, true, this.rotate, false);
	table_cards[table_key].from_player = this.player_id;
			
	// if multible cards where played, set offset and play other card
	if (is_skip != true && (players[this.player_id] != undefined && players[this.player_id].cards[this.key+1] != undefined && players[this.player_id].cards[this.key+1].num == this.num))
	{
		if (offsetX == 0)
			offsetX-= 99;
		players[this.player_id].cards[this.key+1].play(true, offsetX+100, false, true, false, done);
	}
	else if (is_skip !== true)
		table_cards[table_key].moving_action = "can_play";
		
		
	// check, if cards should hide
	if (this.num == highest_num && is_skip !== true)
	{
		table_cards[table_key].hide_old_cards = true;
	}
	// else next player will play
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
	
	// set card to move to table
	table_cards[table_key].is_moving = true;
	table_cards[table_key].moving_type = false;
	
	can_play = false;
	table_cards[table_key].newDrawX = 0 - this.width + offsetX;
	table_cards[table_key].newDrawY = original_height / 2 - this.height;
	table_cards[table_key].newRotate = Math.round(Math.random()*20);
	table_cards[table_key].rotate = 0;
	
	
	// updated hand cards (remove disabled card)
	if (is_multiplayer && multiplayer_cards_to_play.length > 0 && players[0].enable_multiplayer == true)
		players[this.player_id].update_cards();
	else
		players[this.player_id].updated_cards = true;
	
	
	
	// set played card to false, since can_play is false
	if (players[this.player_id] != undefined && players[this.player_id].enable_ai )
		players[this.player_id].played_card = false;
	
	// save card for multiplayer
	if (this.player_id === 0 && is_multiplayer && not_first_card !== true && players[0].enable_multiplayer == false && !players[0].enable_ai)
	{
		multiplayer_played_cards[multiplayer_played_cards.length] = this.key;
		console.debug("saved card");
	}
	
};

Card.prototype.check_move = function()
{
	if (this.is_moving)
	{
		if (this.moving_type == "fix")
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
			
		if (this.speed < 1 && this.moving_type !== "fix" || this.speed <= 0.1)
		{
			this.is_moving = false;
			
				
			if (this.moving_action == "can_play")
			{
				can_play = true;
						
				if (this.hide_old_cards)
					hide_cards();
				
				// check if a player has no cards
				for (var i = 0; i < players.length; i++)
				{
					players[i].check_finished();
				}
			}
			else if (this.moving_action == "stop_load")
			{
				 load_media("start");
			}
				
			if (this.moving_type == "fix")
			{
				this.drawX = this.newDrawX;
				this.drawY = this.newDrawY;
				this.rotate = this.newRotate;
			}
			
			this.moving_action = false;
			this.hide_old_cards = false;
		}
		//if (this.drawX <= 0 + table_width / 2 && this.drawX + this.width >= 0 - table_width / 2 && this.drawY <= original_height / 2 + table_height / 2 && this.drawY + this.height >= original_height / 2 - table_height / 2 && this.has_landed == false && this.moving_type != "fix")
		if (this.speed < 5 && !this.has_landed && this.moving_type != "fix")
		{
			this.has_landed = true;
			this.audio_land();
		}
	}
};

Card.prototype.audio_play = function()
{
	if (can_play_audio)
	{
		var key = Math.round(Math.random()*(play_audio.length-1));
		
		try { play_audio[key].currentTime = 0; } catch(e){}
		play_audio[key].play();
	}
};

Card.prototype.audio_land = function()
{
	if (can_play_audio && this.show)
	{
		var key = Math.round(Math.random()*(land_audio.length-1));
		var key = Math.round(Math.random()*(land_audio.length-1));
		land_audio[key].play();
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
