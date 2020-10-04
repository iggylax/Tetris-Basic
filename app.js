document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colours = [
        "#F26386",
        "#F588AF",
        "#FCBC52",
        "#FD814E",
        "#FFED4D",
        "#f4f0e4",
        "#2BAA92"


    ]



    // The Tetrominoes

    const l1Tetrimino = [
        [0, 1, width, width * 2],
        [0, 1, 2, width + 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2],
        [2, width + 2, width * 2 + 1, width * 2 + 2]

    ]


    const l2Tetrimino = [
        [1, 2, width + 2, width * 2 + 2],
        [0, 1, 2, width],
        [2, width, width + 1, width + 2],
        [0, width, width * 2, width * 2 + 1]

    ]

    const z1Tetrimino = [
        [0, width, width + 1, width * 2 + 1],
        [1, 2, width, width + 1],
        [0, width, width + 1, width * 2 + 1],
        [1, 2, width, width + 1]
    ]

    const z2Tetrimino = [
        [3, width + 2, width + 3, width * 2 + 2],
        [1, 2, width, width + 1],
        [3, width + 2, width + 3, width * 2 + 2],
        [1, 2, width, width + 1]
    ]

    const tTetrimino = [
        [0, 1, 2, width + 1],
        [0, width, width + 1, width * 2],
        [1, width, width + 1, width * 2 + 1],
        [width + 1, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const oTetrimino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetrimino = [
        [0, width, width * 2, width * 3],
        [0, 1, 2, 3],
        [0, width, width * 2, width * 3],
        [0, 1, 2, 3]
    ]

    const theTetriminos = [l1Tetrimino, l2Tetrimino, z1Tetrimino, z2Tetrimino, tTetrimino, iTetrimino, oTetrimino]

    let currentPosition = 4
    let currentRotation = 0

    console.log(theTetriminos[0][0])

    // randomly selecting a tetrimino

    let random = Math.floor(Math.random() * theTetriminos.length)
    let current = theTetriminos[random][currentRotation]

    //drawing the terimino

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrimino')
            squares[currentPosition + index].style.backgroundColor = colours[random]

        })
    }

    //undrawing the tetrimino

    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetrimino')
            squares[currentPosition + index].style.backgroundColor = ''

        })
    }


    //making the tetrimino move down every second

    //timerId = setInterval(moveDown, 1000)  << no longer needed because of the start/pause button, this started the game as soon as the browser refreshed

    //assign funcions to keyCodes
    function control(e) {
        if (e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()

            // }else if (e.keyCode === 32) {
            // pause ()
        }
    }
    document.addEventListener('keyup', control)


    //move down function

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    //freeze function

    function freeze() {
        if (current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new terimino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetriminos.length)
            current = theTetriminos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            undraw()
            addScore()
            undraw ()
            gameOver()
        }
    }

    //moving the tetriminos to the left, unless there's an edge or a block

    function moveLeft() {
        undraw()
        const isALeftEdge = current.some(index => (currentPosition + index) % width === 0)

        if (!isALeftEdge) currentPosition -= 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            currentPosition += 1
        }

        draw()
    }

    //moving the tetriminos to the right, unless there's an edge or a block

    function moveRight() {
        undraw()
        const isARightEdge = current.some(index => (currentPosition + index) % width === width - 1)

        if (!isARightEdge) currentPosition += 1

        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {

            currentPosition -= 1
        }
        draw()
    }

    // rotate the terimino

    function rotate() {

        var nextRotation = currentRotation+ 1 ;
        if (nextRotation === current.length){ // once you get to rotation 4, go back to 0
            nextRotation = 0
        }
        var next = theTetriminos[random][nextRotation];

        let isNewALeftEdge = next.some(index => (currentPosition + index) % width === 0)
        let isNewARightEdge = next.some(index => (currentPosition + index) % width === width - 1)

        if (isNewALeftEdge && isNewARightEdge){
            return false;
        }

        // now validation on the size has passed, we want to override the current with the nextObj
        undraw()
        current = next;
        currentRotation = nextRotation;
        draw()

    }

    //showing the next tetrimino in the mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    const displayIndex = 0

    //the tetriminos without rotations
    const upNext = [
        [0, 1, displayWidth, displayWidth * 2],//l1Tetrimino
        [1, 2, displayWidth + 2, displayWidth * 2 + 2],//l2Tetrimino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],//z1Tetrimino
        [3, displayWidth + 2, displayWidth + 3, displayWidth * 2 + 2],//z2Tetrimino
        [0, 1, 2, displayWidth + 1],//tTetrimino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],//iTetrimino
        [0, 1, displayWidth, displayWidth + 1]//oTetrimino
    ]

    //displaying the shape in the mini grid
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetrimino')
            square.style.backgroundColor = ''

        })
        upNext[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('tetrimino')
            displaySquares[displayIndex + index].style.backgroundColor = colours[nextRandom]
        })
    }

    // start/pause button functionality



    startBtn.addEventListener('click', () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * theTetriminos.length)
            displayShape()
        }
    })


    // start/pause text change 

    var button = document.getElementById("start-button");
    button.addEventListener('click', function() {
      if (button.getAttribute("data-text-swap") == button.innerHTML) {
        button.innerHTML = button.getAttribute("data-text-original");
      } else {
        button.setAttribute("data-text-original", button.innerHTML);
        button.innerHTML = button.getAttribute("data-text-swap");
      }
    }, false);

    //add score - remove complete rows, add a new row as if nothing has happened and update score

    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

            if (row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetrimino')
                    squares[index].style.backgroundColor = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }

    }

    //game over

    function gameOver() {
        if (current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = 'Game Over'
            clearInterval(timerId)
        }
    }





})
