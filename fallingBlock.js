let is_touching_ground = false;
let is_locked = false;

let falling_block;

let current_corner_position = new Vector2(0, 0);
let temp_corner_position = new Vector2(0, 0);

let wall_kick_data = [
  new Vector2(0, 0),
  new Vector2(1, 0),
  new Vector2(-1, 0),
  new Vector2(0, -1)
  // new Vector2(2, 0),
  // new Vector2(-2, 0)
]

let current_block_positions = [
  new Vector2(0, 0),
  new Vector2(0, 0),
  new Vector2(0, 0),
  new Vector2(0, 0)
];

let ghost_piece_positions = [
  new Vector2(0, 0),
  new Vector2(0, 0),
  new Vector2(0, 0),
  new Vector2(0, 0)
];

let temp_rotation_positions = [
  new Vector2(0, 0),
  new Vector2(0, 0),
  new Vector2(0, 0),
  new Vector2(0, 0)
]

function initFallingBlock(){
  
  falling_block = get_tetris_block();
  for(let i = 0; i < 4; i++){
    current_block_positions[i].updateValue(0, 0);
  }
  
  //We Start 3 Blocks From The Left & 2 Blocks Above the Grid
  let xPosition = 3 * block_size;
  let yPosition = -3 * block_size;
  
  current_corner_position.updateValue(xPosition, yPosition);
  
  let block_position_index = 0;
  for(let i = 0; i < 4; i++){
    for(let j = 0; j < 4; j++){
      if(falling_block.getCurrentMatrix()[i][j] == 1){
        let x_position = current_corner_position.x + (j * block_size);
        let y_position = current_corner_position.y + (i * block_size);
    current_block_positions[block_position_index].updateValue(x_position, y_position);
        block_position_index++;
      }
      
      if(block_position_index > 3){
        break;
      }
    }
  }
  
  for(let i = 0; i < 4; i++){
    let x_position = current_block_positions[i].x;
    let y_position = current_block_positions[i].y;
    if(checkIfOccupiedOnBoard(x_position, y_position)){
      return false;
    }
  }
  
  is_locked = false;
  is_touching_ground = false;
  
  return true;
}

function drawFallingBlock(){
  
  if(!falling_block){
    return;
  }
    
  if(is_locked){
    return;
  }
    
  drawGhostPiece();
  
  strokeWeight(1.75);
  stroke("#fff");
    
  fill(falling_block.block_color)
  for(let i = 0; i < current_block_positions.length; i++){
    let x_position = current_block_positions[i].x;
    let y_position = current_block_positions[i].y;
    square(x_position, y_position, block_size);  
  }
}

function drawGhostPiece(){
  
  strokeWeight(2.5);
  stroke("#3B3B3B");
  
  updateGhostPiecePosition();
  fill(225, 225, 225, 25);
  for(let i = 0; i < ghost_piece_positions.length; i++){
    let x_position = ghost_piece_positions[i].x;
    let y_position = ghost_piece_positions[i].y;
    square(x_position, y_position, block_size);  
  }
}

function lockFallingBlock(){
  fixBlockOnBoard(current_block_positions, falling_block.block_color);
  playSound(piece_locked_sfx_name);
  
  is_touching_ground = false;
  is_locked = true;
  
  current_corner_position.updateValue(0, 0);
  
  for(let i = 0; i < 4; i++){
    current_block_positions[i].updateValue(0, 0);
  }
}

function updatePosition(horizontal, vertical){
  if(is_locked)
    return;
    
  if(horizontal != 0){
    if(canMoveHorizontally(horizontal)){
      for(let i = 0; i < 4; i++){
        current_block_positions[i].x += horizontal * block_size;
      }
      current_corner_position.x += horizontal * block_size;
    }
  }
  
  is_touching_ground = !canMoveVertically();
  if(!is_touching_ground){
    if(vertical != 0){
      for(let i = 0; i < 4; i++){
        current_block_positions[i].y += vertical * block_size;
      }
      current_corner_position.y += vertical * block_size;  
    }
  }
}

function canMoveVertically(){
  for(let i = 0; i < 4; i++){
    let bottom_block_y = current_block_positions[i].y + block_size;
    if(bottom_block_y > getBottomBounds()){
      return false;
    }
    
    if(checkIfOccupiedOnBoard(current_block_positions[i].x, bottom_block_y)){
      return false;
    }
  }
  
  return true;
}

function canMoveHorizontally(horizontalInput){
    for(let i = 0; i < 4; i++){
      let next_block_x = current_block_positions[i].x;
      if(horizontalInput == -1){
        let left_block_x = current_block_positions[i].x - block_size;
        if(left_block_x < getLeftBounds()){
          return false;
        } 
        next_block_x = left_block_x;
      }
      else if(horizontalInput == 1){
        let right_block_x = current_block_positions[i].x + block_size;
        if(right_block_x > getRightBounds()){
          return false;
        }
        next_block_x = right_block_x;
      }

      if(checkIfOccupiedOnBoard(next_block_x, current_block_positions[i].y)){
        return false;
      }
  }
  
  return true;
}

function rotateFallingBlock(){
  if(!falling_block){
    return;
  }
  
  for(let i = 0; i < wall_kick_data.length; i++){
    
    let block_position_index = 0;
    let x_offset = wall_kick_data[i].x * block_size;
    let y_offset = wall_kick_data[i].y * block_size;
    
    temp_corner_position.x = current_corner_position.x + x_offset;
    temp_corner_position.y = current_corner_position.y + y_offset;
    
    for(let j = 0; j < 4; j++){
      for(let k = 0; k < 4; k++){
        if(falling_block.getNextMatrix()[j][k] == 1){
          let x_position = temp_corner_position.x + (k * block_size);
          let y_position = temp_corner_position.y + (j * block_size);

          if(!checkIfValidIndex(x_position, y_position)){
            break;
          }

          if(checkIfOccupiedOnBoard(x_position, y_position)){
            break;
          }
          temp_rotation_positions[block_position_index].updateValue(x_position, y_position);
          block_position_index++;
        }

        if(block_position_index > 3){
          break;
        }
      }
    }
    
    if(block_position_index < 4){
      continue;
    }
    
    current_corner_position.x = temp_corner_position.x;
    current_corner_position.y = temp_corner_position.y;

    falling_block.updateRotationIndex();
    for(let j = 0; j < temp_rotation_positions.length; j++){
      current_block_positions[j].x = temp_rotation_positions[j].x;
      current_block_positions[j].y = temp_rotation_positions[j].y;
    }
    
    playSound(rotate_piece_sfx_name);
    
    return;
  }
}

function updateGhostPiecePosition(){
  let is_occupied = false;
  let current_y_offset = 1;
  while(!is_occupied){
    for(let i = 0; i < 4; i++){
      let x_position = current_block_positions[i].x;
      let y_position = current_block_positions[i].y + (current_y_offset * block_size);
      
      if(checkIfOccupiedOnBoard(x_position, y_position)){
        current_y_offset--;
        is_occupied = true;
        break;
      }
      
      if(!checkIfValidIndex(x_position, y_position)){
        current_y_offset--;
        is_occupied = true;
        break;
      }
    }
    
    if(!is_occupied){
      current_y_offset++;
    }
  }
  
  for(let i = 0; i < 4; i++){
    let x_position = current_block_positions[i].x;
    let y_position = current_block_positions[i].y + (current_y_offset * block_size);
    ghost_piece_positions[i].updateValue(x_position, y_position);
  }
}