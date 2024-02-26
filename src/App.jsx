import React from "react";
import GameBoard from "./components/GameBoard";
import Player from "./components/Player";
import Log from "./components/Log";
import { WINNING_COMBINATIONS } from "./WinningCombination";
import GameOver from "./components/GameOver";

// function deriveActivePlayer(gameTurns) {
//   let currentPlayer = "X";

//   if (gameTurns.length > 0 && gameTurns[0].player === "X") {
//     currentPlayer = "O";
//   }

//   return currentPlayer;
// }

function deriveActivePlayer(gameTurns) {
  const lastTurn = gameTurns.length > 0 ? gameTurns[0] : null;

  if (lastTurn && lastTurn.player === "X") {
    return "O";
  } else {
    return "X";
  }
}

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];


function App() {
  const [gameTurns, setGameTurns] = React.useState([]);
  const [players, setPlayers] = React.useState({
         X: 'Player 1',
         Y: 'Player 2',
  })
  // const [activePlayer, setActivePlayer] = React.useState("X");
  const activePlayer = deriveActivePlayer(gameTurns);

  let gameBoard = [...initialGameBoard.map(array => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    const { row, col } = square;

    gameBoard[row][col] = player;
  }

  let winner; 

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
       winner = players[firstSquareSymbol];
    }
  }

  const hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    // setActivePlayer((curActivePlayer) => (curActivePlayer === "X" ? "O" : "X"));
    setGameTurns((prevTurns) => {
      const activePlayer = deriveActivePlayer(prevTurns);

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: activePlayer },
        ...prevTurns,
      ];

      return updatedTurns;
    });
  }

  function handleRestart() {
       setGameTurns([])
  }

  function handlePlayerNameChange(symbol, newName) {
         setPlayers(prevPlayers => {
          return {
            ...prevPlayers,
            [symbol]: newName
          }
         })
  }
  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={activePlayer === "X"}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={activePlayer === "O"}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart = {handleRestart}/>}
        <GameBoard
          onSelectSquare={handleSelectSquare}
          // turns={gameTurns}
          board={gameBoard}
        />
      </div>
      <Log turns={gameTurns} />
    </main>
  );
}

export default App;
