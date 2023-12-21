window.addEventListener('load', function() {
    const bodyContainer = document.querySelector('.bodyContainer');
    const snakeBoard = document.querySelector('.snakeBoard');


    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    bodyContainer.style.minHeight = viewportHeight + 'px';
    bodyContainer.style.minWidth = viewportWidth + 'px';

    snakeBoard.style.minHeight = viewportHeight + 'px';
  
});


// Check if the browser is Chrome
//Thats hardcoated width, you can built your logic to change dynamically and also you can change according to your device, i mostly use chrome and firefox thats why i set width according to my chrome browser..

if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
    const chromeImage = document.querySelector('.snakeBoard');
    chromeImage.style.minWidth = '781x'; // Set different width for Chrome
} else {
    const otherBrowsersImage = document.querySelector('.snakeBoard');
    otherBrowsersImage.style.width = '781px'; // Set different width for other browsers
}


//Here from the real logic of game start, you can skip above portion and play with css, html & js according to yourself 


//constants and variables used in project
let inputDirection = {x: 0, y: 0};

const foodSound = new Audio ("../music/foodSound.mp3");
const gameOverSound = new Audio ("../music/gameOverSound.mp3");
const moveSound = new Audio ("../music/movesound.mp3");
const gameMusic = new Audio ("../music/gameMusic.mp3");

let speed = 10;
let lastPaintime = 0;

let snakeArray = [
    {
        x: 10,
        y: 10,
    }
]

let food = {
    x: 5,
    y: 5,
}

let score = 0;

//Functions used in game
function main(currentTime) {
        window.requestAnimationFrame(main);
        
        if((currentTime - lastPaintime)/1000 < 1/speed){
            return;
        }
        lastPaintime = currentTime;
        gameEngine();
}

function isCollisionOccur(snake) {
    // If snake bump into snake 
    for (let i = 1; i < snakeArray.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If snake bump into the snakeboard wall
    if(snake[0].x >= 20 || snake[0].x <=0 || snake[0].y >= 20 || snake[0].y <=0){
        return true;
    }
        
    return false;
    
}

function gameEngine() {
   

    //If collision occur between snakehead and snake body segments or between snakehead and wall..

    if(isCollisionOccur(snakeArray)){
        gameOverSound.play();
        gameMusic.pause();
        inputDirection = {x: 0, y: 0};
        alert("Game Over! Press any key to continue..");
        snakeArray = [
            {
                x: 10,
                y: 10,
            }
        ]
        musicSound.play();
        score = 0;
        
    }

    //Logic to Update Snake Array and Snake Food
    //If you eat food, then regenerate food again and place it in snake board again and add one more segment to snake body

    if(snakeArray[0].x ===food.x && snakeArray[0].y ===food.y){
        foodSound.play();

        //If snake eat food then update score

        score += 1;
        if(score>highScore){
            highScore = score;
            localStorage.setItem("highScore", JSON.stringify(highScore));
            let highScoreContainer = document.querySelector('.highScoreContainer');
            highScoreContainer.innerHTML = "HiScore: " + highScore;
        }
        let scoreContainer = document.querySelector('.scoreContainer');
        scoreContainer.innerHTML = `Score ${score}`;

        //Logic to add segment in snake body if food is eaten by snake

        snakeArray.unshift({x:snakeArray[0].x + inputDirection.x, y:snakeArray[0].y + inputDirection.y})
        let a = 2;
        let b = 18;

        //Logic to Generate food inside the grid

        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }


    //Logic to move the snake

    for (let i = snakeArray.length -2; i >= 0; i--) {
            snakeArray[i+1] = {...snakeArray[i]}
    }
    snakeArray[0].x += inputDirection.x;
    snakeArray[0].y += inputDirection.y;


    //Logic to Display the Snake and Food

    //Logic to Display Snake head and its body segments in Snakeboard/grid

    snakeBoard = document.querySelector(".snakeBoard");
    snakeBoard.innerHTML = "";
    snakeArray.forEach((e, i)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if(i === 0){
            snakeElement.classList.add('snakeHead');
        }

        else if (i === snakeArray.length - 1) {
            snakeElement.classList.add('snakeTail');
        }

        else{
            snakeElement.classList.add('snakeBody');
        }

        snakeBoard.appendChild(snakeElement);
    });

    //Logic to Display Food as an element in snakeboard/grid

        foodElement = document.createElement('div');
        foodElement.style.gridRowStart = food.y;
        foodElement.style.gridColumnStart = food.x;
        foodElement.classList.add('food');
        snakeBoard.appendChild(foodElement);
}


//Logic building where i used requestAnimation frame to render my game animation interface

window.requestAnimationFrame(main);

//Logic to store score in local storage

let highScore = localStorage.getItem("highScore");
if(highScore === null){
    highScore = 0;
    localStorage.setItem("highScore", JSON.stringify(highScore))
}
else{
    highScore = JSON.parse(highScore);
    let highScoreContainer = document.querySelector('.highScoreContainer');
    highScoreContainer.innerHTML = "High Score:" + highScore;
}


//Logic for keyboard events
let arrowUpPressed = false;
let arrowDownPressed = false;
let arrowLeftPressed = false;
let arrowRightPressed = false;

window.addEventListener('keydown', e => {
    moveSound.play();
    gameMusic.play();

    switch (e.key) {
        case "ArrowUp":
            console.log('Arrow up');
            //check if arrowDownPressed is false
            if (!arrowDownPressed) {
                inputDirection.x = 0;
                inputDirection.y = -1;
                arrowUpPressed = true;
                arrowDownPressed = false;
                arrowLeftPressed = false;
                arrowRightPressed = false;
            }
            break;

        case "ArrowDown":
            console.log('Arrow down');
             //check if arrowUpPressed is false
            if (!arrowUpPressed) {
                inputDirection.x = 0;
                inputDirection.y = 1;
                arrowUpPressed = false;
                arrowDownPressed = true;
                arrowLeftPressed = false;
                arrowRightPressed = false;
            }
            break;

        case "ArrowLeft":
            console.log('Arrow Left');
             //check if arrowRightPressed is false
            if (!arrowRightPressed) {
                inputDirection.x = -1;
                inputDirection.y = 0;
                arrowUpPressed = false;
                arrowDownPressed = false;
                arrowLeftPressed = true;
                arrowRightPressed = false;
            }
            break;

        case "ArrowRight":
            console.log('Arrow Right');
            //check if arrowLeftPressed is false
            if (!arrowLeftPressed) {
                inputDirection.x = 1;
                inputDirection.y = 0;
                arrowUpPressed = false;
                arrowDownPressed = false;
                arrowLeftPressed = false;
                arrowRightPressed = true;
            }
            break;

        default:
            break;
    }
});

//Author Hamza (gitdapper)
