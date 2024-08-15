// GLOBAL SCOPE VARIABLES
const mouse = document.getElementById("prompt-null");
const commonDelay = 2000;
const randomScope = 5;
let loopCount = 0;

// MAKING HTML FUNCTIONS
function createDivTextInsertbeforeLog (text, node) {
  let newDiv = document.createElement("div");
  newDiv.classList = "prompt";
  newDiv.textContent = text;
  mouse.parentNode.insertBefore(newDiv, node);
  console.log(text);
}

// MAKING NORMAL FUNCTIONS
function getRandomSeconds() {
    return (Math.random() * randomScope + 1) * commonDelay;
}

// MAKING THE FORKS AS OBJECTS WITH SEMAPHORES
class Fork {
  constructor() {
    this.locked = false;
  }

  async acquire() {
    while (this.locked) {
      await new Promise((resolve) => setTimeout(resolve, getRandomSeconds()));
    }
    this.locked = true;
  }

  release() {
    this.locked = false;
  }
}

// MAKING THE PHILOSOPHERS AS OBJECTS
class Philosopher {
  constructor(name, leftFork, rightFork, loopCount) {
    this.name = name;
    this.leftFork = leftFork;
    this.rightFork = rightFork;
    this.loopCount = loopCount || 0;
  }

  async dine() {
    if (this.loopCount != 0) {
      while (this.loopCount) {
        let div = document.createElement("div");
        div.classList = "prompt";
        div.textContent = `${this.name} is thinking...`;
        mouse.parentNode.insertBefore(div, mouse);
        console.log(`${this.name} is thinking...`);
        await new Promise((resolve) => setTimeout(resolve, getRandomSeconds()));

        await this.eat();

        createDivTextInsertbeforeLog(`${this.name} finished eating and starts thinking again.`, mouse);
        this.loopCount--;
      }
    }
    else {
      while (true) {
        createDivTextInsertbeforeLog(`${this.name} is thinking...`, mouse);
        await new Promise((resolve) => setTimeout(resolve, getRandomSeconds()));

        await this.eat();

        createDivTextInsertbeforeLog(`${this.name} finished eating and starts thinking again.`, mouse);
      }
    }
  }

  async eat() {
    console.log(`${this.name} is hungry...`);

    if (this.name != "John Locke" && (this.name == "Diógenes" || Math.random() > 0.5)) {
      await this.leftFork.acquire();
      createDivTextInsertbeforeLog(`${this.name} picked up the left fork.`, mouse);

      await this.rightFork.acquire();
      createDivTextInsertbeforeLog(`${this.name} picked up the right fork.`, mouse);
    } else {
      await this.rightFork.acquire();
      createDivTextInsertbeforeLog(`${this.name} picked up the right fork.`, mouse);

      await this.leftFork.acquire();
      createDivTextInsertbeforeLog(`${this.name} picked up the left fork.`, mouse);
    }

    createDivTextInsertbeforeLog(`${this.name} is eating...`, mouse);
    await new Promise((resolve) => setTimeout(resolve, getRandomSeconds()));

    this.leftFork.release();
    this.rightFork.release();
  }
}

// MAKING IT START
(async () => {
  const forks = [new Fork(), new Fork(), new Fork(), new Fork(), new Fork()];
  const philosophers = [
    new Philosopher("Diógenes", forks[0], forks[1], loopCount),
    new Philosopher("Maquiavel", forks[1], forks[2], loopCount),
    new Philosopher("Tales de Mileto", forks[2], forks[3], loopCount),
    new Philosopher("Platão", forks[3], forks[4], loopCount),
    new Philosopher("John Locke", forks[4], forks[0], loopCount),
  ];

  const diningPromises = philosophers.map((philosopher) => philosopher.dine());
  await Promise.all(diningPromises);
})();