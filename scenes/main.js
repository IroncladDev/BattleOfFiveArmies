add([
  sprite("land")
])

add([
  sprite("dwarf-attack-0"),
  pos(100, 100),

])

let cursor = add([
  sprite("cursor0"),
  pos(mousePos().x, mousePos().y),
  "cursor",
  {
    x: 0,
    y: 0,
    x2: 0,
    y2: 0,
    hasStarted: false,
    selected: false,
    isSelecting: false
  }
]);
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
    cursor.selected = true;
    cursor.hasStarted = false;
  }

});

let select = add([
  rect(0, 0),
  pos(0, 0),
  color(rgba(1, 1, 1, 0.5)),
]);

action(() => {
  if(mouseIsDown() && cursor.hasStarted){
    select.pos.x = cursor.x;
    select.pos.y = cursor.y;
    select.width = cursor.x2 - cursor.x;
    select.height = cursor.y2 - cursor.y;
  } 
  if(mouseIsReleased()){
    select.pos.x = 0;
    select.pos.y = 0;
    select.width = 0;
    select.height = 0;
  }
  if(!cursor.hasStarted){
    cursor.x2 = mousePos().x;
    cursor.y2 = mousePos().y;
  }
})