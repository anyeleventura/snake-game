const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const size = 30;

const snake = [
    { x: 200, y: 200 },
    { x: 230, y: 200 },
    { x: 260, y: 200 }
];

let direction = 'rigth';

const drawSnake = () => {
    ctx.fillStyle = "#c4c4c4";

    snake.forEach((position, index) => {
    if(index ==snake.length - 1){
        ctx.fillStyle = "white";
    }

        ctx.fillRect(position.x, position.y, size, size);
    })
};

const moveSnake = () => {
    const head = snake[snake.length - 1];

    if(direction == 'rigth'){
        snake.push({ x: head.x + size, y: head.y })
    }

    snake.shift();
}
setInterval(() => {
    ctx.clearRect(0, 0, 500, 500);

    moveSnake();
    drawSnake();
}, 200);