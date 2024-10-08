import { checkwin, checklose, revealTile, TILE_STATUSES, createBoard, markTile } from "./Minesweeper.js"

const BOARD_SIZE = window.innerWidth <= 600 ? 10 : 15;
const NUMBER_OF_MINES =  window.innerWidth <= 600 ? 7 : 15;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES); // Consistent spacing
const boardElement = document.querySelector(".board");
const minesLeftText = document.getElementById("mines-left");
const msgtext = document.querySelector(".subtext");

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);

        tile.element.addEventListener("click", () => {
            revealTile(board, tile);
            checkGameEnd();
        });

        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        });
    });
});

boardElement.style.setProperty("--size", BOARD_SIZE); // Consistent spacing
minesLeftText.textContent = NUMBER_OF_MINES;

function listMinesLeft() {
    const markedTilesCount = board.reduce((count, row) => 
        count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length, 0
    );

    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount;
}

function checkGameEnd() {
    const win = checkwin(board);
    const lose = checklose(board);

    if (win || lose) {
        boardElement.addEventListener("click", stopProp, { capture: true });
        boardElement.addEventListener("contextmenu", stopProp, { capture: true });
    }
    if(win){
        msgtext.textContent="you win";
    }
    if(lose){
        msgtext.textContent="you lose";
        board.forEach(row=>{
            row.forEach(tile =>{
                if(tile.status === TILE_STATUSES.MARKED)markTile(tile)
                if(tile.mine) revealTile(board,tile);
            })
        });
    }
}

function stopProp(e) {
    e.stopImmediatePropagation();
}