const canvas = document.getElementById('pingpong');
const ctx = canvas.getContext('2d');
canvas.style.border = '2px solid #fff';
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const PADDLE_X = (canvas.width - PADDLE_WIDTH) / 2;
const PADDLE_Y = canvas.height - PADDLE_HEIGHT - PADDLE_MARGIN_BOTTOM;
let LIFE = 10;
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
let GAME_OVER = false;
const MAX_LEVEL = 6;
const BALL_RADIUS = 10;


const paddle = {
    x: PADDLE_X,
    y: PADDLE_Y,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5,
}

const key = {
    key1: keyleft = false,
    key2: keyright = false,

}
function drawPaddle() {
    ctx.fillStyle = '#0095DD';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.strokeStyle = '#00Ff';
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}




document.addEventListener('keydown', function (event) {
    if (event.keyCode === 37) {
        key.keyleft = true;
    }
    else if (event.keyCode === 39) {
        key.keyright = true;
    }

});
document.addEventListener('keyup', function (event) {
    if (event.keyCode === 37) {
        key.keyleft = false;
    }
    else if (event.keyCode === 39) {
        key.keyright = false;
    }
});

// move paddle
function movePaddle() {
    keyleft = key.keyleft;
    keyright = key.keyright;
    if (keyleft && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
    else if (keyright && paddle.x < canvas.width - paddle.width) {
        paddle.x += paddle.dx;
    }
}

const ball = {
    x: canvas.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3,
}
const ball2 = {
    x: canvas.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3,
    created: false,
}
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.strokeStyle = '#00Ff';
    ctx.stroke();
    ctx.closePath();
}
function drawBall2() {
    if (ball2.created) {
        ctx.beginPath();
        ctx.arc(ball2.x, ball2.y, ball2.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.strokeStyle = '#00Ff';
        ctx.stroke();
        ctx.closePath();
    }
}


// reset ball
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

function resetBall2() {
    ball2.x = canvas.width / 2;
    ball2.y = paddle.y - BALL_RADIUS;
    ball2.dx = 3 * (Math.random() * 2 - 1);
    ball2.dy = -3;
}
// ball wall collision
function ballWallCollision() {
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
    }
    if (ball.y + ball.radius > canvas.height && ball2.created == false) {
        ball.dy = -ball.dy;
        LIFE--;
        resetBall();
        if (LIFE === 0) {
            alert('Game Over');
            location.reload();
        }
    }
    if (ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
    }
    if (ball.y + ball.radius > canvas.height || ball2.y + ball2.radius > canvas.height && ball2.created) {
        ball.dy = -ball.dy;
        LIFE--;
        resetBall();
        resetBall2();
        if (LIFE === 0) {
            alert('Game Over');
            location.reload();
        }
    }

}
function ballWallCollision2() {
    if (ball2.x + ball2.radius > canvas.width || ball2.x - ball2.radius < 0) {
        ball2.dx = -ball2.dx;
    }
    if (ball.y + ball.radius > canvas.height && ball2.y + ball2.radius > canvas.height) {
        ball2.dy = -ball2.dy;
        LIFE--;
        resetBall();
        resetBall2();
        if (LIFE === 0) {
            alert('Game Over');
            location.reload();
        }
    }
    if (ball2.y - ball2.radius < 0) {
        ball2.dy = -ball2.dy;
    }
}
// draw barrier



