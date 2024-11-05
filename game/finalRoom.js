document.addEventListener("DOMContentLoaded", function () {
  async function getPnj() {
    return await fetch("http://127.0.0.1:8000/pnjs").then(r => r.json()).catch(err => console.error(err))
  }

  async function getHeroe() {
    return await fetch("http://127.0.0.1:8000/heroes").then(r => r.json()).catch(err => console.error(err))
  }

  async function getQuest() {
    return await fetch("http://127.0.0.1:8000/quests").then(r => r.json()).catch(err => console.error(err))
  }

  async function getChest() {
    return await fetch("http://127.0.0.1:8000/chests").then(r => r.json()).catch(err => console.error(err))
  }
  
  function createLumens() {
    lumens.forEach((lumenData, index) => {
      const lumens = document.createElement("div");
      lumens.className = "lumens";
      lumens.id = "lumen" + (index + 1);
      lumens.title = lumenData.description;
      lumens.style.left = lumenData.x + "px";
      lumens.style.top = lumenData.y + "px";
      lumens.x = lumenData.x;
      lumens.y = lumenData.y;
      lumens.obtened = false;
      world.appendChild(lumens);
    });
  }

  function createSkeleton() {
    skeletons.forEach((skeleton, index) => {
      const skeletons = document.createElement("div");
      skeletons.className = "skeletons";
      skeletons.id = "skeleton" + (index + 1);
      skeletons.title = skeleton.description;
      skeletons.style.left = skeleton.x + "px";
      skeletons.style.top = skeleton.y + "px";
      skeletons.x = skeleton.x;
      skeletons.y = skeleton.y;
      world.appendChild(skeletons);
    });
  }

  function createTrait() {
    trait.forEach((trait, index) => {
      const traitElement = document.createElement("div");
      traitElement.className = "trait";
      traitElement.id = "trait" + (index + 1);
      traitElement.style.left = trait.x + "px";
      traitElement.style.top = trait.y + "px";
      traitElement.style.width = trait.longueur + "px";
      traitElement.style.height = trait.hauteur + "px";
      world.appendChild(traitElement);
      createdTraits.push(traitElement);
    });
  }

  function toggleBlocks(block) {
    if (block.style.display === 'none') {
        block.style.display = 'block';
    } else {
        block.style.display = 'none';
    }
    setTimeout(() => toggleBlocks(block), 1000);
  }

  function conversation(text, x, y, targetX = 300, targetY = 675) {
    const bubble = document.createElement("div");
    bubble.className = "conversation-bubble";
    bubble.id = "conversation-bubble1";
    bubble.innerText = text;
    bubble.style.left = x - 75 + "px";
    bubble.style.top = y - 30 + "px";
    document.body.appendChild(bubble);

    setTimeout(() => {
      bubble.style.transform = `translate(${targetX - x}px, ${targetY - y}px)`;
    }, 3000);

    setTimeout(() => {
      document.body.removeChild(bubble);
    }, 10000);
  }

  function conversation2(text, x=300, y=675) {
    const bubble = document.createElement("div");
    bubble.className = "conversation-bubble";
    bubble.innerText = text;
    bubble.style.left = x - 75 + "px";
    bubble.style.top = y - 30 + "px";
    document.body.appendChild(bubble);

    setTimeout(() => {
      document.body.removeChild(bubble);
    }, 8000);
  }

  function isMoveAllowed(x, y) {
    let result = true;
    trait.forEach((ligne, index) => {
      if (
        x + playerSize >= ligne.x &&          
        x <= ligne.x + ligne.longueur &&       
        ((y + playerSize >= ligne.y && y <= ligne.y) ||    
        (y <= ligne.y + ligne.hauteur && y + playerSize >= ligne.y + ligne.hauteur))
      ) {
        result = false;
      }
    });
    return result;
  }

  function distanceWithPlayer(objectX, objectY) {
    return Math.sqrt((playerX - objectX) ** 2 + (playerY - objectY) ** 2);
  }


  function movePlayer() {
    proxyLumens = false;

    toucheA.style.display = "none";
    toucheZ.style.display = "none";
    toucheE.style.display = "none";
    toucheR.style.display = "none";
    autoriseToucheR = false;
    autoriseToucheR = false;

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    lumens.forEach((lumen, index) => {
      const lumenO = document.getElementById("lumen" + (index + 1));
      const distance = distanceWithPlayer(lumen.x, lumen.y);

      if (distance <= proximityDistance && !lumenO.obtened) {
        proxyLumens = document.getElementById("lumen" + (index + 1));
        toucheA.style.display = "block";
      }
    });

    if (distanceWithPlayer(500, 450) <= proximityDistance && activetoucheZ) {
        toucheZ.style.display = "block";
        autorisetoucheZ = true;
    }

    if (activeToucheE) {
      skeletons.forEach((skeleton, index) => {
        const skeletonO = document.getElementById("skeleton" + (index + 1));
        const distance = distanceWithPlayer(skeleton.x, skeleton.y);
  
        if (distance <= proximityDistanceSkeleton) {
          proxySkeleton = document.getElementById("skeleton" + (index + 1));
          toucheE.style.display = "block";
          autoriseToucheE = proxySkeleton;
        }
      });
    }

    if (distanceWithPlayer(chest.x, chest.y) <= proximityDistanceChest && activeToucheR) {
      toucheR.style.display = "block";
      autoriseToucheR = true;
    }

    blocks.forEach((line, index) => {
      const block = document.getElementById("block" + (index + 1));
      if (
        block.style.display === "block" &&
        ((playerX >= line.x && playerX <= line.x + line.width) ||
        (playerX + 30 >= line.x && playerX + 30 <= line.x + line.width)) &&
        ((playerY >= line.y && playerY <= line.y + line.height) ||
        (playerY + 45 >= line.y && playerY + 45 <= line.y + line.height))
      ) {
        window.location.href = "finalRoom.html";
      }
    });

    document.querySelectorAll(".lumens")
      .forEach(function (lumens) {
        const distance = Math.sqrt(
          Math.pow(lumens.offsetTop - playerY, 2) +
            Math.pow(lumens.offsetLeft - playerX, 2)
        );
        if (distance <= 10) {
          lumens.style.opacity = 1;
        }
        else if (distance <= 20) {
          lumens.style.opacity = 0.9;
        }
        else if (distance <= 30) {
          lumens.style.opacity = 0.8;
        }
        else if (distance <= 40) {
          lumens.style.opacity = 0.7;
        }
        else if (distance <= 50) {
          lumens.style.opacity = 0.6;
        }
        else if (distance <= 60) {
          lumens.style.opacity = 0.5;
        }
        else if (distance <= 70) {
          lumens.style.opacity = 0.4;
        }
        else if (distance <= 80) {
          lumens.style.opacity = 0.3;
        }
        else if (distance <= 90) {
          lumens.style.opacity = 0.2;
        }
        else if (distance <= 100) {
          lumens.style.opacity = 0.1;
        } else {
          lumens.style.opacity = 0;
        }
      });

    
    document.querySelectorAll("#chest")
      const distance = Math.sqrt(
        Math.pow(chest.offsetTop - playerY, 2) +
          Math.pow(chest.offsetLeft - playerX, 2)
      );
      if (distance <= 20) {
        chest.style.opacity = 1;
      }
      else if (distance <= 30) {
        chest.style.opacity = 0.9;
      }
      else if (distance <= 40) {
        chest.style.opacity = 0.8;
      }
      else if (distance <= 50) {
        chest.style.opacity = 0.7;
      }
      else if (distance <= 60) {
        chest.style.opacity = 0.6;
      }
      else if (distance <= 70) {
        chest.style.opacity = 0.5;
      }
      else if (distance <= 80) {
        chest.style.opacity = 0.4;
      }
      else if (distance <= 90) {
        chest.style.opacity = 0.3;
      }
      else if (distance <= 100) {
        chest.style.opacity = 0.2;
      }
      else if (distance <= 125) {
        chest.style.opacity = 0.1;
      } else {
        chest.style.opacity = 0;
      }
  }

  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (isMoveAllowed(playerX, playerY - 30)) {
          playerY -= 15;
          player.style.backgroundImage = "url('images/joueurHaut.png')";
          movePlayer();
        }
        break;

      case "ArrowDown":
        if (isMoveAllowed(playerX, playerY + 30)) {
          playerY += 15;
          player.style.backgroundImage = "url('images/joueurBas.png')";
          movePlayer();
        }
        break;

      case "ArrowLeft":
        if (isMoveAllowed(playerX - 30, playerY)) {
          playerX -= 15;
          player.style.backgroundImage = "url('images/joueurGauche.png')";
          movePlayer();
        }
        break;

      case "ArrowRight":
        if (isMoveAllowed(playerX + 30, playerY)) {
          playerX += 15;
          player.style.backgroundImage = "url('images/joueurDroite.png')";
          movePlayer();
        }
        break;

      case "a":
          if (proxyLumens && !proxyLumens.obtened) {
            proxyLumens.style.display = "none";
            proxyLumens.obtened = true;
            proxyLumens = "none";
            remainingLumens -= 1;
            if (remainingLumens === 0) {
              conversation("Félicitations, tu as récolté toutes les lumières ! \nTu peux maintenant commencer le rituel.", playerX, playerY - 25);
              activetoucheZ = true;   
            }
          }
          break;
      
      case "z":
        if (activetoucheZ && autorisetoucheZ) {
          activetoucheZ = false;
          activeToucheE = true;
          world.style.backgroundImage = "url('images/3donjon.png')";
          conversation2("Maintenant que le rituel a commencé, tu dois donner ton jugement mais attention... il ne faudrait pas tuer un homme vivant !");
          createSkeleton();
          const skeleton1 = document.getElementById("skeleton1");
          const skeleton2 = document.getElementById("skeleton2");
          const skeleton3 = document.getElementById("skeleton3");
          const skeleton4 = document.getElementById("skeleton4");
        }
        break;
      
      case "e":
        if (activeToucheE && autoriseToucheE) {
          activeToucheE = false;
          if (autoriseToucheE === document.getElementById("skeleton2")) {
            world.style.backgroundImage = "url('images/4donjon.png')";
            activeToucheR = true;
            skeleton1.classList.add("invisible");
            skeleton3.classList.add("invisible");
            skeleton4.classList.add("invisible");
            const lastTrait = document.getElementById("trait22");
            if (lastTrait) {
              lastTrait.remove();
              trait.pop();
            }
          } else {
            window.location.href = "finalRoom.html";;
          }
        }
        break;
      
      case "r":
        if (activeToucheR && autoriseToucheR) {
          window.location.href = "congrulations.html";
        }
        break;
    }
  });

  const world = document.getElementById("world");

  const arrows = document.createElement("div");
  arrows.id = "arrows";
  world.appendChild(arrows);

  const toucheA = document.createElement("div");
  toucheA.id = "a";
  world.appendChild(toucheA);

  const toucheZ = document.createElement("div");
  toucheZ.id = "z";
  world.appendChild(toucheZ);

  const toucheE = document.createElement("div");
  toucheE.id = "e";
  world.appendChild(toucheE);

  const toucheR = document.createElement("div");
  toucheR.id = "r";
  world.appendChild(toucheR);

  const skeletons = [
    { x: 300, y: 366, description: "Carlos" },
    { x: 300, y: 424, description: "Edouard" },
    { x: 300, y: 482, description: "Gaspard" },
    { x: 300, y: 545, description: "Roberto" }
  ];

  const lumens = [
    { x: 550, y: 190, description: "Ramasser" },
    { x: 675, y: 400, description: "Ramasser" },
    { x: 860, y: 450, description: "Ramasser" },
    { x: 1065, y: 325, description: "Ramasser" },
    { x: 1200, y: 325, description: "Ramasser" },
  ];

  const trait = [
    { x: 175, y: 615, longueur: 600, hauteur: 1 },
    { x: 175, y: 320, longueur: 1, hauteur: 1 },
    { x: 175, y: 370, longueur: 15, hauteur: 1 },
    { x: 175, y: 420, longueur: 15, hauteur: 1 },
    { x: 175, y: 470, longueur: 15, hauteur: 1 },
    { x: 175, y: 520, longueur: 15, hauteur: 1 },
    { x: 175, y: 570, longueur: 15, hauteur: 1 },
    { x: 175, y: 330, longueur: 210, hauteur: 1 },
    { x: 175, y: 310, longueur: 210, hauteur: 1 },
    { x: 300, y: 80, longueur: 1, hauteur: 1 },
    { x: 300, y: 130, longueur: 15, hauteur: 1 },
    { x: 300, y: 180, longueur: 15, hauteur: 1 },
    { x: 300, y: 230, longueur: 15, hauteur: 1 },
    { x: 300, y: 280, longueur: 15, hauteur: 1 },
    { x: 300, y: 100, longueur: 375, hauteur: 1 },
    { x: 675, y: 100, longueur: 1, hauteur: 1 },
    { x: 675, y: 150, longueur: 15, hauteur: 1 },
    { x: 675, y: 200, longueur: 15, hauteur: 1 },
    { x: 675, y: 250, longueur: 15, hauteur: 1 },
    { x: 675, y: 300, longueur: 15, hauteur: 1 },
    { x: 575, y: 310, longueur: 100, hauteur: 1 },
    { x: 575, y: 330, longueur: 200, hauteur: 1 },
    { x: 770, y: 330, longueur: 1, hauteur: 1 },
    { x: 770, y: 380, longueur: 15, hauteur: 1 },
    { x: 770, y: 430, longueur: 15, hauteur: 1 },
    { x: 770, y: 455, longueur: 250, hauteur: 1 },
    { x: 770, y: 535, longueur: 1, hauteur: 1 }, 
    { x: 770, y: 585, longueur: 15, hauteur: 1 }, 
    { x: 770, y: 535, longueur: 535, hauteur: 1 },
    { x: 1305, y: 90, longueur: 1, hauteur: 1 },
    { x: 1305, y: 140, longueur: 15, hauteur: 1 },
    { x: 1305, y: 190, longueur: 15, hauteur: 1 },
    { x: 1305, y: 240, longueur: 15, hauteur: 1 },
    { x: 1305, y: 290, longueur: 15, hauteur: 1 },
    { x: 1305, y: 340, longueur: 15, hauteur: 1 }, 
    { x: 1305, y: 390, longueur: 15, hauteur: 1 }, 
    { x: 1305, y: 440, longueur: 15, hauteur: 1 },
    { x: 1305, y: 490, longueur: 15, hauteur: 1 },
    { x: 1000, y: 250, longueur: 1, hauteur: 1 },
    { x: 1000, y: 300, longueur: 15, hauteur: 1 },
    { x: 1000, y: 350, longueur: 15, hauteur: 1 },
    { x: 1000, y: 400, longueur: 15, hauteur: 1 },
    { x: 1000, y: 450, longueur: 15, hauteur: 1 },
    { x: 850, y: 240, longueur: 250, hauteur: 1 },
    { x: 1000, y: 270, longueur: 90, hauteur: 1 },
    { x: 1215, y: 270, longueur: 90, hauteur: 1 },
    { x: 850, y: 90, longueur: 1, hauteur: 1 },
    { x: 850, y: 140, longueur: 15, hauteur: 1 },
    { x: 850, y: 190, longueur: 15, hauteur: 1 },
    { x: 850, y: 240, longueur: 15, hauteur: 1 },
    { x: 850, y: 100, longueur: 450, hauteur: 1 },
    { x: 1200, y: 240, longueur: 100, hauteur: 1 },
    { x: 1100, y: 240, longueur: 100, hauteur: 1 }
  ];

  const blocks = [
    { x: 384, y: 300, width: 180, height: 10 },
    { x: 1015, y: 400, width: 275, height: 5 },
    { x: 750, y: 470, width: 5, height: 60 },
  ];

  const chest = document.createElement("div");
  chest.id = "chest";
  chest.title = "Fouiller";
  chest.x = 900;
  chest.y = 100;
  world.appendChild(chest);

  let remainingLumens = lumens.length;
  
  createLumens();

  const player = document.createElement("div");
  player.id = "player";
  world.appendChild(player);

  const playerSize = 50;
  let playerX = 350; 
  let playerY = 175;

  let proxyLumens = false;
  const proximityDistance = 40;
  const proximityDistanceSkeleton = 20;
  const proximityDistanceChest = 80;

  player.style.left = playerX + "px";
  player.style.top = playerY + "px";

  let activetoucheZ = false;
  let autorisetoucheZ = false;

  let activeToucheE = false;
  let autoriseToucheE = false;

  let activeToucheR = false;
  let autoriseToucheR = false;

  let activeBubble = "none";

  const createdTraits = [];
  createTrait();

  blocks.forEach((line, index) => {
    const block = document.createElement("div");
    block.className = "blocks";
    block.id = "block" + (index + 1);
    block.style.width = line.width + "px";
    block.style.height = line.height + "px";
    block.style.left = line.x + "px";
    block.style.top = line.y + "px";
    world.appendChild(block);
    toggleBlocks(block);
  });
});