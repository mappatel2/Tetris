let preview_positions = [];
let last_preview_position = new Vector2(0, 0);
let preview_corner_position = new Vector2(0, 0);
let tetris_blocks = [];
let preview_bag = [];

let shuffled_bag = [];
let blocks_used_from_shuffled_bag = 0;

function init_tetris_blocks(){
  init_i_block();
  init_o_block();
  init_t_block();
  init_s_block();
  init_z_block();
  init_l_block();
  init_j_block();
  
  init_shuffled_bag();
  init_preview_bag();
  
  init_preview_positions();
  
  preview_corner_position.x = 3;
  preview_corner_position.y = 13;
}

function reset_tetris_blocks(){
  init_shuffled_bag();
  init_preview_bag();
}

function init_preview_bag(){
  for(let i = 0; i < 4; i++){
    preview_bag[i] = get_block_from_shuffled_bag()
  }
}

function init_shuffled_bag(){
  for(let i = 0; i < tetris_blocks.length; i++){
    shuffled_bag[i] = i;
  }
  
  let current_index, temp_val, next_index;
  for(let i = shuffled_bag.length - 1; i > -1; i--){
    current_index = i;
    next_index = (int)(random(0, current_index + 1))
    temp_val = shuffled_bag[current_index];
    shuffled_bag[current_index] = shuffled_bag[next_index];
    shuffled_bag[next_index] = temp_val;
  }
  
  blocks_used_from_shuffled_bag = 0;
}

function init_preview_positions(){
  for(let i = 0; i < tetris_blocks.length; i++){
    let position_matrix = tetris_blocks[i].getMatrix(0);
    preview_positions[i] = [];
    
    for(let j = 0; j < position_matrix.length; j++){
      for(let k = 0; k < position_matrix[j].length; k++){
        if(position_matrix[j][k] == 1){
          //For Block 'I' & 'T' Shift One Row Above
          if(i < 2){
            preview_positions[i].push(new Vector2(j-1, k));
          }
          else{
            preview_positions[i].push(new Vector2(j, k + 0.5));
          }
        }
      }
    }
  }
}

function get_tetris_block(){
  let block_index = get_block_from_preview_bag();
  let tetris_block = tetris_blocks[block_index];
  
  return new tetrisBlock(tetris_block.block_color, tetris_block.rotation_matrix);
}

function drawPreviewBag(){
  
  let distance_from_above = preview_corner_position.x;
  let distance_from_left = preview_corner_position.y;
  
  fill(0)
  stroke('#fff')
  strokeWeight(5)
  rect((distance_from_left - 1) * block_size, (distance_from_above-1) * block_size, block_size * 6, block_size * 13)
  
  stroke(0)
  strokeWeight(0.5)
   for(let i = 0; i < preview_bag.length; i++){
     let block_index = preview_bag[i];
     let tetris_block = tetris_blocks[block_index];
     let preview_block_positions = preview_positions[block_index];
     
     fill(tetris_block.block_color)
     for(let j = 0; j < preview_block_positions.length; j++){
       last_preview_position.x = preview_block_positions[j].x + distance_from_above;
       last_preview_position.y = preview_block_positions[j].y + distance_from_left;
         
       square(last_preview_position.y * block_size, last_preview_position.x * block_size, block_size)
     }
     
     distance_from_above = last_preview_position.x;
     distance_from_above += 2;
   } 
}

function get_block_from_preview_bag(){
  
  if(!preview_bag){
    init_preview_bag();
  }
  
  let block_index = preview_bag[0];
  for(let i = 0; i < 3; i++){
    preview_bag[i] = preview_bag[i+1];
  }
  
  //Adding New Piece To Bag
  preview_bag[3] = get_block_from_shuffled_bag();
  
  return block_index;
}

function get_block_from_shuffled_bag(){
  if(blocks_used_from_shuffled_bag >= 7 || !shuffled_bag){
    init_shuffled_bag();
  }
  
  let block_index = shuffled_bag[blocks_used_from_shuffled_bag];
  blocks_used_from_shuffled_bag++;
  return block_index;
}

function init_i_block(){
  let rotation_matrix = [
    [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ]
  ];
  
  tetris_blocks.push(new tetrisBlock('#00f0f0', rotation_matrix))
}

function init_o_block(){
  let rotation_matrix = [
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ]
  ];
  
  tetris_blocks.push(new tetrisBlock('#f0f000', rotation_matrix))
}

function init_t_block(){
  let rotation_matrix = [
    [
      [0, 1, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ];
  
  tetris_blocks.push(new tetrisBlock('#a000f0', rotation_matrix))
}

function init_s_block(){
  let rotation_matrix = [
    [
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [0, 1, 1, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [1, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ];
  
  tetris_blocks.push(new tetrisBlock('#00f000', rotation_matrix))
}

function init_z_block(){
  let rotation_matrix = [
    [
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0],
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ]
  ];
  
  tetris_blocks.push(new tetrisBlock('#f00000', rotation_matrix))
}

function init_l_block(){
  let rotation_matrix = [
    [
      [0, 0, 1, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [1, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ];
  
  tetris_blocks.push(new tetrisBlock('#f0a000', rotation_matrix))
}

function init_j_block(){
  let rotation_matrix = [
    [
      [1, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 1, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 0, 0, 0],
      [1, 1, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 0]
    ],
    [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [1, 1, 0, 0],
      [0, 0, 0, 0]
    ]
  ];
  
  tetris_blocks.push(new tetrisBlock('#0000f0', rotation_matrix))
}

class tetrisBlock{
  constructor(blockColor, rotationMatrix){
    this.block_color = color(blockColor);
    this.rotation_matrix = rotationMatrix;
    this.rotation_index = 0;
  }
  
  getCurrentMatrix(){
    return this.getMatrix(this.rotation_index);  
  }
  
  getNextMatrix(){
    if(this.rotation_index + 1 > this.rotation_matrix.length - 1){
      return this.getMatrix(0);
    }
    else{
      return this.getMatrix(this.rotation_index + 1);
    }
  }
  
  getMatrix(rotationIndex){
    return this.rotation_matrix[rotationIndex];
  }
  
  updateRotationIndex(){
    this.rotation_index += 1;
    if(this.rotation_index >= this.rotation_matrix.length){
      this.rotation_index = 0;
    }
  }
}