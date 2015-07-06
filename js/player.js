function Player(drawX, drawY)
{
	this.drawX = drawX;
	this.drawY = drawY;
	this.width = 100
	this.height = 100;
	
	var card_num = available_card_num / player_num;
	this.cards = [];
	
	for (var i = 0; i < card_num; i++)
	{
		var card_key = Math.round(Math.random()*(available_cards.length - 1));
		this.cards[i] = new Card(available_cards[card_key], this.drawX + 20+ i*150, this.drawY);
		available_cards.splice(card_key, 1);
	}
}

Player.prototype.draw = function()
{
	main_ctx.fillStyle = "blue";
	main_ctx.fillRect(this.drawX.ratio(0), this.drawY.ratio(1), this.width.ratio(0,1), (this.height).ratio(1,1));
	
	for (var i = 0; i < this.cards.length; i++)
	{
		this.cards[i].draw();
	}
}
