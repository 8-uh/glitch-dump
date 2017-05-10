class Segment extends Phaser.Sprite {
  constructor(game, x ,y, color, width, anchor) {
    if(!anchor) {
      anchor = new Phaser.Point(0, 0.5);
    }
    let bmd = game.make.bitmapData(width, 20);
    let ctx = bmd.ctx;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, 20);
    super(game, x, y, bmd);
    this.anchor = anchor;
  }
  
  get pin() {
    return new Phaser.Point(
      this.x + Math.cos(this.rotation) * (this.width),
      this.y + Math.sin(this.rotation) * (this.width)
    );    
  }
}

let game = null;
let seg1, seg2, seg3, target;
let direction = 1;
let segments = [];
let segWidth = 150;
let numSegs = 3;

function create() {
  for(var i = 0; i < numSegs; i++) {
    var seg = new Segment(game, game.width * 0.5 , game.height * 0.5,'white', segWidth );
    segments.push(seg);
    game.add.existing(seg);
  }

  target = game.add.sprite(0, game.height * 0.5);
  target.anchor.setTo(0.5, 0.5);
  
}

function update() {
  target.x += 0.5 * direction;
      if(target.x >= game.width || target.x <= 0) {
        direction *= -1;
      }
      target.y = Math.sin(game.time.now * 0.001) * (game.height * 0.5) + game.height * 0.5;
  segments.forEach((seg, index, segments) => {
    let prev = null,
        dx,
        dy;
    if(index === 0) {
            
      dx = target.x - seg.x;
      dy = target.y - seg.y;
      seg.rotation = Math.atan2(dy, dx);
    } else {
      prev = segments[index-1];
      let w = prev.pin.x - prev.x;
      let h = prev.pin.y - prev.y;
      let tx = target.x - w;
      let ty = target.y - h;
      dx = tx - seg.x;
      dy = ty - seg.y;
      seg.rotation = Math.atan2(dy, dx);
      
      prev.x = seg.pin.x;
      prev.y = seg.pin.y;
    }

    

  });


  
}

function render() {
  game.debug.spriteBounds(target, 'rgba(0,255,255,1.0)');
}

game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {create: create, update: update, render: render});
