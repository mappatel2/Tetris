const line_clear_sfx_name = 'Line_Clear'
const game_over_sfx_name = 'Game_Over'
const piece_locked_sfx_name = 'Piece_Locked'
const rotate_piece_sfx_name = 'Rotate_Piece'
let bg_music;
let line_clear_sfx;
let game_over_sfx;
let piece_locked_sfx;
let rotate_piece_sfx;

let game_height = 550;
let game_width = 750;

let move_down_timer = 0;
let move_down_interval = 0.8;

let shift_repeat_interval = 0.03;
let shift_delay_interval = 0.17;

let is_left_pressed = false;
let left_shift_hold_timer = 0;
let left_shift_repeat_timer = 0

let is_right_pressed = false;
let right_shift_hold_timer = 0;
let right_shift_repeat_timer = 0

let is_down_pressed = false;
let down_shift_repeat_timer = 0;

let is_up_pressed = false;

let target_lock_counts_allowed = 20;
let target_lock_interval = 0.3;
let target_lock_counts = 0;
let target_lock_timer = 0;
let target_lock_timer_started = true;
let can_lock_block = false;

let spawn_timer = 0;
let spawn_timer_interval = 0.2;

let current_input;
let spawn_falling_block = true;
let current_score = 0;
let current_level = 1;
let row_scores = [40, 100, 300, 1200];

let is_game_over = false;
let timer_to_start_game = 0;
let timer_to_start_game_interval = 2;

function preload(){
  bg_music = loadSound('/Audio/Tetris.mp3');
  line_clear_sfx = createAudio('/Audio/Tetris_Line_Clear.mp3');
  game_over_sfx = createAudio('/Audio/Tetris_Game_Over.mp3')
  piece_locked_sfx = createAudio('/Audio/Tetris_Piece_Landed.mp3');
  rotate_piece_sfx = createAudio('/Audio/Tetris_Rotate_Piece.mp3');
}

function setup() {
  createCanvas(game_height, game_height);
  start();
  
  bg_music.setVolume(0.025)
  bg_music.loop();
  
  line_clear_sfx.volume(0.2);
  game_over_sfx.volume(0.2);
  piece_locked_sfx.volume(0.2);
  rotate_piece_sfx.volume(0.2);
  
  // bg_music.rate(0.65)
}

function start() {
  current_input = new Vector2(0, 0);
  generateBoard();
  init_tetris_blocks();
  spawn_falling_block = true;
  current_score = 0;
  current_level = 1;
  spawn_timer = spawn_timer_interval;
  timer_to_start_game = timer_to_start_game_interval;
  is_game_over = false;
}

function resetGame(){
  current_input = new Vector2(0, 0);
  bg_music.loop();
  resetBoard();
  reset_tetris_blocks();
  spawn_falling_block = true;
  current_score = 0;
  spawn_timer = spawn_timer_interval;
  timer_to_start_game = timer_to_start_game_interval;
  is_game_over = false;
}

function draw() {
  background(25);
  update();
  render();
}

function update() {
  if (spawn_falling_block) {
    if (spawn_timer <= 0) {
      spawn_timer = spawn_timer_interval;
      clearRows();
      spawn_falling_block = false;
      is_game_over = !initFallingBlock();
      if(is_game_over){
        playSound(game_over_sfx_name);
        bg_music.stop();
      }
    } else {
      spawn_timer -= 0.0125;
      return;
    }
  }
  
  if(is_game_over){
    if(timer_to_start_game <= 0){
      timer_to_start_game = timer_to_start_game_interval;
      resetGame();
      return;
    }
    timer_to_start_game -= 0.0125;
    return;
  }

  updateInput();
  if (current_input.x != 0 || current_input.y != 0) {
    updatePosition(current_input.x, current_input.y);
    if(is_touching_ground){
      if(!target_lock_timer_started){
        target_lock_timer_started = true;
      }
    }
    else{
      target_lock_timer_started = false;
      target_lock_timer = 0;
      target_lock_timer_counts = 0;
    }
  }

  if (updateMoveDownTimer()) {
    updatePosition(0, 1);
    if(is_touching_ground){
      if(!target_lock_timer_started){
        target_lock_timer_started = true;
      }
    }
    else{
      target_lock_timer_started = false;
      target_lock_timer = 0;
      target_lock_timer_counts = 0;
    }
  }
  
  if(target_lock_timer_started){
    updateTargetLockTimer();
  }
  
  if(can_lock_block){
    if(is_touching_ground){
      lockFallingBlock();
      
      target_lock_timer = 0;
      target_lock_timer_counts = 0;
      target_lock_timer_started = false;
      can_lock_block = false;
      spawn_falling_block = true;
    }
  }

  current_input.updateValue(0, 0);
}