// ball paddle collision
function ballPaddleCollision() {
    var x = paddle.x;
    if (ball.x + ball.radius > x && ball.x - ball.radius < x + paddle.width && ball.y + ball.radius > paddle.y && ball.y - ball.radius < paddle.y + paddle.height) {
        // ball.dy = -ball.dy;
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width / 2);

        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI / 3;


        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = - ball.speed * Math.cos(angle);
    }
}
function ballPaddleCollision2() {
    var x = paddle.x;
    if (ball2.x + ball2.radius > x && ball2.x - ball2.radius < x + paddle.width && ball2.y + ball2.radius > paddle.y && ball2.y - ball2.radius < paddle.y + paddle.height) {
        // ball2.dy = -ball2.dy;
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        // NORMALIZE THE VALUES
        collidePoint = collidePoint / (paddle.width / 2);

        // CALCULATE THE ANGLE OF THE BALL
        let angle = collidePoint * Math.PI / 3;


        ball2.dx = ball2.speed * Math.sin(angle);
        ball2.dy = - ball2.speed * Math.cos(angle);
    }
}
// ball brick collision
function ballBrickCollision() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            // if the brick isn't broken
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height) {
                    ball.dy = - ball.dy;
                    b.lives--;

                    ctx.fillStyle = 'red';
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);

                    console.log(b.lives);
                    if (b.lives === 0) {
                        b.status = false;
                        SCORE += SCORE_UNIT;
                    }

                }
            }
        }
    }
}
function ballBrickCollision2() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            // if the brick isn't broken
            if (b.status) {
                if (ball2.x + ball2.radius > b.x && ball2.x - ball2.radius < b.x + brick.width && ball2.y + ball2.radius > b.y && ball2.y - ball2.radius < b.y + brick.height) {
                    ball2.dy = - ball2.dy;
                    b.lives--;

                    ctx.fillStyle = 'red';
                    ctx.fillRect(b.x, b.y, brick.width, brick.height);

                    console.log(b.lives);
                    if (b.lives === 0) {
                        b.status = false;
                        SCORE += SCORE_UNIT;
                    }

                }
            }
        }
    }
}
function ballBarrierCollision() {
    for (let r = 0; r < barrier.row; r++) {
        for (let c = 0; c < barrier.column; c++) {
            let b = barriers[r][c];
            // if the brick isn't broken
            if (b.status) {
                if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + barrier.width && ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + barrier.height) {
                    ball.dy = - ball.dy;
                }
            }
        }
    }
}
function ballBarrierCollision2() {
    for (let r = 0; r < barrier.row; r++) {
        for (let c = 0; c < barrier.column; c++) {
            let b = barriers[r][c];
            // if the brick isn't broken
            if (b.status) {
                if (ball2.x + ball2.radius > b.x && ball2.x - ball2.radius < b.x + barrier.width && ball2.y + ball2.radius > b.y && ball2.y - ball2.radius < b.y + barrier.height) {
                    ball2.dy = - ball2.dy;
                }
            }
        }
    }
}

// move ball
function moveBall() {

    ball.x += ball.dx;
    ball.y += ball.dy;

}
function moveBall2() {
    if (ball2.created == true) {
        ball2.x += ball2.dx;
        ball2.y += ball2.dy;
    }
}
// create bricks
const brick = {
    row: 1,
    column: 5,
    width: 65,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF",
    live: 1,
    colorChange: '#FF0000',
}
const bricks = [];
function createBricks() {
    for (let r = 0; r < brick.row; r++) {
        bricks[r] = [];
        for (let c = 0; c < brick.column; c++) {
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true,
                lives: brick.live
            }
        }
    }
}


