/**
 * Created by ccmoralesj on 6/05/16.
 */
const canvas = document.getElementById("field");
const canvas_width = canvas.width;
const canvas_height = canvas.height;
const context = canvas.getContext("2d");
const pixel = 15;
const FPS = 1000/1000;
var dungeon;

class Dungeon {
    constructor(posX, posY, rectangles) {
        "use strict";
        this.posX = posX || 0;
        this.posY = posY || 0;
        this.rectangles = rectangles || [];
        this.auxRectangles = rectangles || [];
    }

    static alivePixel(x, y) {
        context.fillStyle = "#01579B"; // Dark Blue
        //context.fillStyle = "#3E2723"; // Dark Brown
        context.fillRect(x, y, pixel, pixel);
        context.stroke();
    }

    static deathPixel(x, y) {
        context.fillStyle = "white";
        context.fillRect(x, y, pixel, pixel);
        context.stroke();
        context.fillStyle = "#000000";
    }

    saveRect(x, y) {
        this.rectangles.push({x: x, y: y});
    }

    erasePixel(x,y){
        "use strict";
        this.rectangles = this.rectangles.filter(function(rect){ return !(rect["x"] === x && rect["y"] === y);});
    }

    isRect(x, y) {
        if (x < 0 || x > canvas_width || y < 0 || y > canvas_height) return true;
        let rect = this.rectangles.filter(function (rect) {
            return (rect["x"] === x && rect["y"] === y);
        });

        return (rect.length) ? true : false;
    }

    majorityRule(x, y) {
        return this.isRect(x - pixel, y - pixel) + this.isRect(x, y - pixel) + this.isRect(x + pixel, y - pixel) +
            this.isRect(x - pixel, y) + this.isRect(x, y) + this.isRect(x + pixel, y) + this.isRect(x - pixel, y + pixel) +
            this.isRect(x, y + pixel) + this.isRect(x + pixel, y + pixel);
    }

    static emptyGrid() {
        dungeon = new Dungeon();
        context.clearRect(0, 0, canvas_width, canvas_height);

        Dungeon.setPercentage(0);

        context.strokeStyle = "#E1F5FE"; // Light blue
        //context.strokeStyle = "#EFEBE9"; // Light brown
        for (let x = 0; x <= canvas.width; x += pixel) {
            context.moveTo(x, 0);
            context.lineTo(x,canvas.height);
        }

        for (let y = 0; y <= canvas.height; y += pixel) {
            context.moveTo(0, y);
            context.lineTo(canvas.width,y);
        }

        context.stroke();
    }

    static randomBase() {
        "use strict";
        if(dungeon.posY <= canvas_height){
            //console.log("here","("+dungeon.posX+","+dungeon.posY+")");
            //console.log("here");
            let RN;
            RN = Math.random();
            if(RN >= 0.5){
                dungeon.saveRect(dungeon.posX,dungeon.posY);
                Dungeon.alivePixel(dungeon.posX,dungeon.posY);
            }

            if(dungeon.posX <= canvas_width ){
                if(dungeon.posX == canvas_width){
                    dungeon.posY += pixel;
                    dungeon.posX = 0;
                }else{
                    dungeon.posX += pixel;
                }
                setTimeout(Dungeon.randomBase,FPS);
            }else if (dungeon.posY <= canvas_height){
                dungeon.posX = 0;
                dungeon.posY += pixel;
                setTimeout(Dungeon.randomBase,FPS);
            }
        }
    }

    static setPercentage(percentage){
        "use strict";
        let percentageBar = document.getElementById("percentage_bar");
        let percentageNum = document.getElementById("percentage_num");
        percentageBar.style.width = percentage + "%";
        percentageNum.innerText = percentage + "%";
    }

    static realTimeStep(){
        "use strict";
        let percentage, diff;

        if(dungeon.posY <= canvas_height){
            //console.log("here","("+dungeon.posX+","+dungeon.posY+")");
            //console.log("here");
            let mayority = dungeon.majorityRule(dungeon.posX, dungeon.posY);

            if (mayority <= 4) {
                //dungeon.erasePixel(dungeon.posX, dungeon.posY);
                Dungeon.deathPixel(dungeon.posX, dungeon.posY);
            } else {
                dungeon.auxRectangles.push({x: dungeon.posX, y: dungeon.posY});
                if (!dungeon.isRect(dungeon.posX, dungeon.posY)){
                    Dungeon.alivePixel(dungeon.posX, dungeon.posY);
                }
            }

            if(dungeon.posX == canvas_width && dungeon.posY == canvas_height){
                //console.log("This is the last");
                //console.log("here","("+dungeon.posX+","+dungeon.posY+")");
                //console.log(dungeon.auxRectangles.length +"!=="+ dungeon.rectangles.length);

                // Percentage of the dungeon generator process
                diff = Math.abs(dungeon.auxRectangles.length - dungeon.rectangles.length);
                percentage = (100 - (diff/dungeon.rectangles.length) * 100);
                Dungeon.setPercentage(percentage);

                if(dungeon.auxRectangles.length !== dungeon.rectangles.length){
                    dungeon.posX = -pixel;
                    dungeon.posY = 0;
                    dungeon.rectangles = dungeon.auxRectangles.slice();
                    dungeon.auxRectangles = [];
                }
            }

            if(dungeon.posX <= canvas_width ){
                if(dungeon.posX == canvas_width){
                    dungeon.posY += pixel;
                    dungeon.posX = 0;
                }else{
                    dungeon.posX += pixel;
                }

                setTimeout(Dungeon.realTimeStep,FPS);
            }else if (dungeon.posY <= canvas_height){
                dungeon.posX = 0;
                dungeon.posY += pixel;

                setTimeout(Dungeon.realTimeStep,FPS);
            }
        }
    }
    static run(){
        dungeon.posX = 0;
        dungeon.posY = 0;
        setTimeout(Dungeon.realTimeStep,FPS);
    }

    static initDungeon(){
        "use strict";
        Dungeon.emptyGrid();
        setTimeout(Dungeon.randomBase,FPS);
    }
}