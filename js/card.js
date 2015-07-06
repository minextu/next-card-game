function Card(id, drawX, drawY, show, rotate)
{
	var symbols = ["heart", "diamond", "club", "spade"];
	
	this.show = show;
	this.is_moving = false;
	this.drawX = drawX;
	this.drawY = drawY;
	
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
	this.srcX = 200;
	this.srcY = 0;
	
	this.id = id;
	if (this.id >= 0 && this.id < 4)
	{
		this.name = "7";
		this.symbol = symbols[this.id];
	}
	else if (this.id >= 4 && this.id < 8)
	{
		this.name = "8";
		this.symbol = symbols[this.id - 4];
	}
	else if (this.id >= 8 && this.id < 12)
	{
		this.name = "9";
		this.symbol = symbols[this.id - 8];
	}
	else if (this.id >= 12 && this.id < 16)
	{
		this.name = "10";
		this.symbol = symbols[this.id - 12];
	}
	else if (this.id >= 16 && this.id < 20)
	{
		this.name = "jack";
		this.symbol = symbols[this.id - 16];
	}
	else if (this.id >= 20 && this.id < 24)
	{
		this.name = "queen";
		this.symbol = symbols[this.id - 20];
	}
	else if (this.id >= 24 && this.id < 28)
	{
		this.name = "king";
		this.symbol = symbols[this.id - 24];
	}
	else if (this.id >= 28 && this.id < 32)
	{
		this.name = "ace";
		this.symbol = symbols[this.id - 28];
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
	if (this.disabled == false)
	{
		main_ctx.save();
		main_ctx.translate(this.drawX.ratio(0) + (this.width/2).ratio(0,1), this.drawY.ratio(1) + (this.height/2).ratio(1,1));
		main_ctx.rotate(Math.PI / this.rotate);
		
		// blank card
		main_ctx.drawImage(cards_image, this.srcX, this.srcY, this.srcWidth, this.srcHeight, (-this.width / 2).ratio(0,1), (-this.height/ 2).ratio(1,1), this.width.ratio(0,1), (this.height).ratio(1,1));
		
		// suit / symbol
		main_ctx.drawImage(suits_image, this.symbol_srcX, this.symbol_srcY, this.symbol_srcWidth, this.symbol_srcHeight, -(this.symbol_width / 2).ratio(0,1), -(this.symbol_height / 2).ratio(1,1), this.symbol_width.ratio(0,1), this.symbol_height.ratio(1,1));
		
		// name
		if (this.symbol == "heart" || this.symbol == "diamond")
			main_ctx.fillStyle = "#a31919";
		else
			main_ctx.fillStyle = "black";
		
		if (highlight == this.name || mouseX >= (this.drawX).ratio(0) && mouseX <= (this.drawX).ratio(0) + (this.width).ratio(0,1)
			&& mouseY >= (this.drawY).ratio(1) && mouseY <= (this.drawY).ratio(1) + (this.height).ratio(1,1) && !this.is_moving)
		{
			main_ctx.globalAlpha = 0.3;
			main_ctx.fillStyle = "red";
			main_ctx.fillRect(-(this.width / 2).ratio(0,1), (-this.height / 2).ratio(1,1), this.width.ratio(0,1), this.height.ratio(1,1));
			main_ctx.globalAlpha = 1;
			
			if (mouse_is_down)
			{
				this.play();
			}
		}
		main_ctx.textBaseline = "top";
		main_ctx.textAlign = "left";
		main_ctx.font = "10px Arial";
		main_ctx.fillText(this.name, -(this.width / 2 - 5).ratio(0,1), -(this.height / 2 - 5).ratio(1,1));
		
		if (this.is_moving)
		{
			this.diffX = this.newDrawX  - this.drawX + this.width / 2;
			this.diffY = this.newDrawY - this.drawY + this.height / 2;
			
			this.speed = (Math.abs(this.diffX) + Math.abs(this.diffY)) / 20;
			this.angle = Math.atan2(this.diffY, this.diffX);
			this.drawX += Math.cos(this.angle) * this.speed;
			this.drawY += Math.sin(this.angle) * this.speed;
			
			this.rotateSpeed = (this.newRotate - this.rotate) / 100;
			this.rotate += this.rotateSpeed;
			
			if (this.speed < 1)
			{
				this.is_moving = false;
				this.disabled = true;
				table_cards[table_cards.length] = new Card(this.id, this.drawX, this.drawY, true, this.rotate);
			}
		}
		
		main_ctx.restore();
	}
};

Card.prototype.play = function()
{
	this.is_moving = true;
	this.newDrawX = 0 - this.width;
	this.newDrawY = original_height / 2 - this.height;
	this.newRotate = Math.round(Math.random()*20);
	this.show = true;
	this.width = this.original_width;
	this.height = this.original_height;
};
