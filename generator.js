var canvas = document.getElementById("field");
var context = canvas.getContext("2d");
var pixel = 10;
var rectangles = [];

function alivePixel(x,y){
	saveRect(x,y);
	context.fillRect(x,y,pixel,pixel);
	context.stroke();
}

function deathPixel(x,y){
	rectangles = rectangles.filter(function(rect){ return !(rect["x"] === x && rect["y"] === y); });
	context.fillStyle="white";
	context.fillRect(x,y,pixel,pixel);
	context.stroke();
	context.fillStyle="#000000";
}


function saveRect(x,y){
	rectangles.push({x:x,y:y});
}

function isRect(x,y){
	if( x < 0 || x > canvas.width || y < 0 || y > canvas.height) return false;
	var rect = rectangles.filter(function(rect){ return (rect["x"] === x && rect["y"] === y); });
	if(rect.length) return true;
	return false;
}

function mayorityRule(x,y){
		return isRect(x - pixel,y - pixel) + isRect(x,y - pixel) + isRect(x + pixel,y - pixel) + isRect(x - pixel,y) + isRect(x,y) 
				+ isRect(x + pixel,y) + isRect(x - pixel,y + pixel) + isRect(x,y + pixel) + isRect(x + pixel,y + pixel);
}

function emptyGrid(){
	rectangles = [];
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (var x = 0; x <= canvas.width; x += pixel) {
		context.moveTo(x, 0);
		context.lineTo(x,canvas.height);
	}

	for (var y = 0; y <= canvas.height; y += pixel) {
	  context.moveTo(0, y);
	  context.lineTo(canvas.width,y);
	}
	
	context.strokeStyle = "#BEBEBE";
	context.stroke();
}

function randomBase(){
	emptyGrid();
	var RN;
	rectangles = [];
	for(var i = 0; i <= canvas.height ; i+= pixel){
		for(var j = 0; j <= canvas.width ; j += pixel){
			RN = Math.random();
			//console.log("here");
			if(RN >= 0.5){
				alivePixel(j,i);
			}
		}
	}
}

function step(){
	for(var i = 0; i <= canvas.height ; i+= pixel){
		for(var j = 0; j <= canvas.width ; j += pixel){
			var mayority = mayorityRule(j,i);
			if(mayority <= 4){
				deathPixel(j,i);
			}else{
				if(!isRect(j,i))
					alivePixel(j,i);
			}
		}
	}
}

function run(){
	var rectsInGrid = 0;
	while(rectsInGrid !== rectangles.length){
		//console.log(rectsInGrid,"!=",rectangles.length);
		rectsInGrid = rectangles.length;
		step();
	}
}

emptyGrid();