function render() {
  drawBoard();
  
  if(is_game_over){
    return;
  }
  
  drawFallingBlock();
  drawUi();
}

function updateInput() {
  if (keyIsDown(LEFT_ARROW)) {
    if(!is_left_pressed){
      is_left_pressed = true;
      current_input.x = -1;
      resetTargetLockTimer();
    }
    else{
      if(left_shift_hold_timer <= shift_delay_interval){
        left_shift_hold_timer += 0.0125;  
      }
      else{
        if(left_shift_repeat_timer <= 0){
          current_input.x = -1;
          left_shift_repeat_timer = shift_repeat_interval;
          resetTargetLockTimer();
        }
        else{
          left_shift_repeat_timer -= 0.0125;
        }
      }
    }
  }
  else{
    is_left_pressed = false;
    left_shift_hold_timer = 0;
    left_shift_repeat_timer = 0;
  }
  
  if (keyIsDown(RIGHT_ARROW)) {
    if(!is_right_pressed){
      is_right_pressed = true;
      current_input.x = 1;
      resetTargetLockTimer();
    }
    else{
      if(right_shift_hold_timer <= shift_delay_interval){
        right_shift_hold_timer += 0.0125;  
      }
      else{
        if(right_shift_repeat_timer <= 0){
          current_input.x = 1;
          resetTargetLockTimer();
          right_shift_repeat_timer = shift_repeat_interval;
        }
        else{
          right_shift_repeat_timer -= 0.0125;
        }
      }
    }
  }
  else{
    is_right_pressed = false;
    right_shift_hold_timer = 0;
    right_shift_repeat_timer = 0;
  }
  
  if(keyIsDown(DOWN_ARROW)){
    if(!is_down_pressed){
      is_down_pressed = true;
      current_input.y = 1;
      resetTargetLockTimer();
      down_shift_repeat_timer = 0;
    }
    else{
      if(down_shift_repeat_timer > shift_repeat_interval){
        current_input.y = 1;
        down_shift_repeat_timer = 0;
        resetTargetLockTimer();
      }
      else{
        down_shift_repeat_timer += 0.0125;
      }
    }
  }
  else{
    is_down_pressed = false;
    down_shift_repeat_timer = 0;
  }
  
  if(keyIsDown(UP_ARROW)){
    if(!is_up_pressed){
      is_up_pressed = true;
      rotateFallingBlock();
      resetTargetLockTimer();
    }
  }
  else{
    is_up_pressed = false;
  }
}

function updateMoveDownTimer() {
  if (move_down_timer <= 0) {
    move_down_timer = move_down_interval;
    return true;
  }

  move_down_timer -= 0.0125;
  return false;
}

function updateTargetLockTimer() {
  target_lock_timer += 0.0125;
  if(target_lock_timer < target_lock_interval){
    return;
  }
  
  can_lock_block = true;
}

function resetTargetLockTimer(){
  if(!target_lock_timer_started){
    return;
  }
  
  if(target_lock_counts > target_lock_counts_allowed){
    return;
  }
  
  target_lock_counts++;
  target_lock_timer = 0;
}

function playSound(soundType){
  if(soundType == line_clear_sfx_name){
    line_clear_sfx.play();
 }
  else if(soundType == game_over_sfx_name){
    game_over_sfx.play();
  }
  else if(soundType == piece_locked_sfx_name){
    piece_locked_sfx.play();
  }
  else if(soundType == rotate_piece_sfx_name){
    rotate_piece_sfx.play();
  }
}

function updateScore(rowsCleared) {
  if(rowsCleared > 4){
    rowsCleared = 4;
  }
  
  if(rowsCleared < 0){
    rowsCleared = 0;
  }
  
  current_score += current_level * row_scores[rowsCleared - 1];
}

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  updateValue(x, y) {
    this.x = x;
    this.y = y;
  }
}
