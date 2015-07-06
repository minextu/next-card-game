function Player(drawX, drawY, show_cards, card_pos, no_cards)
{
	this.drawX = drawX;
	this.drawY = drawY;
	this.width = 100
	this.height = 100;
	
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
			this.cards[i] = new Card(available_cards[card_key], drawX, drawY, show_cards);
			available_cards.splice(card_key, 1);
		}
	}
}

Player.prototype.draw = function()
{
	//main_ctx.fillStyle = "blue";
	//main_ctx.fillRect(this.drawX.ratio(0), this.drawY.ratio(1), this.width.ratio(0,1), (this.height).ratio(1,1));
	main_ctx.drawImage(player_image, 0,0,this.width,this.height,(this.drawX).ratio(0), (this.drawY).ratio(1), (this.width).ratio(0,1), (this.height).ratio(1,1))
	
	for (var i = 0; i < this.cards.length; i++)
	{
		this.cards[i].draw(this.show_cards);
	}
}
