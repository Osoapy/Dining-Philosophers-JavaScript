const commmonDelay = 10000;
let loopCount = 5;

class Fork {
  constructor() {
    this.locked = false;
  }

  async acquire() {
    while (this.locked) {
      await new Promise((resolve) => setTimeout(resolve, commmonDelay));
    }
    this.locked = true;
  }

  release() {
    this.locked = false;
  }
}

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
        console.log(`${this.name} is thinking...`);
        await new Promise((resolve) => setTimeout(resolve, commmonDelay));

        await this.eat();

        console.log(`${this.name} finished eating and starts thinking again.`);
        this.loopCount--;
      }
    }
    else {
      while (true) {
        console.log(`${this.name} is thinking...`);
        await new Promise((resolve) => setTimeout(resolve, commmonDelay));

        await this.eat();

        console.log(`${this.name} finished eating and starts thinking again.`);
      }
    }
  }

  async eat() {
    console.log(`${this.name} is hungry...`);

    if (this.name != "John Locke") {
      await this.leftFork.acquire();
      console.log(`${this.name} picked up the left fork.`);

      await this.rightFork.acquire();
      console.log(`${this.name} picked up the right fork.`);
    } else {
      await this.rightFork.acquire();
      console.log(`${this.name} picked up the right fork.`);

      await this.leftFork.acquire();
      console.log(`${this.name} picked up the left fork.`);
    }

    console.log(`${this.name} is eating...`);
    await new Promise((resolve) => setTimeout(resolve, commmonDelay));

    this.leftFork.release();
    this.rightFork.release();
  }
}

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