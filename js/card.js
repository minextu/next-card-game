function Card(id, drawX, drawY)
{
	var symbols = ["heart", "diamond", "club", "spade"];
	
	this.drawX = drawX;
	this.drawY = drawY;
	this.width = 100;
	this.height = 136
	
	this.srcWidth = 200;
	this.srcHeight = 272;
	this.srcX = 200;
	this.srcY = 0;
	
	this.id = id;
	if (this.id >= 0 && this.id <= 4)
	{
		this.name = "7";
		this.symbol = symbols[this.id - 1];
	}
	else if (this.id >= 5 && this.id <= 8)
	{
		this.name = "8";
		this.symbol = symbols[this.id - 5];
	}
	else if (this.id >= 9 && this.id <= 12)
	{
		this.name = "9";
		this.symbol = symbols[this.id - 9];
	}
	else if (this.id >= 13 && this.id <= 16)
	{
		this.name = "10";
		this.symbol = symbols[this.id - 13];
	}
	else if (this.id >= 17 && this.id <= 20)
	{
		this.name = "jack";
		this.symbol = symbols[this.id - 17];
	}
	else if (this.id >= 21 && this.id <= 24)
	{
		this.name = "queen";
		this.symbol = symbols[this.id - 21];
	}
	else if (this.id >= 25 && this.id <= 28)
	{
		this.name = "king";
		this.symbol = symbols[this.id - 25];
	}
	else if (this.id >= 29 && this.id <= 32)
	{
		this.name = "ace";
		this.symbol = symbols[this.id - 29];
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
	
}
Card.prototype.draw = function()
{
	// blank card
	main_ctx.drawImage(cards_image, this.srcX, this.srcY, this.srcWidth, this.srcHeight, this.drawX.ratio(0), this.drawY.ratio(1), this.width.ratio(0,1), (this.height).ratio(1,1));
	
	// suit / symbol
	main_ctx.drawImage(suits_image, this.symbol_srcX, this.symbol_srcY, this.symbol_srcWidth, this.symbol_srcHeight, (this.drawX + this.width / 2 - this.symbol_width / 2).ratio(0), (this.drawY + this.height / 2 - this.symbol_height / 2).ratio(1), this.symbol_width.ratio(0,1), this.symbol_height.ratio(1,1));
	
	// name
	if (this.symbol == "heart" || this.symbol == "diamond")
		main_ctx.fillStyle = "#a31919";
	else
		main_ctx.fillStyle = "black";
	
	main_ctx.textBaseline = "top";
	main_ctx.textAlign = "left";
	main_ctx.font = "10px Arial";
	main_ctx.fillText(this.name, (this.drawX + 5).ratio(0,1), (this.drawY + 5).ratio(1,1));
	
};
