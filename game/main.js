document.addEventListener("DOMContentLoaded", async function () {
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


  function createPNJ() {
    quests.forEach((quest, index) => {
      const pnjs = document.createElement("div");
      pnjs.className = "pnjs";
      pnjs.id = "pnj" + (index + 1);
      pnjs.title = quest.title;
      pnjs.description = quest.description;
      pnjs.style.left = quest.x + "px";
      pnjs.style.top = quest.y + "px";
      world.appendChild(pnjs);
    });
  }

  function createQuestMark() {
    quests.forEach((quest, index) => {
      const questMarks = document.createElement("div");
      questMarks.className = "questMark";
      questMarks.id = "questMark" + (index + 1);
      questMarks.style.left = quest.x + 20 + "px";
      questMarks.style.top = quest.y - 35 + "px";
      world.appendChild(questMarks);
    });
  }

  function createChests() {
    trucks.forEach((truck, index) => {
      const chests = document.createElement("div");
      chests.classList.add("chests", "invisible");
      chests.id = "chest" + (index + 1);
      chests.title = truck.description;
      chests.style.left = truck.x + "px";
      chests.style.top = truck.y + "px";
      chests.x = truck.x;
      chests.y = truck.y;
      chests.opened = false;
      world.appendChild(chests);
    });
  }

  function createCrosses() {
    const crossPositions = [
      { x: 800, y: 160 },
      { x: 410, y: 40 },
      { x: 70, y: 400},
      { x: 1300, y: 400},
      { x: 1000, y:30},
      { x: 333, y: 500},
    ];

    crossPositions.forEach(cross => {
      const crossPosition = document.createElement("div");
      crossPosition.classList.add("cross", "invisible");
      crossPosition.style.left = cross.x + "px";
      crossPosition.style.top = cross.y + "px";
      world.appendChild(crossPosition);
    });
  }

  function pnjConversation(index, text, x, y, targetX, targetY) {
    const bubble = document.createElement("div");
    bubble.className = "conversation-bubble";
    bubble.id = "conversation-bubble" + index;
    bubble.innerText = text;
    bubble.style.left = x - 75 + "px";
    bubble.style.top = y - 30 + "px";
    document.body.appendChild(bubble);

    setTimeout(() => {
      bubble.style.transform = `translate(${targetX - x}px, ${targetY - y}px)`;
    }, 5000);
  }

  function chestConversation(text, x, y) {
    const bubble = document.createElement("div");
    bubble.className = "conversation-bubble";
    bubble.innerText = text;
    bubble.style.left = x - 75 + "px";
    bubble.style.top = y - 30 + "px";
    document.body.appendChild(bubble);

    setTimeout(() => {
      document.body.removeChild(bubble);
    }, 5000);
  }

  function isMoveAllowed(x, y) {
    return (
      x >= 0 &&
      y >= 0 &&
      x <= world.offsetWidth - playerSize &&
      y <= world.offsetHeight - playerSize
    );
  }

  function distanceWithPlayer(objectX, objectY) {
    return Math.sqrt((playerX - objectX) ** 2 + (playerY - objectY) ** 2);
  }

  function movePlayer() {
    proxyQuest = 0;
    proxyChest = false;

    toucheA.style.display = "none";
    toucheZ.style.display = "none";
    toucheE.style.display = "none";

    player.style.left = playerX + "px";
    player.style.top = playerY + "px";

    quests.forEach((quest, index) => {
      const chest = document.getElementById("chest" + (index + 1));
      const pnjs = document.getElementById("pnj" + (index + 1));
      const distance = distanceWithPlayer(quest.x, quest.y);

      if (distance <= proximityDistance && !chest.opened && !activeQuest) {
        proxyQuest = quest;
        toucheA.style.display = "block";
      }
    });

    if (activeChest !== "none" && !activeChest.opened) {
      const distanceToChest = distanceWithPlayer(activeChest.x, activeChest.y);
      if (distanceToChest <= proximityDistanceChest) {
        toucheZ.style.display = "block";
        proxyChest = true;
      }
    }

    if (activeHouse) {
      const distanceToHouse = distanceWithPlayer(houseX, houseY);
      if (distanceToHouse <= proximityDistanceHouse) {
        toucheE.style.display = "block";
        activeToucheE = true;
      }
    }
  }

  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        if (isMoveAllowed(playerX, playerY - 50)) {
          playerY -= 15;
          player.style.backgroundImage = "url('images/joueurHaut.png')";
          movePlayer();
        }
        break;

      case "ArrowDown":
        if (isMoveAllowed(playerX, playerY + 50)) {
          playerY += 15;
          player.style.backgroundImage = "url('images/joueurBas.png')";
          movePlayer();
        }
        break;

      case "ArrowLeft":
        if (isMoveAllowed(playerX - 50, playerY)) {
          playerX -= 15;
          player.style.backgroundImage = "url('images/joueurGauche.png')";
          movePlayer();
        }
        break;

      case "ArrowRight":
        if (isMoveAllowed(playerX + 50, playerY)) {
          playerX += 15;
          player.style.backgroundImage = "url('images/joueurDroite.png')";
          movePlayer();
        }
        break;

      case "a":
        if (proxyQuest != 0 && !activeQuest) {
          currentQuest = proxyQuest;

          if (currentQuest.title === "Carlos" && !chest1.opened) {
            pnjConversation(1, `${currentQuest.title} : ${proxyQuest.description}`, proxyQuest.x, proxyQuest.y - 30, 300, 675);
            const questBubble1 = document.getElementById("conversation-bubble1");
            questMark1.style.display = "none";
            activeQuest = true;
            activeChest = chest1;
            activeBubble = questBubble1;
            chest1.classList.remove("invisible");
            for (let i = 0; i < chestFakes.length; i++) {
              chestFakes[i].classList.remove("invisible");
            }
          } else if (currentQuest.title === "Roberto" && !chest2.opened) {
            pnjConversation(2, `${currentQuest.title} : ${proxyQuest.description}`, proxyQuest.x, proxyQuest.y - 30, 300, 675);
            const questBubble2 = document.getElementById("conversation-bubble2");
            questMark2.style.display = "none";
            activeQuest = true;
            activeChest = chest2;
            activeBubble = questBubble2;
            chest2.classList.remove("invisible");
            for (let i = 0; i < chestFakes.length; i++) {
              chestFakes[i].classList.remove("invisible");
            }
          } else if (currentQuest.title === "Gaspard" && !chest3.opened) {
            pnjConversation(3, `${currentQuest.title} : ${proxyQuest.description}`, proxyQuest.x, proxyQuest.y - 30, 300, 675);
            const questBubble3 = document.getElementById("conversation-bubble3");
            questMark3.style.display = "none";
            activeQuest = true;
            activeChest = chest3;
            activeBubble = questBubble3;
            chest3.classList.remove("invisible");
            for (let i = 0; i < chestFakes.length; i++) {
              chestFakes[i].classList.remove("invisible");
            }
          }
        }
        break;

      case "z":
        if (activeChest !== "none" && !activeChest.opened) {
          if (proxyChest) {
            activeChest.style.display = "none";
            activeChest.opened = true;
            activeChest = "none";
            remainingChests -= 1;
            activeQuest = false;
            document.body.removeChild(activeBubble);
            if (remainingChests === 0) {
              chestConversation("Félicitations, tu as retrouvé tous les coffres ! \nTu peux maintenant accéder à la maison et trouver le coffre final.", playerX, playerY - 25);
              activeHouse = true;
            } else {
              chestConversation(`Félicitations, tu viens de trouver un coffre ! \nIl te reste encore ${remainingChests} coffre(s) à trouver...`, playerX, playerY - 25);
            }
          }
        }
        break;

      case "e":
        if (activeToucheE) {
          window.location.href = "finalRoom.html";
        }
        break;
    }
  });

  const world = document.getElementById("world");

  const house = document.createElement("div");
  house.id = "house";
  world.appendChild(house);

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

  const houseX = 675;
  const houseY = 50;

  const proximityDistance = 75;
  const proximityDistanceChest = 40;
  const proximityDistanceHouse = 50;

  let currentQuest = "none";
  let activeChest = "none";
  let activeQuest = false;
  let activeBubble = "none";
  let activeHouse = false;
  let activeToucheE = false;
  let finalRoom = false;

  const quests = [
    {
      x: 775,
      y: 600,
      title: "Carlos",
      description:
        "J'ai vu un coffre dans la forêt quand j'm'entraînais tout à l'heure.",
    },
    {
      x: 1300,
      y: 300,
      title: "Roberto",
      description:
        "Un coffre ? J'étais encerclé par la nature, je ne suis pas sûr de moi.",
    },
    {
      x: 500,
      y: 200,
      title: "Gaspard",
      description: "J'voulais m'raffraichir et v'là un coffre !",
    },
  ];

  const trucks = [
    { x: 210, y: 210, description: "Fouiller" },
    { x: 1290, y: 600, description: "Fouiller" },
    { x: 1300, y: 85, description: "Fouiller" },
  ];

  let remainingChests = trucks.length;

  createChests();
  createCrosses();

  const player = document.createElement("div");
  player.id = "player";
  world.appendChild(player);

  const playerSize = 50;
  let playerX = 275;
  let playerY = 575;
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";

  createPNJ();
  createQuestMark();


  const chest1 = document.getElementById("chest1");
  const chest2 = document.getElementById("chest2");
  const chest3 = document.getElementById("chest3");
  const questMark1 = document.getElementById("questMark1");
  const questMark2 = document.getElementById("questMark2");
  const questMark3 = document.getElementById("questMark3");

  const chestFakes = document.getElementsByClassName("cross");
});