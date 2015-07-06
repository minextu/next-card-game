function Camera(no_focus)
{
	this.drawX = 0;
	this.drawY = 0;
	this.horizontal_camera_speed = 0.07;
	this.vertical_camera_speed = 0.07;
	
		
	if (no_focus == true)
		this.use_focus = false;
	else
	{
		this.use_focus = true;
		this.focus = "player";
	}
	
	if (this.focus == "player")
	{
		this.drawX = original_width / 2 - player.drawX;
		this.drawY = original_height / 2 - player.drawY;
	}
	
	this.zoom = 1;
	this.new_zoom = 1;
	this.zoom_speed = 0.5;
}
Camera.prototype.pre = function()
{
	this.move();
	
	main_ctx.save();
	main_ctx.translate((original_width / 2).ratio(0), (original_height / 2).ratio(1));
	main_ctx.scale(camera.zoom, camera.zoom);  
	main_ctx.translate(-(original_width / 2).ratio(0), -(original_height / 2).ratio(1));
	main_ctx.translate(this.drawX.ratio(0),this.drawY.ratio(1));
};
Camera.prototype.post = function()
{
	main_ctx.restore();
};
Camera.prototype.move = function()
{
	if (this.zoom != this.new_zoom)
	{
		if (this.zoom > this.new_zoom)
	  	{
	    	this.tmp_zoom_speed = (this.zoom - this.new_zoom) / 15;
			this.tmp_zoom_speed = this.tmp_zoom_speed / 1 * this.zoom_speed;
	   		this.zoom -= this.tmp_zoom_speed.speed();
	  	}
		else
	  	{
	   		this.tmp_zoom_speed = (this.new_zoom - this.zoom) / 15;
			this.tmp_zoom_speed = this.tmp_zoom_speed / 1 * this.zoom_speed;
	    	this.zoom += this.tmp_zoom_speed.speed();
	  	}
 	}
	if (this.new_zoom < 0.1)
	 	this.new_zoom = 0.1;
	//else if (this.new_zoom > 2.8)
		//this.new_zoom = 2.8;

	if (this.focus == "player" && this.use_focus)
	{
		this.focus_drawX = player.drawX;
		this.focus_drawY = player.drawY;
		this.focus_width = player.width;
		this.focus_height = player.height;
	}
				
	if (this.use_focus == true)
	{
		this.horizontal_camera_speed_left = Math.round(((this.drawX*(-1) + original_width / 2 - this.focus_width / 2)  - this.focus_drawX) * this.horizontal_camera_speed / this.zoom);
		this.horizontal_camera_speed_right = Math.round((this.focus_drawX - (this.drawX*(-1) + original_width / 2 - this.focus_width / 2) )* this.horizontal_camera_speed / this.zoom);
	}
	else
	{
		this.horizontal_camera_speed_left = 15/this.zoom;
		this.horizontal_camera_speed_right = 15 / this.zoom;
	}

	if (this.use_focus == false)	
	{
		this.vertical_camera_speed_up = 15/this.zoom;
		this.vertical_camera_speed_down = 15/this.zoom;
	}
	else
	 {
		this.vertical_camera_speed_down = Math.round(((this.drawY*(-1) + original_height / 2 - this.focus_height / 2)  - this.focus_drawY) * this.vertical_camera_speed / this.zoom);
		this.vertical_camera_speed_up = Math.round((this.focus_drawY - (this.drawY*(-1) + original_height / 2 - this.focus_height / 2) ) * this.vertical_camera_speed / this.zoom);
	}
		 
	this.movex = "none";
	this.movey = "none";
		  
	if (this.use_focus == false && is_leftkey || this.focus_drawX < (this.drawX*(-1) + original_width / 2 - this.focus_width / 2)  && this.use_focus)
		this.movex = "plus";
	 else if (this.use_focus == false && is_rightkey || this.focus_drawX > (this.drawX*(-1) + original_width / 2 - this.focus_width / 2)  && this.use_focus)
		this.movex = "minus";
		 
	if (this.use_focus == false && is_upkey == true || this.focus_drawY < (this.drawY*(-1) + original_height / 2 - this.focus_height / 2)  && this.use_focus)
		this.movey = "plus";
	else if (this.use_focus == false && is_downkey == true || this.focus_drawY > (this.drawY*(-1) + original_height / 2 - this.focus_height / 2)  && this.use_focus)
		this.movey = "minus";

		  
	if (this.movex != "none")
	{
		if (this.movex == "plus")
			this.drawX += this.horizontal_camera_speed_left.speed();
		else if (this.movex == "minus")
			this.drawX -= this.horizontal_camera_speed_right.speed();
	}
		    
	if (this.movey != "none")
	{
		if (this.movey == "plus" )
			this.drawY += this.vertical_camera_speed_down.speed();
		 else if (this.movey == "minus" )
			this.drawY -= this.vertical_camera_speed_up.speed();
	}
	

	this.zoom = Math.round(this.zoom * 100) /100;
		
		
	/*if (is_editor == true && !is_menu)
	{
		if (this.movex != "none" || this.movey != "none")
			editor_mouse(mouseX, mouseY, "move");
	}*/
};