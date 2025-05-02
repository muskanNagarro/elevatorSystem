export type Direction = 'up' | 'down' | 'stop';
export interface RequestType {
  floor: number;
  direction: Direction;
}
export class Elevator {
  id: number;
  currentFloor = 1;
  direction: Direction = 'stop';
  targetFloors: number[] = [];
  isMoving = false;
  constructor(id: number) {
    this.id = id;
  }
  addFloor(floor: number): void {
    if (!this.targetFloors.includes(floor)) {
      this.targetFloors.push(floor);
      this.sortTargets();
    }
  }

  sortTargets(): void {
    this.targetFloors.sort((a, b) =>
      this.direction === 'down' ? b - a : a - b
    );
  }

  step(): void {
    if (this.targetFloors.length === 0) {
      this.direction = 'stop';
      return;
    }

    const nextFloor = this.targetFloors[0];
    if (this.currentFloor === nextFloor) {
      // console.log(
      //   `Elevator ${this.id} stopping on floor ${this.currentFloor} (boarding)`
      // );
      this.targetFloors.shift();
      setTimeout(() => this.step(), 10000);
    } else {
      this.direction = nextFloor > this.currentFloor ? 'up' : 'down';
      this.currentFloor += this.direction === 'up' ? 1 : -1;
      // console.log(`Elevator ${this.id} moving to floor ${this.currentFloor}`);
      setTimeout(() => this.step(), 10000);
    }
  }
}
