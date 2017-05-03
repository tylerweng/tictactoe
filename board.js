const Tile = require("./tile.js");

const BOARD_SIZE = 3;
const P1_MARKER = "X";
const P2_MARKER = "O";

class Board {
  constructor() {
    this.size = BOARD_SIZE;
    this.initializeGrid();
    this.player1Turn = true;
  }

  initializeGrid() {
    this.grid = [];
    for (let i = 0; i < this.size; i++) {
      const row = new Array(this.size);
      this.grid[i] = row;
    }
  }

  promptMove(reader, moveCallback) {
    this.render();
    reader.question("Enter rowNum, colNum: " + "\n", input => {
      const pos = input.split(", ").map(el => parseInt(el, 10));
      moveCallback(pos);
    });
  }

  getTileMarker(i, j) {
    return (
      this.grid[i][j]
        ? this.grid[i][j].marker
        : "*"
    );
  }

  placeTile(pos) {
    const i = pos[0];
    const j = pos[1];
    const marker = this.player1Turn ? P1_MARKER : P2_MARKER;
    this.grid[i][j] = new Tile(marker);
  }

  render() {
    for (let i = 0; i < this.size; i++) {
      let rowStr = "";
      for (let j = 0; j < this.size; j++) {
        rowStr += this.getTileMarker(i, j);
      }
      console.log(rowStr);
    }
  }

  outOfBounds(pos) {
    return pos[0] < 0 || pos[0] >= this.size || pos[1] < 0 || pos[1] >= this.size;
  }

  validMove(pos) {
    const i = pos[0];
    const j = pos[1];
    if (this.grid[i][j]) {
      console.log("Pos already taken");
    } else if(this.outOfBounds(pos)) {
      console.log("Out of bounds");
    } else {
      return true;
    }
  }

  switchTurns() {
    this.player1Turn = !this.player1Turn;
  }

  rowWin() {
    for (let i = 0; i < this.size; i++) {

    }
  }

  tie() {
    let ct = 0;
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.grid[i][j]) ct++;
      }
    }
    return ct === 9;
  }

  rowWin() {
    for (let i = 0; i < this.size; i++) {
      const row = this.grid[i];
      if (row.filter(el => el === P1_MARKER).length === 3) return true;
      if (row.filter(el => el === P2_MARKER).length === 3) return true;
    }
    return false;
  }

  colWin() {
    for (let j = 0; j < this.size; j++) {
      const col = [];
      for (let i = 0; i < this.size; i++) {
        col.push(this.grid[i][j]);
      }
      if (col.filter(el => el === P1_MARKER).length === 3) return true;
      if (col.filter(el => el === P2_MARKER).length === 3) return true;
    }
  }

  diagWin() {
    const d1 = [];
    const d2 = [];
    for (let i = 0; i < this.size; i++) {
      let j1 = i;
      let j2 = this.size - 1 - i;
      d1.push(this.grid[i][j1]);
      d2.push(this.grid[i][j2]);
    }
    if (d1.filter(el => el === P1_MARKER).length === 3) return true;
    if (d2.filter(el => el === P1_MARKER).length === 3) return true;
    if (d1.filter(el => el === P2_MARKER).length === 3) return true;
    if (d2.filter(el => el === P2_MARKER).length === 3) return true;
    return false;
  }

  gameOver() {
    return this.rowWin() || this.colWin() || this.diagWin() || this.tie();
  }

  run(reader, completionCallback) {
    this.promptMove(reader, pos => {
      if (!this.validMove(pos)) this.run(reader, completionCallback);
      this.placeTile(pos);
      this.switchTurns();
      if (this.gameOver()) {
        console.log("Game over!");
        return;
      }
      this.run(reader, completionCallback);
    });
  }
}

module.exports = Board;
