/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
	constructor(height, width, ...players) {
		this.HEIGHT = height;
		this.WIDTH = width;
		this.BOARD = [];
		this.GameOver = false;
		this.makeBoard();
		this.makeHtmlBoard();
		this.PLAYERS = players;
		this.currPlayer = this.PLAYERS[0];
	}
	/** makeBoard: create in-JS board structure:
	 *   board = array of rows, each row is array of cells  (board[y][x])
	 */

	makeBoard() {
		for (let y = 0; y < this.HEIGHT; y++) {
			this.BOARD.push(Array.from({ length: this.WIDTH }));
		}
	}

	/** makeHtmlBoard: make HTML table and row of column tops. */

	makeHtmlBoard() {
		const board = document.getElementById("board");

		// make column tops (clickable area for adding a piece to that column)
		const top = document.createElement("tr");
		top.setAttribute("id", "column-top");
		top.addEventListener("click", this.handleClick.bind(this));

		for (let x = 0; x < this.WIDTH; x++) {
			const headCell = document.createElement("td");
			headCell.setAttribute("id", x);
			top.append(headCell);
		}

		board.append(top);

		// make main part of board
		for (let y = 0; y < this.HEIGHT; y++) {
			const row = document.createElement("tr");

			for (let x = 0; x < this.WIDTH; x++) {
				const cell = document.createElement("td");
				cell.setAttribute("id", `${y}-${x}`);
				row.append(cell);
			}

			board.append(row);
		}
	}

	/** findSpotForCol: given column x, return top empty y (null if filled) */

	findSpotForCol(x) {
		for (let y = this.HEIGHT - 1; y >= 0; y--) {
			if (!this.BOARD[y][x]) {
				return y;
			}
		}
		return null;
	}

	/** placeInTable: update DOM to place piece into HTML table of board */

	placeInTable(y, x) {
		const PIECE = document.createElement("div");
		PIECE.classList.add("piece");
		PIECE.style.top = -50 * (y + 2);
		PIECE.style.backgroundColor = this.currPlayer.COLOR;
		const CELL = document.getElementById(`${y}-${x}`);
		CELL.append(PIECE);
	}

	/** endGame: announce game end */

	endGame(msg) {
		alert(msg);
	}

	/** handleClick: handle click of column top to play piece */

	handleClick(evt) {
		if (!this.GameOver) {
			// get x from ID of clicked cell
			const x = +evt.target.id;

			// get next spot in column (if none, ignore click)
			const y = this.findSpotForCol(x);
			if (y === null) {
				return;
			}

			// place piece in board and add to HTML table
			this.BOARD[y][x] = this.currPlayer.PLAYER_NUM;
			this.placeInTable(y, x);

			// check for win
			if (this.checkForWin()) {
				this.GameOver = true;
				return this.endGame(
					`Player ${this.currPlayer.PLAYER_NUM} won!`
				);
			}

			// check for tie
			if (this.BOARD.every((row) => row.every((cell) => cell))) {
				this.GameOver = true;
				return this.endGame("Tie!");
			}
			// switch players this.currPlayer = this.PLAYERS[0];
			this.currPlayer =
				this.currPlayer === this.PLAYERS[0]
					? this.PLAYERS[1]
					: this.PLAYERS[0];
		}
	}

	/** checkForWin: check board cell-by-cell for "does a win start here?" */

	checkForWin() {
		function _win(cells) {
			// Check four cells to see if they're all color of current player
			//  - cells: list of four (y, x) cells
			//  - returns true if all are legal coordinates & all match this.currPlayer

			return cells.every(
				([y, x]) =>
					y >= 0 &&
					y < this.HEIGHT &&
					x >= 0 &&
					x < this.WIDTH &&
					this.BOARD[y][x] === this.currPlayer.PLAYER_NUM
			);
		}

		for (let y = 0; y < this.HEIGHT; y++) {
			for (let x = 0; x < this.WIDTH; x++) {
				// get "check list" of 4 cells (starting here) for each of the different
				// ways to win
				const horiz = [
					[y, x],
					[y, x + 1],
					[y, x + 2],
					[y, x + 3],
				];
				const vert = [
					[y, x],
					[y + 1, x],
					[y + 2, x],
					[y + 3, x],
				];
				const diagDR = [
					[y, x],
					[y + 1, x + 1],
					[y + 2, x + 2],
					[y + 3, x + 3],
				];
				const diagDL = [
					[y, x],
					[y + 1, x - 1],
					[y + 2, x - 2],
					[y + 3, x - 3],
				];

				// find winner (only checking each win-possibility as needed)
				if (
					_win.apply(this, [horiz]) ||
					_win.apply(this, [vert]) ||
					_win.apply(this, [diagDR]) ||
					_win.apply(this, [diagDL])
				) {
					return true;
				}
			}
		}
	}

	// makeBoard()
	// makeHtmlBoard()
}

class Player {
	constructor(color) {
		this.COLOR = color;
		this.PLAYER_NUM = playerCount++;
	}
}
// const START_BUTTON = document.getElementById("gameStart");
const PLAYER_FORM = document.getElementById("players");
let playerCount = 1;
PLAYER_FORM.addEventListener("submit", (e) => {
	e.preventDefault();
	const PLAYERS = [...document.getElementsByClassName("playerInput")].map(
		(item) => {
			return new Player(item.value);
		}
	);
	document.getElementById("board").innerHTML = "";
	new Game(6, 7, ...PLAYERS);
});
