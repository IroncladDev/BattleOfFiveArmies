scene("main", (args = {}) => {

  //setup
  {
    add([
      sprite("land"),
      scale(5),
    ])
    layers([
      "back",
      "units",
      "ui",
      "select",
      "cursor",
    ], "obj");
    gravity(0);
    volume(0.1)


    add([
      rect(2000, 10),
      pos(0, 0),
      solid(),
      color(rgba(0, 0, 0)),
      layer("units")
    ])
    add([
      rect(2000, 10),
      pos(0, 1000 - 10),
      solid(),
      color(rgba(0, 0, 0)),
      layer("units")
    ])
    add([
      rect(10, 1000),
      pos(0, 0),
      solid(),
      color(rgba(0, 0, 0)),
      layer("units")
    ])
    add([
      rect(10, 1000),
      pos(2000 - 10, 0),
      solid(),
      color(rgba(0, 0, 0)),
      layer("units")
    ])
  }

  //vars
  let metalHits = ["metal-hit-0", "metal-hit-1", "metal-hit-2", "metal-hit-3"]
  let gore = ["gore0", "gore1", "gore2"]
  let team = "dwarves";
  let frameCount = 0;
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
  let unitStats = {
    "orc": {
      health: 25,
      damage: 5,
      range: 100,
      attackRange: 20,
      rate: 25,
      armor: 15,
      speed: 35,
      seq: ["orc-attack-0", "orc-attack-1", "orc-attack-2", "orc-attack-3", "orc-attack-2", "orc-attack-1"],
    },
    "dwarf": {
      health: 40,
      damage: 7,
      range: 100,
      attackRange: 20,
      rate: 35,
      armor: 25,
      speed: 25,
      seq: ["dwarf-attack-0", "dwarf-attack-1", "dwarf-attack-2", "dwarf-attack-3", "dwarf-attack-2", "dwarf-attack-1"],
      sel: "dwarf-selected"
    },
    "man": {
      health: 30,
      damage: 6,
      range: 125,
      attackRange: 25,
      rate: 30,
      armor: 20,
      speed: 40,
      seq: ["man-attack-0", "man-attack-1", "man-attack-2", "man-attack-3", "man-attack-2", "man-attack-1"],
      sel: "man-selected"
    },
    "elf": {
      health: 20,
      damage: 7,
      range: 150,
      attackRange: 25,
      rate: 20,
      armor: 5,
      speed: 50,
      seq: ["elf-attack-0", "elf-attack-1", "elf-attack-2", "elf-attack-3", "elf-attack-2", "elf-attack-1"],
      sel: "elf-selected"
    },
    "elf-archer": {
      health: 20,
      damage: 7,
      range: 200,
      attackRange: 25,
      rate: 40,
      armor: 5,
      speed: 50,
      seq: ["elf-archer-0", "elf-archer-1", "elf-archer-2", "elf-archer-3", "elf-archer-4", "elf-archer-5"],
      sel: "elf-archer-selected"
    },
    "man-archer": {
      health: 35,
      damage: 7,
      range: 200,
      attackRange: 25,
      rate: 50,
      armor: 25,
      speed: 40,
      seq: ["man-archer-0", "man-archer-1", "man-archer-2", "man-archer-3", "man-archer-4", "man-archer-5"],
      sel: "man-archer-selected"
    },
    "orc-archer": {
      health: 30,
      damage: 7,
      range: 200,
      attackRange: 25,
      rate: 50,
      armor: 35,
      speed: 40,
      seq: ["orc-archer-0", "orc-archer-1", "orc-archer-2", "orc-archer-3", "orc-archer-4"]
    },
    "troll": {
      health: 80,
      damage: 10,
      range: 200,
      attackRange: 30,
      rate: 60,
      armor: 20,
      speed: 40,
      seq: ["troll-attack-0", "troll-attack-1", "troll-attack-2", "troll-attack-3", "troll-attack-2", "troll-attack-1"]
    }
  }
  let camX = 0, camY = 0;

  //functions
  {
    function dist(x, y, x2, y2) {
      return Math.sqrt(Math.abs(x2 - x) ** 2 + Math.abs(y2 - y) ** 2);
    }
    function ang(a) {
      return Math.PI / 180 * a;
    }
    function addUnit(team, race, x, y, rangeType = "meelee") {
      add([
        layer("units"),
        body(),
        sprite(unitStats[race].seq[0]),
        pos(x, y),
        "unit",
        race,
        team,
        rangeType,
        {
          health: unitStats[race].health,
          rot: 0,
          damage: unitStats[race].damage,
          regen: 1,
          range: unitStats[race].range,
          attackRange: unitStats[race].attackRange,
          armor: unitStats[race].armor,
          speed: unitStats[race].speed,
          selected: false,
          idle: true,
          maxHealth: unitStats[race].health,
          target: null,
          targeting: false,
          dead: false,
          rate: unitStats[race].rate,
          x: 0,
          y: 0,
          gox: 0,
          goy: 0,
          moving: false,
          spi: 0,
          seq: unitStats[race].seq,
          onTask: false,
          sel: unitStats[race].sel
        },
        origin("center")
      ]);
    }

    function runPlayable(o) {

      o.x = o.pos.x;
      o.y = o.pos.y;
      o.rot = o.angle;
      var targets = get("bad");
      for (var e of targets) {
        if (dist(e.x, e.y, o.x, o.y) <= e.attackRange) {
          if (frameCount % e.rate === 0 && e.attacking) {
            play(choose(metalHits))
            o.health -= e.damage * (1 - (e.armor / 100));
            if (o.health <= 0) {
              e.targeting = false;
            }

          }
        }
      }

      if (!o.onTask && !o.selected) {
        if (targets.some(e => dist(o.x, o.y, e.x, e.y) <= o.range)) {
          if (!o.targeting) {
            var possible = targets.filter(e => dist(o.x, o.y, e.x, e.y) <= o.range);
            var t = choose(possible);
            o.target = t;
            o.targeting = true;
          }
        } else {
          if (frameCount % 100 === 0 && !o.onTask) {
            o.target = { x: o.x + rand(-100, 100), y: o.y + rand(-100, 100) };
            //o.targeting = true;
            o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
            o.angle = -o.rot;
            o.moving = true;
          }
        }
      }



      if (o.targeting) {
        o.gox = o.target.x;
        o.goy = o.target.y;
        o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
        o.angle = -o.rot;
        o.moving = true;
        if (dist(o.x, o.y, o.gox, o.goy) <= o.attackRange) {
          o.moving = false;
          o.gox = null;
          o.goy = null;
          o.attacking = true;
        }
      }


      if (cursor.selected && o.x > cursor.x && o.x < cursor.x2 && o.y > cursor.y && o.y < cursor.y2) {
        o.changeSprite(o.sel);
        o.idle = false;
        o.attacking = false;
        o.selected = true;
        o.targeting = false;
        o.target = null;
        o.moving = false;
        cursor.hasSelected = true;
      }
      if (o.selected && cursor.clicked) {
        o.gox = cursor.x;
        o.goy = cursor.y;
        o.rot = Math.atan2(o.goy - o.y, o.gox - o.x);
        o.angle = -o.rot;
        o.moving = true;
        o.onTask = true;
        o.selected = false;
        o.changeSprite(o.seq[0])
      }
      if (o.moving) {
        o.scale = 1 + Math.sin(frameCount / 15) / 50;
        o.move(Math.cos(-o.angle) * o.speed, Math.sin(-o.angle) * o.speed);
        if (dist(o.x, o.y, o.gox, o.goy) <= o.attackRange) {
          o.moving = false;
          o.gox = null;
          o.goy = null;
          o.onTask = false;
        }
      }
      if (o.attacking) {
        let bad = get("bad");
        if (bad.some(e => dist(e.x, e.y, o.x, o.y) <= o.attackRange)) {
          if (frameCount % Math.round(o.rate / o.seq.length) === 0 && !o.selected) {
            o.spi++;
            if (o.spi >= o.seq.length) {
              o.spi = 0;
            }
            o.changeSprite(o.seq[o.spi])
          }
        } else {
          o.attacking = false;
          o.idle = true;
          o.changeSprite(o.seq[0])
        }
      }



    }
    function runAIUnit(o, targ) {
      o.x = o.pos.x;
      o.y = o.pos.y;
      let targets = get(targ);
      for (var e of targets) {
        if (dist(e.x, e.y, o.x, o.y) <= e.attackRange) {
          if (frameCount % e.rate === 0 && e.attacking) {
            play(choose(metalHits))
            o.health -= e.damage * (1 - (e.armor / 100));
            if (o.health <= 0) {
              e.targeting = false;
            }
          }
        }
      }
      if (targets.some(e => dist(o.x, o.y, e.x, e.y) <= o.range)) {
        if (!o.targeting) {
          var possible = targets.filter(e => dist(o.x, o.y, e.x, e.y) <= o.range);
          var t = choose(possible);
          o.target = t;
          o.targeting = true;
        }
      } else {
        if (frameCount % 100 === 0) {
          o.target = { x: o.x + rand(-100, 100), y: o.y + rand(-100, 100) };
          o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
          o.angle = -o.rot;
          o.moving = true;
          //o.targeting = true;
        }
      }


      if (o.targeting) {
        o.gox = o.target.x;
        o.goy = o.target.y;
        o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
        o.angle = -o.rot;
        o.moving = true;
        if (dist(o.x, o.y, o.gox, o.goy) <= o.attackRange&&o.targeting) {
          o.moving = false;
          o.gox = null;
          o.goy = null;
          o.attacking = true;
        }
      }

      if (o.moving) {
        o.scale = 1 + Math.cos(frameCount / 15) / 50;
        o.move(Math.cos(-o.angle) * o.speed, Math.sin(-o.angle) * o.speed);
        if (dist(o.x, o.y, o.gox, o.goy) <= o.attackRange) {
          o.moving = false;
          o.gox = null;
          o.goy = null;
        }
      }
      if (o.attacking) {
        let bad = get(targ);
        if (bad.some(e => dist(e.x, e.y, o.x, o.y) <= o.attackRange)) {
          if (frameCount % Math.round(o.rate / o.seq.length) === 0 && !o.selected) {
            o.spi++;
            if (o.spi >= o.seq.length) {
              o.spi = 0;
            }
            o.changeSprite(o.seq[o.spi])
          }
        } else {
          o.attacking = false;
          o.idle = true;
          o.changeSprite(o.seq[0])
        }
      }
    }
    function runLongRangeAI(o, targ, ar) {
      o.x = o.pos.x;
      o.y = o.pos.y;
      let targets = get(targ);
      for (var e of targets) {
        if (dist(e.x, e.y, o.x, o.y) <= e.attackRange) {
          if (frameCount % e.rate === 0 && e.attacking) {
            play(choose(metalHits))
            o.health -= e.damage * (1 - (e.armor / 100));
            if (o.health <= 0) {
              e.targeting = false;
            }
          }
        }
      }
      if (targets.some(e => dist(o.x, o.y, e.x, e.y) <= o.range)) {
        if (!o.targeting) {
          var possible = targets.filter(e => dist(o.x, o.y, e.x, e.y) <= o.range);
          var t = choose(possible);
          o.target = t;
          o.targeting = true;
        }
      } else {
        if (frameCount % 100 === 0) {
          o.target = { x: o.x + rand(-100, 100), y: o.y + rand(-100, 100) };
          o.targeting = true;
        }
      }

      if (o.targeting) {
        o.gox = o.target.x;
        o.goy = o.target.y;
        o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
        o.angle = -o.rot;
        o.moving = true;
        if (dist(o.x, o.y, o.gox, o.goy) <= o.range - 50) {
          o.moving = false;
          o.gox = null;
          o.goy = null;
          o.attacking = true;
        }
      }

      if (o.moving) {
        o.scale = 1 + Math.cos(frameCount / 15) / 50;
        o.move(Math.cos(-o.angle) * o.speed, Math.sin(-o.angle) * o.speed);
        if (dist(o.x, o.y, o.gox, o.goy) <= o.attackRange) {
          o.moving = false;
          o.gox = null;
          o.goy = null;
        }
      }
      if (o.attacking) {
        let bad = get(targ);
        if (bad.some(e => dist(e.x, e.y, o.x, o.y) <= o.range)) {
          if (frameCount % o.rate === 0) {
            play("arrow-0")
            var possible = targets.filter(e => dist(o.x, o.y, e.x, e.y) <= o.range);
            var t = choose(possible);
            o.target = t;
            o.targeting = true;
            add([
              sprite("arrow"),
              pos(o.x + (Math.cos(o.rot) * 20), o.y + (Math.sin(o.rot) * 20)),
              layer("units"),
              ar,
              "arrow",
              {
                rot: o.rot,
                fromX: o.x,
                fromY: o.y
              }
            ])
          }
          if (frameCount % Math.round(o.rate / o.seq.length) === 0 && !o.selected) {
            o.spi++;
            if (o.spi >= o.seq.length) {
              o.spi = 0;
            }
            o.changeSprite(o.seq[o.spi])
          }
        } else {
          o.attacking = false;
          o.idle = true;
          o.changeSprite(o.seq[0])
        }
      }
    }
  }


  //add some test units
  {
    addUnit("good", "dwarf", 50, 25)
    addUnit("good", "dwarf", 70, 60)
    addUnit("good", "dwarf", 90, 60)
    addUnit("good", "elf", 50, 120)
    addUnit("good", "elf-archer", 50, 170)

    addUnit("bad", "orc", 300, 50)
    addUnit("bad", "orc-archer", 300, 80)
    addUnit("bad", "troll", 300, 110)
    addUnit("bad", "troll", 300, 140)
  }


  //action running
  {
    action("dwarf", runPlayable);
    action("man", o => runAIUnit(o, "bad"))
    action("elf", o => runAIUnit(o, "bad"))
    action("elf-archer", o => runLongRangeAI(o, "bad", "arrow1"))
    action("man-archer", o => runLongRangeAI(o, "bad", "arrow1"))
    action("orc-archer", o => runLongRangeAI(o, "good", "arrow2"))
    action("orc", o => runAIUnit(o, "good"));
    action("troll", o => runAIUnit(o, "good"));

    action("gore", (o) => {
      wait(25, () => destroy(o));
    })

    action("arrow", (o) => {
      o.angle = -o.rot;
      o.move(Math.cos(o.rot) * 200, Math.sin(o.rot) * 200);
    })

    collides("arrow1", "bad", (a, u) => {
      u.health -= 7;
      u.target = { x: a.fromX, y: a.fromY };
      u.targeting = true;
      destroy(a);
    })
    collides("arrow2", "good", (a, u) => {
      u.health -= 7;
      if (!u.selected) {
        u.target = { x: a.fromX, y: a.fromY };
        u.targeting = true;
      }
      destroy(a);
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
        }
        if (cursor.x2 === cursor.x && cursor.y === cursor.y2) {
          cursor.clicked = true;
        }
        cursor.hasStarted = false;
      }
      if (cursor.hasSelected) {
        cursor.changeSprite("cursor1");
      } else {
        cursor.changeSprite("cursor0");
      }
    });

    action(() => {
      if (keyIsDown("up")) camY -= 5;
      if (keyIsDown("down")) camY += 5;
      if (keyIsDown("left")) camX -= 5;
      if (keyIsDown("right")) camX += 5;
      camPos(camX, camY);
      frameCount++;
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
        if (cursor.hasSelected) {
          console.log("cursor has selected")
        }
      }
      if (cursor.clicked) {
        console.log("clicked", cursor.x, cursor.y);
      }
      //keep at bottom of action function
      if (cursor.hasSelected && cursor.clicked) {
        cursor.hasSelected = false;
        console.log("cursor unselected");
        every("unit", (unit) => unit.selected = false)
      }
      cursor.selected = false;
      cursor.clicked = false;
    })
    action("unit", (unit) => {
      let __u = get("unit");
      for (var e of __u) {
        if (dist(e.x, e.y, unit.x, unit.y) <= 15 && e !== unit) {
          let ang = Math.atan2(e.y - unit.y, e.x - unit.x);
          let distBetween = dist(e.x, e.y, unit.x, unit.y) - 15;
          e.move(-Math.cos(ang) * distBetween, -Math.sin(ang) * distBetween)
        }
      }
      if (unit.health <= 0) {
        add([
          sprite(choose(gore)),
          "gore",
          pos(unit.x, unit.y),
          scale(2),
          origin("center"),
          layer("back")
        ])
        destroy(unit);
      }
    })
    on("destroy", "unit", (e) => {
      play("gore-0", {
        volume: 2.0,
        speed: 0.8,
        detune: 1200
      });
    });
  }

});