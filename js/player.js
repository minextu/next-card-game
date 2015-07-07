function Player(drawX, drawY, show_cards, card_pos, no_cards, key)
{
	this.drawX = drawX;
	this.drawY = drawY;
	this.width = 100
	this.height = 100;
	this.key = key;
	this.text = "";
	
	this.show_cards = show_cards;
	this.card_pos = card_pos;
	
	var card_num = available_card_num / player_num;
	this.cards = [];
	
	var test_card = new Card(0,0,0, show_cards);
	
	if (no_cards !== true)
	{
		for (var i = 0; i < card_num; i++)
		{
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
			
			var card_key = Math.round(Math.random()*(available_cards.length - 1));
			this.cards[i] = new Card(available_cards[card_key], drawX, drawY, show_cards, 0, this.key);
			available_cards.splice(card_key, 1);
		}
		this.updated_cards();
	}
}

Player.prototype.draw = function()
{
	main_ctx.drawImage(player_image, 0,0,this.width,this.height,(this.drawX).ratio(0), (this.drawY).ratio(1), (this.width).ratio(0,1), (this.height).ratio(1,1))
	
	for (var i = 0; i < this.cards.length; i++)
	{
		this.cards[i].draw();
	}
	
	if (this.text != "")
	{
		var font_size = 30;
		if (this.card_pos == "top" || this.card_pos == "bottom")
		{
			var drawX = this.drawX + this.width / 2;
			main_ctx.textAlign = "center";
		}
		else if (this.card_pos == "right")
		{
			var drawX = this.drawX + this.width;
			main_ctx.textAlign = "left";
		}
		else if (this.card_pos == "left")
		{
			var drawX = this.drawX;
			main_ctx.textAlign = "right";
		}
		if (this.card_pos == "left" || this.card_pos == "right")
		{
			var drawY = this.drawY + this.height / 2;
			main_ctx.textBaseline = "middle";
		}
		else if (this.card_pos == "top")
		{
			var drawY = this.drawY;
			main_ctx.textBaseline = "bottom";
		}
		else if (this.card_pos == "bottom")
		{
			var drawY = this.drawY + this.height;
			main_ctx.textBaseline = "top";
		}
			
		main_ctx.fillStyle = "blue";
		main_ctx.font = (font_size).ratio(0,1) + "px Arial";
		main_ctx.fillText(this.text, drawX.ratio(0), (drawY).ratio(1));
	}
	
	
	if (player_turn == this.key && table_cards.length != 0 && table_cards[table_cards.length-1].done != true && can_play)
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
	this.unused_cards = new Array();
	for (var i = 0; i < this.cards.length; i++)
	{
		if (this.cards[i].disabled === true)
			this.unused_cards[this.unused_cards.length] = i;
	}
	
	for (var i = 0; i < this.unused_cards.length;i++)
	{
		this.cards.splice(this.unused_cards[i], 1);
	}
	
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
		
		this.cards[i].drawX = drawX;
		this.cards[i].drawY = drawY;
	}
	
	if (this.cards.length <= 0)
	{
		if (finished_players.length == 0)
			this.text = "Big Winner!";
		else if (finished_players.length == 1)
		{
			if (player_num > 3)
				this.text = "Small Winner!";
			else if (player_num == 3)
				this.text = "Neutral";
			else
				this.text = "Big Loser";
		}
		else if (finished_players.length == 2)
		{
			if (player_num > 4)
				this.text = "Neutral";
			else if (player_num == 4)
				this.text = "Small Loser";
			else if (player_num == 3)
				this.text = "Big Loser";
		}
		else if (finished_players.length == 3)
		{
			if (player_num > 5)
				this.text = "Neutral";
			else if (player_num == 5)
				this.text = "Small Loser";
			else if (player_num == 4)
				this.text = "Big Loser";
		}
		else if (finished_players.length == 4)
		{
			if (player_num > 6)
				this.text = "Neutral";
			else if (player_num == 6)
				this.text = "Small Loser";
			else if (player_num == 5)
				this.text = "Big Loser";
		}
		else if (finished_players.length == 5)
		{
			if (player_num > 7)
				this.text = "Neutral";
			else if (player_num == 7)
				this.text = "Small Loser";
			else if (player_num == 8)
				this.text = "Big Loser";
		}
		
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

function compare_card(a,b) 
{
	if (a.num < b.num)
		return -1;
	if (a.num > b.num)
		return 1;
	return 0;
}
