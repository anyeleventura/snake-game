const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const score = document.querySelector('.score');
const scoreValue = document.querySelector('.score-value');
const finalScore = document.querySelector('.final-score > span');
const menu = document.querySelector('.menu-screen');
const buttonPlay = document.querySelector('.btn-play');

const buttons = document.querySelector('.mobile-controls');
const btnUp = document.querySelector('.btn-up');
const btnDown = document.querySelector('.btn-down');
const btnLeft = document.querySelector('.btn-left');
const btnRight = document.querySelector('.btn-right');

const size = 30;

let snake = [
    { x: 270, y: 270 }
];

const incrementScore = () => {
    scoreValue.innerText = +scoreValue.innerText + 10;
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / size) * size;
};

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);

    return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
};

let direction, loopId;
let isGameOver = false;

const drawFood = () => {
    const { x, y, color } = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
};

const drawSnake = () => {
    ctx.fillStyle = "#c4c4c4";

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "white";
        }

        ctx.fillRect(position.x, position.y, size, size);
    });
};

const moveSnake = () => {
    if (!direction) return;
    const head = snake[snake.length - 1];

    if (direction === 'right') {
        snake.push({ x: head.x + size, y: head.y });
    }

    if (direction === 'left') {
        snake.push({ x: head.x - size, y: head.y });
    }

    if (direction === 'down') {
        snake.push({ x: head.x, y: head.y + size });
    }

    if (direction === 'up') {
        snake.push({ x: head.x, y: head.y - size });
    }

    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#191919';

    for (let i = size; i < canvas.width; i += size) {
        ctx.beginPath();
        ctx.lineTo(i, 0);
        ctx.lineTo(i, canvas.width);
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
};

const checkEat = () => {
    const head = snake[snake.length - 1];

    if (head.x === food.x && head.y === food.y) {
        incrementScore();
        snake.push(head);

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x === x && position.y === y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const checkCollision = () => {
    const head = snake[snake.length - 1];
    const canvasLimit = canvas.width - size;
    const neckIndex = snake.length - 2;

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x === head.x && position.y === head.y;
    });

    if (wallCollision || selfCollision) {
        gameOver();
    }
};

const gameOver = () => {
    isGameOver = true;

    direction = undefined;

    menu.style.display = 'flex';
    finalScore.innerText = scoreValue.innerText;
    canvas.style.filter = "blur(3px)";
    buttons.style.filter = "blur(2px)";
    score.style.filter = "blur(2px)";
};

const gameLoop = () => {
    if (isGameOver === false) {
        clearInterval(loopId);

        ctx.clearRect(0, 0, canvas.width, canvas.width);

        drawGrid();
        drawFood();
        moveSnake();
        drawSnake();
        checkEat();
        checkCollision();

        loopId = setTimeout(() => {
            gameLoop();
        }, 300);
    } else {
        return;
    }
};

gameLoop();

const handleMove = (newDirection) => {
    if (direction !== oppositeDirection(newDirection)) {
        direction = newDirection;
    }
};

const oppositeDirection = (dir) => {
    if (dir === 'up') return 'down';
    if (dir === 'down') return 'up';
    if (dir === 'left') return 'right';
    if (dir === 'right') return 'left';
};

document.addEventListener('keydown', ({ key }) => {
    if (key === 'ArrowRight' && direction !== 'left') {
        direction = 'right';
    }
    if (key === 'ArrowLeft' && direction !== 'right') {
        direction = 'left';
    }
    if (key === 'ArrowDown' && direction !== 'up') {
        direction = 'down';
    }
    if (key === 'ArrowUp' && direction !== 'down') {
        direction = 'up';
    }
});

btnUp.addEventListener('click', () => handleMove('up'));
btnDown.addEventListener('click', () => handleMove('down'));
btnLeft.addEventListener('click', () => handleMove('left'));
btnRight.addEventListener('click', () => handleMove('right'));

buttonPlay.addEventListener("click", () => {
    scoreValue.innerText = '00';
    menu.style.display = 'none';
    canvas.style.filter = 'none';
    buttons.style.filter = 'none';
    score.style.filter = 'none';

    snake = [{ x: 270, y: 270 }];

    isGameOver = false;

    gameLoop();
});
