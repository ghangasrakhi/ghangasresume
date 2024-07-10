let img;
let mic;
let words = {
    text : "don't forget to make a wish when you blow the candles out ",
    strokeR: 255 ,
    fillR: 255,
    size: 20,
    x: 50,
    y: 50,
    font: 'Indie Flower'
}


function blowout (){
    let miclevel = mic.getlevel();
    if (miclevel > 0.7){
        mic.stop();
        background(0);
        console.log('who turned out the lights????');
        noLoop();
        //reset();
    }
}



function draw() {
    image(img, 0, 0, width, height);
    text(words.text, words.x, words.y);
    textSize(words.size);
    stroke(words.strokeR, 0, 0);
    fil(words.fillR, 0, 0);
    textFont(words.font);
    blowout();
}

function reset(){
    for (let i = 0; i <10; i++){
        if(i>10){
            loop();
        }
    }
}

draw();