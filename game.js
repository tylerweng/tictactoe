const readline = require("readline");
const Board = require("./board.js");

const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let board = new Board();
board.run(reader, completionCallback);

function completionCallback() {
  reader.question("Play again? y or n:", response => {
    if (response === "y") {
      board = new Board();
      board.run(reader, completionCallback);
    } else {
      reader.close();
    }
  });
}
