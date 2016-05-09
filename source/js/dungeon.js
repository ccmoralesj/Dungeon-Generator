/**
 * Created by ccmoralesj on 6/05/16.
 */
/*const canvas = document.getElementById("field");
const canvas_width = canvas.width;
const canvas_height = canvas.height;
const context = canvas.getContext("2d");
const pixel = 10;*/
class Dungeon {
    constructor(posX, posY, rectangles) {
        "use strict";
        this.posX = posX || 0;
        this.posY = posY || 0;
        this.rectangles = rectangles || [];
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

    emptyGrid() {
        this.rectangles = [];
        this.posX = 0;
        this.posY = 0;
        context.clearRect(0, 0, canvas_width, canvas_height);
        Dungeon.setPercentage(0);
    }

    static randomBase() {
        "use strict";
        if(can.posY <= canvas_height){
            //console.log("here","("+can.posX+","+can.posY+")");
            console.log("here");
            let RN;
            RN = Math.random();
            if(RN >= 0.5){
                can.saveRect(can.posX,can.posY);
                Dungeon.alivePixel(can.posX,can.posY);
            }

            if(can.posX <= canvas_width ){
                if(can.posX == canvas_width){
                    can.posY += pixel;
                    can.posX = 0;
                }else{
                    can.posX += pixel;
                }
                requestAnimationFrame(Dungeon.randomBase);
            }else if (can.posY <= canvas_height){
                can.posX = 0;
                can.posY += pixel;
                requestAnimationFrame(Dungeon.randomBase);
            }
        }
    }

    static setPercentage(percentage){
        "use strict";
        let percentageBar = document.getElementById("percentage_bar");
        percentageBar.style.width = percentage + "%";
    }

    step() {
        for (let i = 0; i <= canvas_height; i += pixel) {
            for (let j = 0; j <= canvas_width; j += pixel) {
                let mayority = this.majorityRule(j, i);
                if (mayority <= 4) {
                    this.erasePixel(j, i);
                } else {
                    if (!this.isRect(j, i))
                        this.saveRect(j, i);
                }
            }
        }
    }

    run(){
        let percentage, diff,rectsInGrid = 0;
        diff = 0;
        while(rectsInGrid !== rectangles.length){
            rectsInGrid = rectangles.length;
            this.step();

            // Percentage of the dungeon generator process
            diff = Math.abs(rectsInGrid - rectangles.length);
            percentage = (100 - (diff/rectangles.length) * 100);
            Dungeon.setPercentage(percentage);
            //----------------------------------------------
        }

        drawDungeon();
    }

    static drawDungeon(){
        "use strict";
        for(let i = 0; i <= canvas_height ; i+= pixel){
            for(let j = 0; j <= canvas_width ; j += pixel){
                if(isRect(j,i))
                    Dungeon.alivePixel(j,i);
                else
                    Dungeon.deathPixel(j,i);
            }
        }
    }

    static initDungeon(){
        "use strict";
        can.emptyGrid();
        requestAnimationFrame(Dungeon.randomBase);
    }
}

var can = new Dungeon();