const canvas = document.getElementById("field");
const canvas_width = canvas.width;
const canvas_height = canvas.height;
const context = canvas.getContext("2d");
const pixel = 15;
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
    rectangles = rectangles.filter(function(rect){ return !(rect["x"] === x && rect["y"] === y);});
}

function isRect(x,y){
	if( x < 0 || x > canvas_width || y < 0 || y > canvas_height) return true;
	var rect = rectangles.filter(function(rect){ return (rect["x"] === x && rect["y"] === y); });

    return (rect.length)? true : false;
}

function majorityRule(x,y){
		return isRect(x - pixel,y - pixel) + isRect(x,y - pixel) + isRect(x + pixel,y - pixel) + isRect(x - pixel,y) + isRect(x,y) 
				+ isRect(x + pixel,y) + isRect(x - pixel,y + pixel) + isRect(x,y + pixel) + isRect(x + pixel,y + pixel);
}

function emptyGrid(){
	rectangles = [];
	context.clearRect(0, 0, canvas_width, canvas_height);
    setPercentage(0);
}

function randomBase(){
	emptyGrid();
	let RN;
	for(let i = 0; i <= canvas_height ; i+= pixel){
		for(let j = 0; j <= canvas_width ; j += pixel){
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
	for(let i = 0; i <= canvas_height ; i+= pixel){
		for(let j = 0; j <= canvas_width ; j += pixel){
			let mayority = majorityRule(j,i);
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
	let percentage, diff,rectsInGrid = 0;
    diff = 0;
	while(rectsInGrid !== rectangles.length){
		rectsInGrid = rectangles.length;
		step();

		// Percentage of the dungeon generator process
		diff = Math.abs(rectsInGrid - rectangles.length);
		percentage = (100 - (diff/rectangles.length) * 100);
		setPercentage(percentage);
		//----------------------------------------------
    }

    drawDungeon();
}

function drawDungeon(){
    "use strict";
    for(let i = 0; i <= canvas_height ; i+= pixel){
        for(let j = 0; j <= canvas_width ; j += pixel){
            if(isRect(j,i))
                alivePixel(j,i);
            else
                deathPixel(j,i);
        }
    }
}

function setPercentage(percentage){
	"use strict";
	let percentageBar = document.getElementById("percentage_bar");
	percentageBar.style.width = percentage + "%";
}

function fillingCanvas() {
    "use strict";
    //alivePixel(50,50);
    document.getElementsByClassName("row")[1].innerHTML += "<div>Hola</div>";
    requestAnimationFrame(fillingCanvas);
}

function fillG(){
    "use strict";
    requestAnimationFrame(fillingCanvas);
}