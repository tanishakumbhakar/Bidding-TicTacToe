import React, { Component } from 'react'
import Board from './Board';

const Bet = props => {
    return(
      <input type="number" onChange={props.onChange} value={props.default} />
    )
  }

export default class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
           // xIsNext: true,
            squares: Array(9).fill(null),
            message: "",
            current: {player:"X", points:100, bet:50,square:-1},
            other: {player:"O", points:100, bet:50,square:-1},
            
        };
    }
    newGame() {
        this.setState({
          squares: Array(9).fill(null),
          message: "",
          current: {player:"X", points:100, bet:50, square:-1},
          other: {player:"O", points:100, bet:50, square:-1},
        });
      }
    
      isValidBet(player) {
        if( player.bet >=0 && player.bet <= player.points)
          return true
        else 
          return false
      }
    
      isValidMove(player) {
        if(this.isValidBet(player) && player.square >= 0 && player.square < 9) 
          return true
        else 
          return false
      }
    
      makeMove(p1, p2, squares) {
        let winner, loser;
        if(p1.bet > p2.bet) {
          winner = p1;
          loser = p2;
        } else if(p1.bet < p2.bet) {
          winner = p2;
          loser = p1;
        } else {
          return "Tie";
        }
    
        squares[winner.square] = winner.player;
        winner.points -= winner.bet;
        loser.points += 0;
        return winner.player + " has won the move with " + winner.bet + " points";
      }
   

    handleClick(i) {
        
        const squares = this.state.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
          }
      
          let current = {
            player:this.state.current.player,
            points:this.state.current.points,
            bet:this.state.current.bet,
            square:i,
          }
          let other = {
            player:this.state.other.player,
            points:this.state.other.points,
            bet:this.state.other.bet,
            square:this.state.other.square,
          }
          let message = "";
      
      
          if( this.isValidMove(other) ) {
            message = this.makeMove(current,other,squares);
            current.square = -1;
            current.bet = Math.floor(current.points/2);
            other.square = -1;
            other.bet = Math.floor(other.points/2);
          }
      
          this.setState({
            squares:squares,
            current: other,
            other: current,
            message: message,
          });

    }
    changeBet(event) {
        let bet = Math.floor(event.target.valueAsNumber)
        let current = { 
          player:this.state.current.player,
          points:this.state.current.points,
          bet:bet,
          square:-1,
        }
        if(this.isValidBet(current)) {
          this.setState({message:"",current:current})
        } else {
          this.setState({message: "Not enough points"})
        }
      }

    render() {
        const current = this.state;

        const winner = calculateWinner(current.squares);
        let status;
        if (winner) {
          status = 'Winner: ' + winner;
        } else {
          status = 'Next player: ' + this.state.current.player;
        }
    
        return (
          <div className="game">
            <div>
              <Board
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
            <div className="game-info">
              <div>{status}</div>
              <div>Bet <input className="bet-input" type="number" onChange={i => {this.changeBet(i)}} value={this.state.current.bet} /> points</div>
              <div>{this.state.current.points} points left</div>
              <div>Your opponent has {this.state.other.points} points left</div>
              <div>{this.state.message}</div>
            </div>
          </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
            return squares[a];
        }
    }

    return null;
}