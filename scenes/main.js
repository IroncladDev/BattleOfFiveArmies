scene("main", (args = {}) => {

  //setup
  {
    add([
      rect(width(), height()),
      pos(0, 0),
      color(rgba(0, 0, 0)),
      layer("bg")
    ])
    add([
      sprite("land"),
      scale(5),
      layer("back")
    ])
    layers([
      "bg",
      "back",
      "units",
      "select",
      "ui",
      "cursor",
    ], "obj");
    camIgnore(["ui", "bg"])
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

    add([
      sprite("ui-dashboard"),
      scale(width() / 128, 150 / 16),
      pos(0, height() - 150),
      layer("ui")
    ])


  }
  let wave = 0;
  //vars
  let metalHits = ["metal-hit-0", "metal-hit-1", "metal-hit-2", "metal-hit-3"]
  let gore = ["gore0", "gore1", "gore2"]
  let team = "dwarf";
  let rangedUnit = "dwarf-spear";
  let meeleeUnit = "dwarf";
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
  let blackScreen = add([
    rect(width(), height()),
    pos(-width(),0),
    layer("ui"),
    color(rgba(0,0,0,0.5))
  ])
  let select = add([
    layer("select"),
    rect(0, 0),
    pos(0, 0),
    color(rgba(1, 1, 1, 0.5)),
  ]);
  let messageText = add([
    text("Welcome to the game!\n(Wait Three Seconds)", 30),
    pos(width()/2, height()/2),
    origin("center"),
    layer("ui"),
    color(rgb(200/255,200/255,200/255))
  ])
  let unitStats = {
    "orc": {
      health: 25,
      damage: 5,
      range: 100,
      attackRange: 20,
      rate: 25,
      armor: 15,
      speed: 35,
      team: "orc",
      seq: ["orc-attack-0", "orc-attack-1", "orc-attack-2", "orc-attack-3", "orc-attack-2", "orc-attack-1"],
    },
    "dwarf": {
      health: 50,
      damage: 7,
      range: 100,
      attackRange: 25,
      rate: 35,
      armor: 30,
      speed: 25,
      team: "dwarf",
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
      team: "man",
      seq: ["man-attack-0", "man-attack-1", "man-attack-2", "man-attack-3", "man-attack-2", "man-attack-1"],
      sel: "man-selected"
    },
    "elf": {
      health: 20,
      damage: 6,
      range: 150,
      attackRange: 25,
      rate: 20,
      armor: 5,
      speed: 50,
      team: "elf",
      seq: ["elf-attack-0", "elf-attack-1", "elf-attack-2", "elf-attack-3", "elf-attack-2", "elf-attack-1"],
      sel: "elf-selected"
    },
    "elf-archer": {
      health: 20,
      damage: 2,
      range: 200,
      attackRange: 25,
      rate: 50,
      armor: 0,
      speed: 60,
      team: "elf",
      seq: ["elf-archer-0", "elf-archer-1", "elf-archer-2", "elf-archer-3", "elf-archer-4", "elf-archer-5"],
      sel: "elf-archer-selected"
    },
    "man-archer": {
      health: 35,
      damage: 2,
      range: 200,
      attackRange: 25,
      rate: 70,
      armor: 25,
      speed: 40,
      team: "man",
      seq: ["man-archer-0", "man-archer-1", "man-archer-2", "man-archer-3", "man-archer-4", "man-archer-5"],
      sel: "man-archer-selected"
    },
    "orc-archer": {
      health: 30,
      damage: 2,
      range: 200,
      attackRange: 25,
      rate: 60,
      armor: 35,
      speed: 40,
      team: "orc",
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
      team: "orc",
      seq: ["troll-attack-0", "troll-attack-1", "troll-attack-2", "troll-attack-3", "troll-attack-2", "troll-attack-1"]
    },
    "ww": {
      health: 50,
      damage: 8,
      range: 100,
      attackRange: 30,
      rate: 40,
      armor: 5,
      speed: 50,
      team: "orc",
      seq: ["ww-attack-0", "ww-attack-1", "ww-attack-2", "ww-attack-3", "ww-attack-4", "ww-attack-3", "ww-attack-2", "ww-attack-1"]
    },
    "dwarf-spear": {
      health: 50,
      damage: 7,
      range: 150,
      attackRange: 25,
      rate: 75,
      armor: 30,
      speed: 20,
      team: "dwarf",
      seq: ["dwarf-spear-0", "dwarf-spear-1", "dwarf-spear-2", "dwarf-spear-3", "dwarf-spear-4", "dwarf-spear-4", "dwarf-spear-2", "dwarf-spear-1", "dwarf-spear-5"],
      sel: "dwarf-selected"
    }
  }
  let gamePaused = false;
  let camX = 240, camY = 490;
  let upButton = add([
    sprite("icon-up"),
    pos(width() - 100, height() - 125),
    layer("ui"),
    scale(3),
    origin("center")
  ]);
  let downButton = add([
    sprite("icon-down"),
    pos(width() - 100, height() - 25),
    layer("ui"),
    scale(3),
    origin("center")
  ]);
  let leftButton = add([
    sprite("icon-left"),
    pos(width() - 150, height() - 75),
    layer("ui"),
    scale(3),
    origin("center")
  ]);
  let rightButton = add([
    sprite("icon-right"),
    pos(width() - 50, height() - 75),
    layer("ui"),
    scale(3),
    origin("center")
  ]);
  let pauseButton = add([
    sprite("icon-pause"),
    pos(width() - 240, height() - 75),
    layer("ui"),
    scale(4),
    origin("center")
  ]);
  let gemIcon = add([
    sprite("icon-score"),
    pos(160, height() - 75),
    layer("ui"),
    scale(3),
    origin("center")
  ]);
  let coinIcon = add([
    sprite("coin"),
    pos(320, height() - 75),
    layer("ui"),
    scale(3),
    origin("center")
  ]);
  let unitIcon = add([
    sprite("icon-units"),
    pos(480, height() - 100),
    layer("ui"),
    scale(3),
    origin("center")
  ]);
  let enemyIcon = add([
    sprite("icon-eye"),
    pos(480, height() - 50),
    layer("ui"),
    scale(3),
    origin("center")
  ]);
  let rallyIcon = add([
    sprite("icon-rally"),
    pos(480 + 160, height() - 75),
    layer("ui"),
    scale(3),
    origin("center")
  ])
  let meeleeIcon = add([
    sprite("icon-kills"),
    pos(480 + 160 + 50, height() - 75),
    layer("ui"),
    scale(3),
    origin("center")
  ])
  let rangedIcon = add([
    sprite("icon-ranged"),
    pos(480 + 160 + 100, height() - 75),
    layer("ui"),
    scale(3),
    origin("center")
  ])
  let priceTag = add([
    text("", 20),
    layer("ui"),
    origin("center"),
    pos(480 + 160 + 50, height() - 115)

  ])
  let targ = add([
    sprite("targ-center"),
    layer("ui"),
    origin("center"),
    pos(width() / 2, height() / 2),
    scale(4),
  ])
  let coins = 50;
  let gems = 50;
  let gemCount = add([
    text(gems, 25),
    layer("ui"),
    pos(190, height() - 85)
  ])
  let coinCount = add([
    text(coins, 25),
    layer("ui"),
    pos(190 + 160, height() - 85)
  ])
  let unitCount = add([
    text(get(team).length, 25),
    layer("ui"),
    pos(190 + 320, height() - 110)
  ])
  let enemyCount = add([
    text(get("bad").length, 25),
    layer("ui"),
    pos(190 + 320, height() - 60)
  ])
  let pointer = add([
    sprite("point"),
    "point",
    scale(5),
    pos(width() / 2, height() / 2),
    layer("ui"),
    origin("center"),
  ])
  //functions
  {
    function dist(x, y, x2, y2) {
      return Math.sqrt(Math.abs(x2 - x) ** 2 + Math.abs(y2 - y) ** 2);
    }
    function addUnit(tm, race, x, y) {
      add([
        layer("units"),
        body(),
        sprite(unitStats[race].seq[0]),
        pos(x, y),
        "unit",
        tm,
        race,
        {
          health: unitStats[race].health,
          rot: 0,
          arot: 0,
          damage: unitStats[race].damage,
          regen: 1,
          range: unitStats[race].range * 2,
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
        origin("center"),
      ]);
    }

    function runPlayable(o) {
      o.use("playable");
      o.x = o.pos.x;
      o.y = o.pos.y;
      o.angle = -o.rot;
      var targets = get("bad");
      for (var e of targets) {
        if (dist(e.x, e.y, o.x, o.y) <= e.attackRange) {
          if (frameCount % e.rate === 0 && e.attacking) {
            if (dist(o.x, o.y, camX, camY) <= width() * 0.5)
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
          /*if (frameCount+o.x % 100 === 0 && !o.onTask) {
            o.target = { x: o.x + rand(-100, 100), y: o.y + rand(-100, 100) };
            //o.targeting = true;
            o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
            //o.angle = -o.rot;
            o.moving = true;
          }*/
          o.moving = false;
        }
      }



      if (o.targeting) {
        o.gox = o.target.x;
        o.goy = o.target.y;
        o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
        ////o.angle = -o.rot;
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
        ////o.angle = -o.rot;
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
      o.angle = -o.arot;
      o.arot += (o.rot - o.arot);
      for (var e of targets) {
        if (dist(e.x, e.y, o.x, o.y) <= e.attackRange) {
          if (frameCount % e.rate === 0 && e.attacking) {
            if (dist(o.x, o.y, camX, camY) <= width() * 0.5)
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
        /*if (frameCount % 200 === 0) {
          o.target = { x: o.x + rand(-100, 100), y: o.y + rand(-100, 100) };
          o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
          o.moving = true;
          //o.targeting = true;
        }*/
        o.moving = false;
      }


      if (o.targeting) {
        o.gox = o.target.x;
        o.goy = o.target.y;
        o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
        o.moving = true;
        if (dist(o.x, o.y, o.gox, o.goy) <= o.attackRange) {
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
          o.targeting = false;
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
          //o.idle = true;
          o.changeSprite(o.seq[0])
        }
      }
    }
    function runLongRangeAI(o, targ, ar) {
      o.x = o.pos.x;
      o.y = o.pos.y;
      o.angle = -o.arot;
      o.arot += (o.rot - o.arot) / 10;
      let targets = get(targ);
      for (var e of targets) {
        if (dist(e.x, e.y, o.x, o.y) <= e.attackRange) {
          if (frameCount % e.rate === 0 && e.attacking) {
            if (dist(o.x, o.y, camX, camY) <= width() * 0.5)
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
        //o.angle = -o.rot;
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
            if (dist(o.x, o.y, camX, camY) <= width() * 0.5)
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
    function runLongPlayable(o) {
      o.use("playable");
      o.x = o.pos.x;
      o.y = o.pos.y;
      o.angle = -o.arot;
      o.arot += (o.rot - o.arot) / 10;
      let targets = get("bad");
      for (var e of targets) {
        if (dist(e.x, e.y, o.x, o.y) <= e.attackRange) {
          if (frameCount % e.rate === 0 && e.attacking) {
            if (dist(o.x, o.y, camX, camY) <= width() * 0.5)
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
          if (frameCount % 100 === 0) {
            o.target = { x: o.x + rand(-100, 100), y: o.y + rand(-100, 100) };
            o.targeting = true;
          }
        }
      }

      if (o.targeting) {
        o.gox = o.target.x;
        o.goy = o.target.y;
        o.rot = Math.atan2(o.target.y - o.y, o.target.x - o.x);
        //o.angle = -o.rot;
        o.moving = true;
        if (dist(o.x, o.y, o.gox, o.goy) <= o.range - 50) {
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
        //o.angle = -o.rot;
        o.moving = true;
        o.onTask = true;
        o.selected = false;
        o.changeSprite(o.seq[0])
      }
      if (o.moving) {
        o.scale = 1 + Math.cos(frameCount / 15) / 50;
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
        if (bad.some(e => dist(e.x, e.y, o.x, o.y) <= o.range)) {
          if (frameCount % o.rate === 0) {
            if (dist(o.x, o.y, camX, camY) <= width() * 0.5)
              play("arrow-0")
            var possible = targets.filter(e => dist(o.x, o.y, e.x, e.y) <= o.range);
            var t = choose(possible);
            o.target = t;
            o.targeting = true;
            add([
              sprite("arrow"),
              pos(o.x + (Math.cos(o.rot) * 20), o.y + (Math.sin(o.rot) * 20)),
              layer("units"),
              "arrow1",
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
    function squad(team, type, x, y, w, h) {
      for (var i = x; i < x + w * 30; i += 30) {
        for (var j = y; j < y + h * 30; j += 30) {
          addUnit(team, type, i, j)
        }
      }
    }
  }

  //run units depending on team
  {
    if (team === "dwarf") {
      action("dwarf", runPlayable);
      action("man", o => runAIUnit(o, "bad"))
      action("elf", o => runAIUnit(o, "bad"))
      action("elf-archer", o => runLongRangeAI(o, "bad", "arrow1"))
      action("dwarf-spear", o => runLongPlayable(o, "bad", "spear"))
      action("man-archer", o => runLongRangeAI(o, "bad", "arrow1"))
      rangedUnit = "dwarf-spear";
      meeleeUnit = "dwarf";
    } else if (team === "elf") {
      action("dwarf", o => runAIUnit(o, "good"));
      action("man", o => runAIUnit(o, "bad"))
      action("elf", o => runPlayable(o))
      action("elf-archer", o => runLongPlayable(o, "bad", "arrow1"))
      action("man-archer", o => runLongRangeAI(o, "bad", "arrow1"))
      action("dwarf-spear", o => runLongRangeAI(o, "bad", "spear"))
      rangedUnit = "elf-archer";
      meeleeUnit = "elf";
    } else if (team === "man") {
      action("dwarf", o => runAIUnit(o, "good"));
      action("man", runPlayable)
      action("elf", o => runAIUnit(o, "bad"))
      action("elf-archer", o => runLongRangeAI(o, "bad", "arrow1"))
      action("man-archer", o => runLongPlayable(o, "bad", "arrow1"))
      action("dwarf-spear", o => runLongRangeAI(o, "bad", "spear"))
      rangedUnit = "man-archer";
      meeleeUnit = "man";
    }
  }

  //waves

  squad("good", meeleeUnit, 200, 440, 4, 4);
  let waves = [
    //startoff
    () => { },
    () => {
      squad("bad", "orc", 1600, 460, 2, 2);
      return "Welcome to the Game!\nKill those Orcs!"
    },
    () => {
      squad("bad", "orc", 1600, 460, 4, 4)
      return "More Orcs are here!"
    },
    () => {
      squad("bad", "orc", 1600, 260, 3, 3)
      squad("bad", "orc", 1600, 660, 3, 3)
      return "Orcs to the North and South."
    },
    () => {
      squad("bad", "orc", 1600, 420, 6,6)
      return "Orcs packed in a tight\nformation"
    },
    () => {
      squad("bad", "orc", 1200, 420, 25, 1)
      return "Looong";
    },
    () => {
      squad("bad", "orc", 1400, 200, 2, 20)
      return "Tall";
    },
    () => {
      squad("bad", "orc-archer", 1500, 500, 5, 1)
      return "Archers";
    },
    () => {
      squad("bad", "orc-archer", 1500, 500, 1, 5)
      squad("bad", "orc", 1550, 500, 1, 5)
      squad("bad", "orc-archer", 1600, 500, 1, 5)
      squad("bad", "orc", 1650, 500, 1, 5)
      return "Orcs and Archers";
    },
    () => {
      squad("bad", "orc", 1600, 260, 3, 3)
      squad("bad", "orc-archer", 1600, 660, 3, 3)
      return "North-South Destruction"
    },
    () => {
      squad("bad", "orc", 20, 20, 3, 3)
      squad("bad", "orc-archer", 20, 900, 3, 3)
      squad("bad", "orc", 1900, 20, 3, 3)
      squad("bad", "orc-archer", 1900, 900, 3, 3)
      return "Four Corners of the World"
    },
    () => {
      squad("bad", "orc-archer", 1500, 500, 1, 5)
      squad("bad", "orc", 1550, 500, 1, 5)
      squad("bad", "troll", 1600, 500, 4, 5)
      squad("good", "elf", 600, 440, 2, 4);
      squad("good", "elf-archer", 650, 440, 2, 4);
      squad("good", "man", 700, 440, 2, 4);
      squad("good", "man-archer", 750, 440, 2, 4);
      squad("good", "dwarf", 800, 440, 2, 4);
      squad("good", "dwarf-spear", 850, 440, 2, 4);
      return "Reinforcements have arrived...\nfor both armies."
    },
    () => {
      squad("bad", "troll", 1450, 500, 6, 5)
      return "I think that was all the\nreinforcements :(\noh, trolls."
    },
    () => {
      squad("bad", "orc", 850, 500, 8, 8)
      return "*squishes ur reinforcements*"
    },
    () => {
      squad("bad", "ww", 20, 20, 2, 2)
      squad("bad", "ww", 20, 900, 2, 2)
      squad("bad", "ww", 1900, 20, 2, 2)
      squad("bad", "ww", 1900, 990, 2, 2)
      return "Fast Bois = Warg Riders"
    },
    () => {
      squad("bad", "troll", 1500, 450, 4, 5);
      squad("bad", "ww", 1600, 450, 2, 5);
      squad("good", "elf", 1000, 450,2,5)
      return "Nasty Elvses\n- Gollum"
    },
    () => {
      squad("bad", "warg", 1500, 450, 5, 5)
      return "Waaaaarrrrggs";
    },
    () => {
      squad("bad", "orc-archer", 1500, 450, 6, 6)
      return "The eagles are late.\nYou're right.\nThey ain't a-coming in this\ngame cuz I'm lazy to add\nthem. :P";
    },
    () => {
      squad("bad", "orc", 1500, 450, 1, 1)
      return "Weeinfowcements might have arrived";
    },
    () => {
      squad("bad", "ww", 20, 20, 4, 4)
      squad("bad", "orc", 20, 900, 4, 4)
      squad("bad", "orc-archer", 1900, 20, 4, 4)
      squad("bad", "troll", 1900, 900, 4, 4)
      return "Okay they didn't.\nAll da bad bois together";
    },
    () => {
      squad("good", "elf", 600, 440, 2, 4);
      squad("good", "elf-archer", 650, 440, 2, 4);
      squad("good", "man", 700, 440, 2, 4);
      squad("good", "man-archer", 750, 440, 2, 4);
      squad("good", "dwarf", 800, 440, 2, 4);
      squad("good", "dwarf-spear", 850, 440, 2, 4);
      squad("bad", "ww", 20, 1500, 1, 40)
      squad("bad", "orc", 20, 1600, 1, 40)
      squad("bad", "orc-archer", 1700, 20, 1, 40)
      squad("bad", "troll", 1800, 900, 1, 40)
      return "The final assault + Reinforcements";
    },
    //end
    () => { }
  ];


  //action running
  {
    action("orc-archer", o => runLongRangeAI(o, "good", "arrow2"))
    action("orc", o => runAIUnit(o, "good"));
    action("troll", o => runAIUnit(o, "good"));
    action("ww", o => runAIUnit(o, "good"));

    action("gore", (o) => {
      wait(10, () => destroy(o));
    })

    action("arrow", (o) => {
      o.angle = -o.rot;
      o.move(Math.cos(o.rot) * 200, Math.sin(o.rot) * 200);
    })
    action("spear", (o) => {
      o.angle = -o.rot;
      o.move(Math.cos(o.rot) * 200, Math.sin(o.rot) * 200);
    })

    collides("spear", "bad", (a, u) => {
      u.health -= rand(5, 10);
      u.target = { x: a.fromX, y: a.fromY };
      u.targeting = true;
      destroy(a);
    })
    collides("arrow1", "bad", (a, u) => {
      u.health -= rand(0, 7);
      u.target = { x: a.fromX, y: a.fromY };
      u.targeting = true;
      destroy(a);
    })
    collides("arrow2", "good", (a, u) => {
      if (u.is("dwarf")) {
        u.health -= rand(0, 2);
      } else {
        u.health -= rand(0, 7);
      }
      if (!u.selected) {
        u.target = { x: a.fromX, y: a.fromY };
        u.targeting = true;
      }
      destroy(a);
    })
    pointer.action(() => {
      let enems = get("bad");
      let closest = enems.sort((a, b) => dist(a.x, a.y, camX, camY) - dist(b.x, b.y, camX, camY))[0];
      if (enems.length > 0) {
        pointer.pos.x = width() / 2;
        pointer.pos.y = height() / 2;
        pointer.angle = -(Math.atan2(closest.y - camY, closest.x - camX));
      } else {
        pointer.pos.x = -100;
        pointer.pos.y = -100;
      }
    })
    action("item", (p) => {
      if (p.isHovered()) {
        if (p.is("gem")) {
          gems += Math.floor(1 + Math.random() * 5);
        } else if (p.is("coin")) {
          coins += Math.floor(1 + Math.random() * 5);
        }
        gemCount.text = gems;
        coinCount.text = coins;
        destroy(p)
      }
      if (p.exists()) {
        wait(15, () => destroy(p))
      }
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
        if (Math.abs(cursor.x - cursor.x2) > 2 && Math.abs(cursor.y - cursor.y2) > 2) {
          cursor.selected = true;
        } else {
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
      if (keyIsDown("w") || keyIsDown("up") || (upButton.isHovered() && mouseIsDown())) camY -= 5;
      if (keyIsDown("s") || keyIsDown("down") || (downButton.isHovered() && mouseIsDown())) camY += 5;
      if (keyIsDown("a") || keyIsDown("left") || (leftButton.isHovered() && mouseIsDown())) camX -= 5;
      if (keyIsDown("d") || keyIsDown("right") || (rightButton.isHovered() && mouseIsDown())) camX += 5;
      if (camX < 20) camX = 20;
      if (camY < 20) camY = 20
      if (camX > 2000 - 20) camX = 2000 - 20
      if (camY > 1000 - 20) camY = 1000 - 20
      cursor.changeSprite("cursor0")
      gemCount.text = gems;
      coinCount.text = coins;

      if(get("good").length === 0){
        go("lose");
      }

      if (get("bad").length === 0) {
        wave++;
        messageText.text = waves[wave]()||"Wave "+(wave);
        gamePaused = true;
        every("unit", (u) => u.paused = true)
        every("arrow", (u) => u.paused = true)
        blackScreen.pos.x = 0;
        targ.hidden = true;
        pointer.hidden = true;
        messageText.hidden = false;
        wait(3, () => {
          gamePaused = false;
          every("unit", (u) => u.paused = false)
          every("arrow", (u) => u.paused = false)
          blackScreen.pos.x = -width();
          targ.hidden = false;
          pointer.hidden = false;
          messageText.hidden = true;
        })
        if (wave == waves.length - 1) {
          go("win")
        }
      }


      priceTag.text = "";

      if (rallyIcon.isHovered()) {
        priceTag.text = "Rally - $10";
        if (cursor.clicked && coins >= 10) {
          every("playable", (o) => {
            o.changeSprite(o.sel);
            o.idle = false;
            o.attacking = false;
            o.selected = true;
            o.targeting = false;
            o.target = null;
            o.moving = false;
            cursor.hasSelected = true;
          })
          coins -= 10;
          cursor.clicked = false;
        }

        if (coins < 10) {
          cursor.changeSprite("cursor-no")
        }
      }

      if (meeleeIcon.isHovered()) {
        priceTag.text = "Meelee Unit - $5"
        if (cursor.clicked && coins >= 5) {
          addUnit("good", meeleeUnit, camX, camY);
          coins -= 5;
        }
        if (coins < 5) {
          cursor.changeSprite("cursor-no")
        }
      }

      if (rangedIcon.isHovered()) {
        priceTag.text = "Ranged Unit - 5 gems";
        if (cursor.clicked && gems >= 5) {
          addUnit("good", rangedUnit, camX, camY);
          gems -= 5;
        }
        if (gems < 5) {
          cursor.changeSprite("cursor-no")
        }
      }

      unitCount.text = get("playable").length;
      enemyCount.text = get("bad").length;

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
      //keep at bottom of action function
      if (cursor.hasSelected && cursor.clicked) {
        cursor.hasSelected = false;
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
      if (dist(e.x, e.y, camX, camY) <= width() * 0.5)
        play("gore-0", {
          volume: 2.0,
          speed: 0.8,
          detune: 1200
        });

      if (e.is("bad")) {
        let chance = Math.random();
        if (chance < 0.5 && chance > 0.15) {
          add([
            sprite("coin"),
            "item",
            "coin",
            pos(e.x, e.y),
            layer("back")
          ])
        } else if (chance <= 0.15) {
          add([
            sprite("gem"),
            "item",
            "gem",
            pos(e.x, e.y),
            layer("back")
          ])
        }
      }
    });
    pauseButton.clicks(() => {
      if (gamePaused) {
        gamePaused = false;
        every("unit", (u) => u.paused = false)
        every("arrow", (u) => u.paused = false)
      } else {
        gamePaused = true;
        every("unit", (u) => u.paused = true)
        every("arrow", (u) => u.paused = true)
      }
    });

  }

});














scene("win", (args = {}) => {

  add([
    text("You Won", 100),
    pos(width() / 2, height() / 2),
    origin("center")
  ])

})

scene("lose", (args = {}) => {
  add([
    sprite("background-lose"),
    pos(0,0),
    scale(width() / 3773, height() / 1995)
  ])
  add([
    text("You lost", 100),
    pos(width() / 2, height() / 2),
    origin("center")
  ])

})
