add([
  sprite("land")
])

add([
  sprite("dwarf-attack-0"),
  pos(100,100),
  
])

let cursor = add([
  sprite("cursor0"),
  pos(mousePos().x,mousePos().y),
  "cursor",
  {
    x:0,
    y:0,
    x2:0,
    y2:0,
  }
]);
cursor.action(() => {
  cursor.pos.x = mousePos().x;
  cursor.pos.y = mousePos().y;
  
})