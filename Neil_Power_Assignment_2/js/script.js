/*
    Project: Assignment 2
    Name: Neil Power
    Student Number: 991588032
    Class: INFO16206
    School: Sheridan College
    Professor: Md Nour Hossain
    Date: March 19, 2022
*/

//Obtain canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Sounds
const hitSound = new Audio('../sounds/hitSound.wav');
const scoreSound = new Audio('../sounds/scoreSound.wav');
const wallHitSound = new Audio('../sounds/wallHitSound.wav');

//Variables
const netWidth = 8;
const netHeight = canvas.height;

const paddleWidth = 5;
const paddleHeight = 90;

let upArrowPressed = false;
let downArrowPressed = false;

//Net Object
const net = {
    x: canvas.width / 2 - netWidth / 2,
    y: 0,
    width: netWidth,
    height: netHeight,
    color: "#b528d4"
};

//User Paddle Object
const user = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#00FFFF',
    score: 0,
    scoreText: "User SCORE!"
};

//AI Paddle Object
const ai = {
    x: canvas.width - (paddleWidth + 10),
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FF0000',
    score: 0,
    scoreText: "AI SCORE!"
};
    
//Ball Object
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 7,
    speed: 7,
    velocityX: 5,
    velocityY: 5,
    color: '#3cf33f'
};

//Draw Functions
function drawNet() {
    ctx.fillStyle = net.color;
    ctx.fillRect(net.x, net.y, net.width, net.height);
}

function drawScore(x, y, score) {
    ctx.fillStyle = '#fe217f';
    ctx.font = 'bold 60px serif';
    ctx.fillText(score, x, y);
}

function drawMessage(x, y, message) {
    ctx.fillStyle = '#fe217f';
    ctx.font = '50px Arial';
    ctx.fillText(message, x, y);
}
    
function drawPaddle(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

//Paddle Up and Down Arrow Movement Functions
window.addEventListener('keydown', keyDownHandler);
window.addEventListener('keyup', keyUpHandler);

function keyDownHandler(event) {
    switch (event.keyCode){
        case 38:
            upArrowPressed = true;
            break;
        case 40:
            downArrowPressed = true;
            break;
    }
}

function keyUpHandler(event) {
    switch (event.keyCode){
        case 38:
            upArrowPressed = false;
            break;
        case 40:
            downArrowPressed = false;
            break;
    }
}

//Reset ball
function reset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 7;
    ball.velocityX = -ball.velocityX;
    ball.velocityY = -ball.velocityY;
}

//Collision detection function
function collisionDetect(player, ball) {
    player.top = player.y;
    player.right = player.x + player.width;
    player.bottom = player.y + player.height;
    player.left = player.x;
  
    ball.top = ball.y - ball.radius;
    ball.right = ball.x + ball.radius;
    ball.bottom = ball.y + ball.radius;
    ball.left = ball.x - ball.radius;
  
    return ball.left < player.right && ball.top < player.bottom && ball.right > player.left && ball.bottom > player.top;
}

function update() {
    //move paddle
    if (upArrowPressed && user.y > 0) {
        user.y -= 8;
    } else if (downArrowPressed && (user.y < canvas.height - user.height)){
        user.y += 8;
    }

    //check if ball hits top or bottom wall
    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        // play wallHitSound
        wallHitSound.play();
        ball.velocityY = -ball.velocityY;
    }
    
    //when ball hits right wall
    if (ball.x + ball.radius >= canvas.width) {
        scoreSound.play();
        user.score += 1;
        drawMessage(2 * canvas.width / 6, 2 * canvas.height / 6, user.scoreText);
        reset();
    }
    
    //when ball hits left wall
    if (ball.x - ball.radius <= 0) {
        scoreSound.play();
        ai.score += 1;
        drawMessage(5 * canvas.width / 6, 2 * canvas.height / 6, ai.scoreText);
        reset();
    }

    //move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    //AI paddle movement
    ai.y += ((ball.y - (ai.y + ai.height / 2))) * 0.09;

    //collision detection on paddles
    let player = (ball.x < canvas.width / 2) ? user : ai;

    if (collisionDetect(player, ball)) {
        // play hitSound
        hitSound.play();
        // default angle is 0deg in Radian
        let angle = 0;

        // if ball hit the top of paddle
        if (ball.y < (player.y + player.height / 2)) {
        // then -1 * Math.PI / 4 = -45deg
            angle = -1 * Math.PI / 4;
        } else if (ball.y > (player.y + player.height / 2)) {
        // if it hit the bottom of paddle
        // then angle will be Math.PI / 4 = 45deg
            angle = Math.PI / 4;
        }

        /* change velocity of ball according to on which paddle the ball hitted */
        ball.velocityX = (player === user ? 1 : -1) * ball.speed * Math.cos(angle);
        ball.velocityY = ball.speed * Math.sin(angle);

        // increase ball speed
        ball.speed += 0.2;
    }

    //Check total scores
    if(user.score >= 20) {
        alert("User WINS!");
    }

    if(ai.score >= 20) {
        alert("AI WINS... Respect our machine overlords")
    }
}

function render() {
    ctx.fillStyle = "#202245";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    //Display Net
    drawNet();
    //Display User and AI Scores and Paddles
    drawScore(2 * canvas.width / 6, 5.5 * canvas.height / 6, user.score);
    drawScore(3.8 * canvas.width / 6, 5.5 * canvas.height / 6, ai.score);
    drawPaddle(user.x, user.y, user.width, user.height, user.color);
    drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color);
    //Display Ball
    drawBall(ball.x, ball.y, ball.radius, ball.color);
}

//Game Loop function
function gameLoop() {
    update();
    render();
}

setInterval(gameLoop, 1000 / 60);


