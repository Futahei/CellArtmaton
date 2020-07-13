const CELL_SIZE = 3;
const CELLS = [];
const MAX_STATES = 3;
const FLUCTUATION = 0.0;
let STATE_TRANSITION_RULE = {};
const MODE_COLOR = [];
let ORDER = "";

function setup()
{
  createCanvas(windowWidth, windowHeight);
  noStroke();
  background(0);

  /**
   * 状態遷移規則を設定。
   * 文字列の指定があれば、それを使う。
   */
  if (ORDER == "")
  {
    ORDER = Math.random().toString(36).slice(-10);
  }
  const states = parseInt(ORDER, 36).toString(MAX_STATES).split('');
  for(let left = 0; left < MAX_STATES; left++)
  {
    for (let center = 0; center < MAX_STATES; center++)
    {
      for (let right = 0; right < MAX_STATES; right++)
      {
        STATE_TRANSITION_RULE[[left,center,right].join(",")] = states[right+center*MAX_STATES+left*MAX_STATES*MAX_STATES]||"0";
      }
    }
  }

  /** 状態に応じた色の設定 */
  MODE_COLOR.push([255, 255, 255]);
  for (let i = 0; i < MAX_STATES-1; i++)
  {
    MODE_COLOR.push([Math.random()*255, Math.random()*255, Math.random()*255]);
    // MODE_COLOR.push([0, 0, 0]); 白黒がお好みの場合はこちら
  }

  /** セルを生成 */
  let present = null;
  for (let i = 0; i < Math.floor(windowWidth/CELL_SIZE); i++)
  {
    const cell = new Cell(Math.floor(Math.random()*MAX_STATES));
    if(present) present.rightCell = cell;
    cell.leftCell = present;
    CELLS.push(cell);
    present = cell;
  }

  /** 画面一杯になるまで世代を更新して描画 */
  for (let i = 0; i < Math.floor(windowHeight/CELL_SIZE); i++)
  {
    CELLS.forEach((cell, index)=>
    {
      if (cell.nextMode>=0)
      {
        cell.mode = cell.nextMode;
      }
      push();
        fill(MODE_COLOR[cell.mode]);
        square(index*CELL_SIZE, i*CELL_SIZE, CELL_SIZE);
      pop();
      cell.next();
    });
  }

  /** ルールを文字として描画 */
  stroke(255);
  strokeWeight(10);
  fill([
    MODE_COLOR.reduce((total,col)=>{return total+col[0];},0)/MAX_STATES,
    MODE_COLOR.reduce((total,col)=>{return total+col[1];},0)/MAX_STATES,
    MODE_COLOR.reduce((total,col)=>{return total+col[2];},0)/MAX_STATES
  ]);
  textSize(width/20);
  textAlign(CENTER, CENTER);
  text("Rule "+ORDER.toUpperCase(), width/2, height/2);
}

/** 状態を保存して次世代の状態を得るクラス */
class Cell
{
  constructor(mode)
  {
    this.mode = mode;
    this.leftCell = null;
    this.rightCell = null;

    this.nextMode = -1;
  }

  next()
  {
    const l = this.leftCell  ? this.leftCell.mode  : 0;
    const c = this.mode;
    const r = this.rightCell ? this.rightCell.mode : 0;

    this.nextMode = Math.random() > FLUCTUATION ? STATE_TRANSITION_RULE[[l, c, r].join(",")] : Math.floor(Math.random()*MAX_STATES);
  }
}