createBricks();
// draw bricks
function drawBricks() {
    for (let r = 0; r < brick.row; r++) {
        for (let c = 0; c < brick.column; c++) {
            let b = bricks[r][c];
            // if the brick isn't broken
            if (b.status) {
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

const barrier = {
    row: 0,
    column: 3,
    width: 55,
    height: 20,
    offSetLeft: 100,
    offSetTop: 20,
    marginTop: brick.marginTop + brick.height * brick.row + brick.offSetTop,
    fillColor: "red",
    strokeColor: "#FFF",
}
const barriers = [];
function createBarrier() {
    for (let r = 0; r <= barrier.row; r++) {
        barriers[r] = [];
        for (let c = 0; c <= barrier.column; c++) {
            barriers[r][c] = {
                x: c * (barrier.offSetLeft + barrier.width) + barrier.offSetLeft,
                y: r * (barrier.offSetTop + barrier.height) + barrier.offSetTop + barrier.marginTop,
                status: true,
            }
        }
    }
}
function drawBarriers() {
    for (let r = 0; r < barrier.row; r++) {
        for (let c = 0; c < barrier.column; c++) {
            let b = barriers[r][c];
            if (b.status) {
                ctx.fillStyle = barrier.fillColor;
                ctx.fillRect(b.x, b.y, barrier.width, barrier.height);
                ctx.strokeStyle = barrier.strokeColor;
                ctx.strokeRect(b.x, b.y, barrier.width, barrier.height);
            }
        }
    }
}



function showGameStats(text, textX, textY, text1, text1X, text1Y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "18px Germania One";
    ctx.fillText(text, textX, textY);
    ctx.fillStyle = "#FFF";
    ctx.font = "18px Germania One";
    ctx.fillText(text1, text1X, text1Y);
}
// ball collision
function ballCollision() {

    ballWallCollision();

    ballPaddleCollision();

    ballBrickCollision();
    ballBarrierCollision()


    ballWallCollision2();

    ballPaddleCollision2();

    ballBrickCollision2();
    ballBarrierCollision2()
}
// draw game
function draw() {
    drawPaddle();

    drawBarriers();

    drawBall();

    drawBall2();

    drawBricks();

    // SHOW SCORE
    showGameStats(SCORE, 80, 25, 'SCORE: ', 10, 25);
    // SHOW LIVES
    showGameStats(LIFE, canvas.width - 20, 25, 'LIFE: ', canvas.width - 65, 25);
    // SHOW LEVEL
    showGameStats(LEVEL, canvas.width / 2 + 45, 25, 'LEVEL: ', canvas.width / 2 - 20, 25);
}
draw();


//update
function update() {
    movePaddle();

    moveBall();
    moveBall2()

    ballCollision()

    levelUp();

}
var rotate;
function rotateCanvas() {
     rotate= setInterval(function () {

        canvas.style.transform += 'rotate(90deg)';
        canvas.style.transformOrigin = 'center';
        canvas.style.transition = 'all 1s';
        canvas.style.transitionTimingFunction = 'ease-in-out';
        canvas.style.transitionDelay = '0s';
        canvas.style.transitionDuration = '1s';
        canvas.style.transitionProperty = 'all';
    }, 10000)
   
}
function stopRotateCanvas() {
    clearInterval(rotate);
}

function levelUp() {
    let isLevelDone = true;

    // check if all the bricks are broken
    for (let row = 0; row < brick.row; row++) {
        for (let column = 0; column < brick.column; column++) {
            isLevelDone = isLevelDone && !bricks[row][column].status;
        }
    }


    if (isLevelDone) {
        LEVEL++;
        if (LEVEL > MAX_LEVEL) {
            alert('YOU WIN');
            GAME_OVER = true;
            return;
        }
       
        if (LEVEL == 2) {
       
            brick.row = 3;
            brick.column = 5;
            brick.offSetLeft = 20;
            brick.offSetTop = 20;
            brick.marginTop = 40;
            brick.live = 2;
        }
        if (LEVEL == 3) {
            brick.row = 3;
            barrier.row = 1;
            barrier.column = 3;
            barrier.offSetLeft = 60;
            barrier.offSetTop = 20;
            barrier.width = 65;
            barrier.marginTop = brick.marginTop + brick.height * brick.row + brick.offSetTop + 80;
        }



        if (LEVEL == 4) {
            brick.row = 3;
            brick.row = 3;
            barrier.row = 1;
            barrier.column = 3;
            barrier.offSetLeft = 60;
            barrier.offSetTop = 20;
            barrier.width = 65;
            barrier.marginTop = brick.marginTop + brick.height * brick.row + brick.offSetTop + 80;
            movePaddle = function () {
                if (key.keyright && paddle.x > 0) {
                    paddle.x -= paddle.dx;
                }
                else if (key.keyleft && paddle.x < canvas.width - paddle.width) {
                    paddle.x += paddle.dx;
                }
            }
            brick.live = 3;
        }

        if (LEVEL == 5) {
            brick.row = 3;
            movePaddle = function () {
                if (key.keyright && paddle.x > 0) {
                    paddle.x -= paddle.dx;
                }
                else if (key.keyleft && paddle.x < canvas.width - paddle.width) {
                    paddle.x += paddle.dx;
                }
            }
            barrier.row = 0;
            rotateCanvas();
        }
        if (LEVEL == 6) {
            stopRotateCanvas();
            canvas.style.transform = 'rotate(0deg)';
            brick.row = 4;
            brick.column = 5;
            brick.offSetLeft = 20;
            brick.offSetTop = 20;
            brick.marginTop = 40;
            ball2.created = true;
        }
        createBricks();

        createBarrier();

        ball.speed += 0.5;
        brick.live += 1;
        resetBall();
    }
}

function loop() {

    ctx.fillStyle = '#404384';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fill();

    draw();

    update();
    requestAnimationFrame(loop);

}
loop();



const btnPause = document.getElementById("btn-pause");
btnPause.addEventListener("click", function (){
    var gameBrightness = 10;
    var pause = confirm("Bạn tạm dừng game. Bấm Ok để tiếp tục");

    if (pause == false) {
        //Didn't click on OK
        var options = confirm(

        );

        if (options == true) {
            //Clicked on OK
            ReDopause();
            return;
        } else {
            //Didn't click on OK
            brightness = Math.floor(Math.random() * 20);
            document.getElementById("brightness").innerHTML = brightness;
            ReDopause();
            return;
        }}}

);