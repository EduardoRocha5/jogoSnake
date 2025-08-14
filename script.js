window.onload = function() {
    const campo = document.querySelector('.campojogo');
    const cobra = document.querySelector('.cobra');

    const tamanho = 50; // tamanho da cobra
    let posX = Math.floor(campo.clientWidth / 2 / tamanho) * tamanho;
    let posY = Math.floor(campo.clientHeight / 2 / tamanho) * tamanho;

    cobra.style.left = posX + 'px';
    cobra.style.top = posY + 'px';

    let direcao = { x: 1, y: 0 };

    // array que representa a cobra
    let snake = [
        { x: posX, y: posY }
    ];

    function moverCobra() {
        posX += direcao.x * tamanho;
        posY += direcao.y * tamanho;

        // Limites do campo
        if (posX < 0 || posX > campo.clientWidth - tamanho || posY < 0 || posY > campo.clientHeight - tamanho) {
          //  alert("Game Over! Bateu na parede.");
            posX = Math.floor(campo.clientWidth / 2 / tamanho) * tamanho;
            posY = Math.floor(campo.clientHeight / 2 / tamanho) * tamanho;
            snake = [{ x: posX, y: posY }];
            direcao = { x: 1, y: 0 };
            return;
        }

        snake.unshift({ x: posX, y: posY });
        snake.pop();

        cobra.style.left = posX + "px";
        cobra.style.top = posY + "px";

        // colisão com o próprio corpo
        for (let i = 1; i < snake.length; i++) {
            if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
               // alert("Game Over! Bateu em si mesmo.");//
                posX = Math.floor(campo.clientWidth / 2 / tamanho) * tamanho;
                posY = Math.floor(campo.clientHeight / 2 / tamanho) * tamanho;
                snake = [{ x: posX, y: posY }];
                direcao = { x: 1, y: 0 };
                return;
            }
        }
    }

    // captura setas do teclado
    window.addEventListener('keydown', e => {
        if (e.key === "ArrowUp" && direcao.y !== 1) direcao = { x: 0, y: -1 };
        if (e.key === "ArrowDown" && direcao.y !== -1) direcao = { x: 0, y: 1 };
        if (e.key === "ArrowLeft" && direcao.x !== 1) direcao = { x: -1, y: 0 };
        if (e.key === "ArrowRight" && direcao.x !== -1) direcao = { x: 1, y: 0 };
    });

    setInterval(moverCobra, 250); // <- importante para a cobra se mover
};
