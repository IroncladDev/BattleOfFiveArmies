add([
  sprite("land")
])
layers([
  "back",
  "units",
  "ui",
  "select",
  "cursor",
], "obj");
gravity(0);

function dist(x, y, x2, y2) {
  return Math.sqrt(Math.abs(x2 - x) ** 2 + Math.abs(y2 - y) ** 2);
}
function ang(a){
  return Math.PI/180 * a;
}

let team = "dwarves";
let cursor = add([
  sprite("cursor0"),
  layer("cursor"),
  pos(mousePos().x, mousePos().y),
  "cursor",
  {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
    clicked: false,
    hasStarted: false,
    selected: false,
    isSelecting: false,
  }
]);
let select = add([
  layer("select"),
  rect(0, 0),
  pos(0, 0),
  color(rgba(1, 1, 1, 0.5)),
]);
let orc = add([
  body(),
  sprite("orc-attack-0"),
  pos(200, 100),
  "orc",
  {
    health: 25,
    rot: 0,
    damage: 5,
    regen: 1,
    team: 0,
    range: 75,
    attackRange: 20,
    armor: 15,
    speed: 25,
    selected: false,
    idle: true,
    maxDamage: 5,
    maxHealth: 25,
    target: null,
    targeting: false,
    dead: false,
    x: 0,
    y: 0,
  },
  "unit",
  "bad",
  origin("center")
]);
let dwarf = add([
  body(),
  sprite("dwarf-attack-0"),
  pos(100, 100),
  "unit",
  "dwarf",
  "good",
  "meelee",
  {
    health: 35,
    rot: 0,
    damage: 7.5,
    regen: 1,
    team: 0,
    range: 75,
    attackRange: 20,
    armor: 25,
    speed: 15,
    selected: false,
    idle: true,
    maxDamage: 5,
    maxHealth: 25,
    target: null,
    targeting: false,
    dead: false,
    x: 0,
    y: 0,
    gox: 0,
    goy: 0,
    moving: false,
  },
  origin("center")
])


action("dwarf", (o) => {
  o.x = o.pos.x;
  o.y = o.pos.y;
  o.rot = o.angle;
  if(cursor.selected && o.x > cursor.x && o.x < cursor.x2 && o.y > cursor.y && o.y < cursor.y2){
    o.changeSprite("dwarf-selected");
    o.selected = true;
    cursor.hasSelected = true;
  }
  if(o.selected && cursor.clicked){
    o.gox = cursor.x;
    o.goy = cursor.y;
    o.rot = Math.atan2(o.goy - o.y, o.gox - o.x);
    o.angle = -o.rot;
    o.moving = true;
  }
  if(o.moving){
    o.move(Math.cos(-o.angle) * o.speed, Math.sin(-o.angle) * o.speed);
    if(dist(o.x,o.y,o.gox,o.goy) <= 15){
      o.moving = false;
      o.gox = null;
      o.goy = null;
    }
  }
  if(!o.selected){
    o.changeSprite("dwarf-attack-0");
  }
 
  
});

action("orc", (o) => {
  o.x = o.pos.x;
  o.y = o.pos.y;
  /*let bad = get("bad");
  let good = get("good");
  //targeting system
  if (good.some(e => dist(o.pos.x, o.pos.y, e.x, e.y) <= o.range)) {
    o.idle = false;
    let possible = good.filter(e => dist(o.pos.x, o.pos.y, e.x, e.y) <= o.range);
    if(o.target){
    if (!o.targeting || o.target.dead) {
      o.target = choose(possible);
      o.targeting = true;
    }
    }
  } else {
    o.idle = true;
  }
  if(o.target){
  if (o.target.dead && o.targeting) {
    o.targeting = false;
    o.target = null;
  }
  }
  //movement
  if (o.targeting && o.target && !o.idle) {
    let rot = Math.atan2(o.target.y - o.pos.y, o.target.x - o.pos.x);
    o.move(Math.cos(rot) * o.speed, Math.sin(rot) * o.speed);
  }
  if (dist(o.pos.x, o.pos.y, o.target.x, o.target.y) <= o.attackRange) {
    if ((time() + o.pos.x) % o.rate === 0) {
      //play attacking sound here
      o.target.health -= o.damage;
      o.target.move(Math.cos(o.rot) * o.damage, Math.sin(o.rot) * o.damage);
    }
  }*/

  
})


cursor.action(() => {
  cursor.pos.x = mousePos().x;
  cursor.pos.y = mousePos().y;
  if (mouseIsDown() && !cursor.hasStarted) {
    cursor.x = mousePos().x;
    cursor.y = mousePos().y;
    cursor.hasStarted = true;
  } else if (mouseIsDown() && cursor.hasStarted) {
    cursor.x2 = mousePos().x;
    cursor.y2 = mousePos().y;
  }
  if (mouseIsReleased() && cursor.hasStarted) {
    if (cursor.x2 !== cursor.x && cursor.y !== cursor.y2) {
      cursor.selected = true;
    } else {
      cursor.clicked = true;
    }
    cursor.hasStarted = false;
  }
  if(cursor.hasSelected){
    cursor.changeSprite("cursor1");
  }else{
    cursor.changeSprite("cursor0");
  }
});
action(() => {
  if (mouseIsDown() && cursor.hasStarted) {
    select.pos.x = cursor.x;
    select.pos.y = cursor.y;
    select.width = cursor.x2 - cursor.x;
    select.height = cursor.y2 - cursor.y;
  }
  if (mouseIsReleased()) {
    select.pos.x = 0;
    select.pos.y = 0;
    select.width = 0;
    select.height = 0;
  }
  if (!cursor.hasStarted) {
    cursor.x2 = mousePos().x;
    cursor.y2 = mousePos().y;
  }
  if (cursor.selected) {
    console.log("selected");
    console.log(cursor.x, cursor.y, cursor.x2, cursor.y2);
    if(cursor.hasSelected){
      console.log("cursor has selected")
    }
  }
  if (cursor.clicked) {
    console.log("clicked", cursor.x, cursor.y);
  }
  //keep at bottom of action function
  if(cursor.hasSelected && cursor.clicked){
    cursor.hasSelected = false;
    console.log("cursor unselected");
    every("unit", (unit) => unit.selected = false)
  }
  cursor.selected = false;
  cursor.clicked = false;
})
