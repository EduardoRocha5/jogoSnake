const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const score = document.querySelector(".score--value");
const finalScore = document.querySelector(".final-score > span");
const menu = document.querySelector(".menu-screen");
const buttonPlay = document.querySelector(".btn-play");

/* 
canvas: onde o jogo é desenhado.
ctx: contexto gráfico 2D (usado para desenhar no canvas).
score: pontuação atual.
finalScore: pontuação final (quando perde).
menu: tela de game over.
buttonPlay: botão de reiniciar.
audio: som que toca quando a cobra come a comida.
*/

const size = 30;
const initialPosition = { x: 270, y: 240 };
let snake = [initialPosition];

/*
size: tamanho de cada quadradinho da grade.
initialPosition: onde a cobra nasce.
snake: lista com as posições da cobra (cada parte é um objeto {x, y}) 
*/

// arrow function ()=> //

// funcoes auxiliares

//Soma 10 pontos ao placar sempre que a cobra come.
const incrementScore = () => {
  score.innerText = +score.innerText + 10;
};

// Gera um número aleatório entre min e max.
const randomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

//Sorteia uma posição válida multipla de 30 (para alinhar na grade do jogo).
const randomPosition = () => {
  const number = randomNumber(0, canvas.width - size);
  return Math.round(number / 30) * 30;
};

// Sorteia uma cor RGB para a comida.
const randomColor = () => {
  const red = randomNumber(0, 255);
  const green = randomNumber(0, 255);
  const blue = randomNumber(0, 255);
  return `rgb(${red}, ${green}, ${blue})`;
};

// funcao comida
// Define a comida inicial em uma posição aleatória e com cor aleatória.
const food = {
  x: randomPosition(),
  y: randomPosition(),
  color: randomColor(),
};

let direction, loopId;

// Desenha a comida com brilho.
const drawFood = () => {
  const { x, y, color } = food;

  ctx.shadowColor = color;
  ctx.shadowBlur = 6;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
  ctx.shadowBlur = 0;
};

//Desenha a cobra:
//Corpo cinza.
//Cabeça branca.
const drawSnake = () => {
  ctx.fillStyle = "#ddd";

  snake.forEach((position, index) => {
    if (index == snake.length - 1) {
      ctx.fillStyle = "white";
    }

    ctx.fillRect(position.x, position.y, size, size);
  });
};

//Movimento da cobra

//Adiciona um novo bloco na frente da cobra (cabeça).
//Remove o último bloco para simular o movimento.

const moveSnake = () => {
  if (!direction) return;

  const head = snake[snake.length - 1];

  if (direction == "right") {
    snake.push({ x: head.x + size, y: head.y });
  }

  if (direction == "left") {
    snake.push({ x: head.x - size, y: head.y });
  }

  if (direction == "down") {
    snake.push({ x: head.x, y: head.y + size });
  }

  if (direction == "up") {
    snake.push({ x: head.x, y: head.y - size });
  }

  snake.shift(); // remove o último pedaço → movimento
};

//funcao Desenha a grade do tabuleiro (linhas horizontais e verticais a cada 30px).
const drawGrid = () => {
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#191919";

  for (let i = 30; i < canvas.width; i += 30) {
    ctx.beginPath();
    ctx.lineTo(i, 0);
    ctx.lineTo(i, 600);
    ctx.stroke();

    ctx.beginPath();
    ctx.lineTo(0, i);
    ctx.lineTo(600, i);
    ctx.stroke();
  }
};

/*
funcao Comer comida
Se a cabeça da cobra encosta na comida:
Aumenta o placar.
Cresce a cobra.
Sorteia nova posição e cor para a comida (garantindo que não caia em cima da cobra).
*/

const chackEat = () => {
const head = snake[snake.length - 1];

if (head.x == food.x && head.y == food.y) {
  incrementScore();
  snake.push(head); // cresce a snake

  let x = randomPosition();
  let y = randomPosition();

  while (snake.find((position) => position.x == x && position.y == y)) {
    x = randomPosition();
    y = randomPosition();
  }

  food.x = x;
  food.y = y;
  food.color = randomColor();
}
}

//colisao

/*
Verifica se a cabeça bateu:
Na parede (wallCollision).
No próprio corpo (selfCollision).
Se sim → chama gameOver().
*/

const checkCollision = () => {
  const head = snake[snake.length - 1];
  const canvasLimit = canvas.width - size;
  const neckIndex = snake.length - 2;

  const wallCollision =
    head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit;

  const selfCollision = snake.find((position, index) => {
    return index < neckIndex && position.x == head.x && position.y == head.y;
  });

  if (wallCollision || selfCollision) {
    gameOver();
  }
};

// fim do jogo

/*Para o movimento (direction = undefined).
Mostra o menu de game over.
Exibe a pontuação final.
Aplica um blur no canvas.
*/

const gameOver = () => {
  direction = undefined;

  menu.style.display = "flex";
  finalScore.innerText = score.innerText;
  canvas.style.filter = "blur(2px)";
};



/*

loop para o jogo rodar
Limpa a tela.
Desenha grade, comida, cobra.
Atualiza movimento e colisões.
Executa a cada 200ms (velocidade da cobra).
*/

const gameLoop = () => {
  clearInterval(loopId);

  ctx.clearRect(0, 0, 600, 600);
  drawGrid();
  drawFood();
  moveSnake();
  drawSnake();
  chackEat();
  checkCollision();

  loopId = setTimeout(() => {
    gameLoop();
  }, 200);
};

//start
gameLoop();


//controle por teclas

/*
Controla a direção da cobra com as setas.
Impede de voltar para trás diretamente (ex: direita → esquerda).
*/
document.addEventListener("keydown", ({ key }) => {
  if (key == "ArrowRight" && direction != "left") {
    direction = "right";
  }

  if (key == "ArrowLeft" && direction != "right") {
    direction = "left";
  }

  if (key == "ArrowDown" && direction != "up") {
    direction = "down";
  }

  if (key == "ArrowUp" && direction != "down") {
    direction = "up";
  }
});


// reiniciar o jogo ao clicar

/*
Zera a pontuação.
Esconde o menu.
Remove o blur.
Reseta a cobra na posição inicial.
*/

buttonPlay.addEventListener("click", () => {
  score.innerText = "00";
  menu.style.display = "none";
  canvas.style.filter = "none";

  snake = [initialPosition];
});
