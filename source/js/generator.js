const canvas = document.getElementById("field");
const context = canvas.getContext("2d");
const pixel = 20;
var rectangles = [];

function alivePixel(x,y){
	context.fillRect(x,y,pixel,pixel);
	context.stroke();
}

function deathPixel(x,y){
	context.fillStyle="white";
	context.fillRect(x,y,pixel,pixel);
	context.stroke();
	context.fillStyle="#000000";
}


function saveRect(x,y){
	rectangles.push({x:x,y:y});
}

function erasePixel(x,y){
    "use strict";
    rectangles = rectangles.filter(function(rect){ return !(rect["x"] === x && rect["y"] === y); });
}

function isRect(x,y){
	if( x < 0 || x > canvas.width || y < 0 || y > canvas.height) return true;
	var rect = rectangles.filter(function(rect){ return (rect["x"] === x && rect["y"] === y); });

    return (rect.length)? true : false;
}

function mayorityRule(x,y){
		return isRect(x - pixel,y - pixel) + isRect(x,y - pixel) + isRect(x + pixel,y - pixel) + isRect(x - pixel,y) + isRect(x,y) 
				+ isRect(x + pixel,y) + isRect(x - pixel,y + pixel) + isRect(x,y + pixel) + isRect(x + pixel,y + pixel);
}

function emptyGrid(){
	rectangles = [];
	context.clearRect(0, 0, canvas.width, canvas.height);
	for (let x = 0; x <= canvas.width; x += pixel) {
		context.moveTo(x, 0);
		context.lineTo(x,canvas.height);
	}

	for (let y = 0; y <= canvas.height; y += pixel) {
	  context.moveTo(0, y);
	  context.lineTo(canvas.width,y);
	}
	
	context.strokeStyle = "#BEBEBE";
	context.stroke();
}

function randomBase(){
	emptyGrid();
	let RN;
	rectangles = [];
	for(let i = 0; i <= canvas.height ; i+= pixel){
		for(let j = 0; j <= canvas.width ; j += pixel){
			RN = Math.random();
			//console.log("here");
			if(RN >= 0.5){
				saveRect(j,i);
                alivePixel(j,i);
			}
		}
	}
}

function step(){
	for(let i = 0; i <= canvas.height ; i+= pixel){
		for(let j = 0; j <= canvas.width ; j += pixel){
			let mayority = mayorityRule(j,i);
			if(mayority <= 4){
				erasePixel(j,i);
			}else{
				if(!isRect(j,i))
					saveRect(j,i);
			}
		}
	}
}

function run(){
	var rectsInGrid = 0;
	while(rectsInGrid !== rectangles.length){
		console.log(rectsInGrid,"!=",rectangles.length);
		rectsInGrid = rectangles.length;
		step();
	}
    drawDungeon();
}

function drawDungeon(){
    "use strict";
    for(let i = 0; i <= canvas.height ; i+= pixel){
        for(let j = 0; j <= canvas.width ; j += pixel){
            if(isRect(j,i))
                alivePixel(j,i);
            else
                deathPixel(j,i);
        }
    }
}

emptyGrid();