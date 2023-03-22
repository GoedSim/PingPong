
/* Canvas and Context*/
const canvas = document.getElementById('container')
const context = canvas.getContext("2d")
sessionStorage.setItem("winner", "None");


/*Objects*/
const ball = {
    radius: 6,
    positionX: canvas.width / 2 + 6,
    positionY: canvas.height / 2 + 6,
    velocityX: 2,
    velocityY: 2,
    color: 'white'
}

const player = {
    height: 80,
    width: 8,
    positionX: 10,
    positionY: canvas.height / 2 - 80 / 2,
    color: 'blue',
    player: 'player',
    speed: 2
}

const opponentAI = {
    height: 80,
    width: 8,
    positionX: canvas.width - 20,
    positionY: canvas.height / 2 - 80 / 2,
    color: 'red',
    player: 'opponentAI',
    speed: 2
}


/*Game*/
const game = {
    playerScore: 0,
    AIScore: 0,
    turn: 0,
    topScore: 20,
    speedIncreaseHit: 3,
}

const keyPressed = {
    W: false,
    S: false,
    Up: false,
    Down: false
}

let activated = true;
let hits = 0;


/* Game Update and Draws*/
function drawplayer() {
    context.beginPath();
    context.fillStyle = player.color;
    context.rect(player.positionX, player.positionY, player.width, player.height);
    context.fill();
    context.closePath();
}

function drawopponentAI() {
    context.beginPath();
    context.fillStyle = opponentAI.color;
    context.rect(opponentAI.positionX, opponentAI.positionY, opponentAI.width, opponentAI.height);
    context.fill();
    context.closePath();
}

function drawBall() {
    context.beginPath();
    context.fillStyle = ball.color;
    context.arc(ball.positionX, ball.positionY, ball.radius, 0, Math.PI * 2);
    context.fill();
    context.closePath();
}

function drawAll() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawplayer()
    drawopponentAI()
    drawBall()
}


function resetBall() {
    ball.positionX = canvas.width / 2 + 6
    ball.positionY = canvas.height / 2 + 6

    let velocityX = ball.velocityX
    let velocityY = ball.velocityY

    ball.velocityX = 0
    ball.velocityY = 0

    setTimeout(() => {
        ball.velocityX = -velocityX
        ball.velocityY = -velocityY
    }, 1000)
}


function collisionTimeLag() {
    activated = false
    console.log('Deactivated Collision')
    setTimeout(() => {
        activated = true
        console.log('Ready For Collision')
    }, 1000)
}


function setScore() {
    if (ball.positionX > canvas.width - (opponentAI.width)) {
        game.playerScore++
        resetBall()
    } else if (ball.positionX < opponentAI.width) {
        game.AIScore++
        resetBall()
    }

    document.getElementsByClassName('player')[0].textContent = game.playerScore
    document.getElementsByClassName('opponentAI')[0].textContent = game.AIScore
}

function gameOver(){
    if(game.playerScore === game.topScore){
        console.log('Player Wins')
        sessionStorage.setItem("winner", "player");
        window.location.href = "winner.html";
        resetGame()
    }else if(game.AIScore === game.topScore){
        console.log('Opponent Wins')
        sessionStorage.setItem("winner", "AI");
        window.location.href = "winner.html";
        resetGame()
    }
}


function resetGame(){
    game.playerScore = 0
    game.AIScore = 0
    ball.positionX = 0
    ball.positionY = 0
    updateDefault()
}


function updateKeyPresses() {
    if (keyPressed['W']) {
        if (player.positionY > 0) {
            player.positionY -= player.speed;
        }
    }
    if (keyPressed['S']) {
        if (player.positionY < canvas.height - player.height) {
            player.positionY += player.speed;
        }
    }
    if (keyPressed['Up']) {
        if (player.positionY > 0) {
            player.positionY -= player.speed;
        }
    }
    if (keyPressed['Down']) {
        if (player.positionY < canvas.height - player.height) {
            player.positionY += player.speed;
        }
    }
	if (opponentAI.positionY > ball.positionY - (opponentAI.height / 1.5)) {
		if (ball.positionX < 0) opponentAI.positionY -= opponentAI.speed / 1.4;
		else opponentAI.positionY -= opponentAI.speed / 1.75;
		}
	if (opponentAI.positionY < ball.positionY - (opponentAI.height / 1.5)) {
		if (ball.velocityX < 0) opponentAI.positionY += opponentAI.speed / 1.4;
		else opponentAI.positionY += opponentAI.speed / 1.75;
		}
}

function updateStates() {
    if ((ball.positionY + ball.radius) >= canvas.height || (ball.positionY - ball.radius) <= 0) {
        ball.velocityY = -ball.velocityY;
    }

    if (
        (ball.positionX + ball.radius >= canvas.width - (opponentAI.width + 10) &&
            (ball.positionY >= opponentAI.positionY && ball.positionY <= opponentAI.positionY + opponentAI.height)) ||

        (ball.positionX - ball.radius <= (player.width + 10) &&
            (ball.positionY >= player.positionY && ball.positionY <= player.positionY + player.height))
    ) {
        if (activated) {
            hits++;
            ball.velocityX = -ball.velocityX
            collisionTimeLag()
        }
    }

    setScore()
    gameOver()

    if(hits === game.speedIncreaseHit){
        hits = 0
        ball.velocityX += 0.3
        ball.velocityY += 0.3
        player.speed += 0.25
        opponentAI.speed += 0.1

        console.log(ball.velocityX, player.speed);
    }

    ball.positionX += ball.velocityX;
    ball.positionY += ball.velocityY;
}

/*Key checks*/
document.addEventListener('keydown', (event) => {
    var name = event.key;
    var code = event.code;

    if (code === 'KeyS') {
        keyPressed['S'] = true;
    }
    if (code === 'KeyW') {
        keyPressed['W'] = true;
    }
    if (code === 'ArrowUp') {
        keyPressed['Up'] = true;
    }
    if (code === 'ArrowDown') {
        keyPressed['Down'] = true;
    }

}, false);



document.addEventListener('keyup', (event) => {
    var name = event.key;
    var code = event.code;

    if (code === 'KeyS') {
        keyPressed['S'] = false;
    }
    if (code === 'KeyW') {
        keyPressed['W'] = false;
    }
    if (code === 'ArrowUp') {
        keyPressed['Up'] = false;
    }
    if (code === 'ArrowDown') {
        keyPressed['Down'] = false;
    }

}, false);


/*Game Loop/Render */
function gameLoop() {
    updateKeyPresses()
    updateStates()
    drawAll()
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);


/*Support defaults*/
function updateDefault() {
    canvas.width = Math.min(window.innerWidth * 0.6, 800)
    canvas.height = Math.min(window.innerHeight * 0.8, 600)

    ball.positionX = canvas.width / 2 + ball.radius
    ball.positionY = canvas.height / 2 + ball.radius

    player.positionY = canvas.height / 2 - player.height / 2

    opponentAI.positionX = canvas.width - (opponentAI.width + 10)
    opponentAI.positionY = canvas.height / 2 - opponentAI.height / 2
}

function resizeHandler() {
    if (window.innerWidth < 560) {
        document.getElementsByClassName('small-device')[0].style.display = "flex";
        document.getElementsByClassName('canvas-container')[0].style.display = "none";
    } else {
        document.getElementsByClassName('small-device')[0].style.display = "none";
        document.getElementsByClassName('canvas-container')[0].style.display = "flex";
    }

    updateDefault()
}

resizeHandler()
window.addEventListener('resize', () => { resizeHandler() })