import { useState } from 'react';
import Player from './components/Player.jsx';
import GameBoard from './components/GameBoard.jsx';
import Log from './components/Log.jsx';
import GameOver from './components/GameOver.jsx';
import {WINNING_COMBINATIONS} from './winning-combinations.js';

const PLAYERS = { 
  X: 'Player 1', 
  O: 'Player 2' 
};

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
];

function deriveActivePlayer(gameTurns){
  let currentPlayer = 'X';
  if( gameTurns.length>0 && gameTurns[0].player==='X' )
    currentPlayer = 'O';

  return currentPlayer;
}

function deriveGameBoard(gameTurns){
  let gameBoard = [...INITIAL_GAME_BOARD.map( innerArray => [...innerArray])];
  for (const turn of gameTurns){
      const {square, player} = turn;
      const {row,col} = square;

      gameBoard[row][col] = player;
  }

  return gameBoard;
}

function deriveWinner(gameBoard, players){
  let winner;
  for (const combination of WINNING_COMBINATIONS){
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if(firstSquareSymbol && (firstSquareSymbol === secondSquareSymbol) && (firstSquareSymbol === thirdSquareSymbol))
      winner = players[firstSquareSymbol];

  }

  return winner;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const hasDraw = gameTurns.length===9 && !winner;

  function handleSelectSquare(rowIndex, colIndex){
    setGameTurns( prevGameTurns => {
      const currentPlayer = deriveActivePlayer(prevGameTurns);
      const updatedGameTurns = [ 
        {square: {row: rowIndex, col: colIndex}, player: currentPlayer}, 
        ...prevGameTurns
      ];

      return updatedGameTurns;
    });
  }

  function handleRematch(){
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName){
    setPlayers( prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName
      }
    });
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className='highlight-player'>
          <Player name={PLAYERS.X} symbol="X" isActive={activePlayer === 'X'} onChangeName={handlePlayerNameChange} />
          <Player name={PLAYERS.O} symbol="O" isActive={activePlayer === 'O'} onChangeName={handlePlayerNameChange} />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRematch={handleRematch} />}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns}/>
    </main>
  );
}

export default App
