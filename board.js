let columns = 10;
let rows = 25;
let start_row_index = 5;

let block_size = 27.5;
let board = [];
let max_bounds = new Vector2(0, 0);
let min_bounds = new Vector2(0, 0);

let row_column_index = {};
let can_clear_rows = false;

function generateBoard(){
  for(let i = 0; i < rows; i++){
    board[i] = [];
    let y_position = (i-start_row_index) * block_size
    for(let j = 0; j < columns; j++){
      let x_position = j * block_size;
      board[i][j] = new Block(x_position, y_position);
    }
  }  
  
  min_bounds.updateValue(0, 0);
  max_bounds.updateValue((columns-1) * block_size, (rows-1-start_row_index) * block_size);
  row_column_index = new Vector2(0, 0);
}

function resetBoard(){
  for(let i = 0; i < rows; i++){
    createEmptyRow(i);
  }
  is_row_full = false;
}

function drawBoard(){
  rectMode(CORNER); 
  for(let i = start_row_index; i < rows; i++){
    for(let j = 0; j < columns; j++){
      board[i][j].draw();
    }
  }
}

function fixBlockOnBoard(positions, blockColor){
  for(let i = 0; i < positions.length; i++){  
    setRowColumnIndex(positions[i].x, positions[i].y);
    
    board[row_column_index.x][row_column_index.y].setOccupied(true, blockColor);
  }
  
  for(let i = 0; i < positions.length; i++){
    setRowColumnIndex(0, positions[i].y);
    let occupied = true;
    for(let j = 0; j < columns; j++){
      if(!board[row_column_index.x][j].occupied){
        occupied = false;
        break;
      }
    }
    if(occupied){
      can_clear_rows = true;
      break;
    }
  }
}

function checkIfValidIndex(xPosition, yPosition){
  setRowColumnIndex(xPosition, yPosition);
  if(row_column_index.x < 0 || row_column_index.y < 0){
    return false;
  }
  
  if(row_column_index.x >= rows || row_column_index.y >= columns){
    return false;    
  }
  
  return true;
}

function checkIfOccupiedOnBoard(xPosition, yPosition){  
  if(!checkIfValidIndex(xPosition, yPosition)){
    return false;
  }
    
  setRowColumnIndex(xPosition, yPosition);
  return board[row_column_index.x][row_column_index.y].occupied;
}

function clearRows(){
  
  if(!can_clear_rows){
    return;
  }
  
  let full_row_index = rows - 1;
  let rows_cleared = 0;
  for(let i = rows - 1; i >= 0; i--){
    let isRowOccupied = checkIfRowIsFull(i);
    if(!isRowOccupied){
      for(let j = 0; j < columns; j++){
        board[full_row_index][j].setOccupied(board[i][j].occupied, board[i][j].block_color);
      }
      full_row_index--;
    }
    else{
      rows_cleared += 1;
    }
  }
  
  for(let i = full_row_index; i >= 0; i--){
    createEmptyRow(i);
  }
  
  playSound(line_clear_sfx_name);
  updateScore(rows_cleared);
  can_clear_rows = false;
}

function checkIfRowIsFull(rowIndex){
  for(let i = 0; i < columns; i++){
    if(!board[rowIndex][i].occupied){
      return false;
    }
  }
  return true;
}

function createEmptyRow(rowIndex){
  for(let i = 0; i < columns; i++){
    board[rowIndex][i].setOccupied(false, '#000');
  }
}

function getLeftBounds(){
  return min_bounds.x;
}

function getBottomBounds(){
  return max_bounds.y;
}

function getRightBounds(){
  return max_bounds.x;
}

function setRowColumnIndex(xPosition, yPosition){
  row_column_index.x = ((int) (yPosition / block_size)) + start_row_index;
  row_column_index.y = (int) (xPosition / block_size);
}

class Block{
  constructor(x, y){
    this.position = new Vector2(x, y);
    this.setOccupied(false, color('#000'))
  }
  
  setOccupied(occupiedStatus, blockColor){
    this.block_color = blockColor;
    this.occupied = occupiedStatus;
    if(this.occupied){
      this.stroke_color = color('#000');
      this.stroke_weight = 0.75;
    }
    else{
      this.stroke_color = color('#992D8D');   // Light Maroon Color
      // this.stroke_color = color('#f7ef8a');  //Light Golden Color
      this.stroke_weight = 0.15;
    }
  }
  
  draw(){
    stroke(this.stroke_color);
    strokeWeight(this.stroke_weight);
    fill(this.block_color);
    square(this.position.x, this.position.y, block_size);
  }
}