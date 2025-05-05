import { Direction, ElevatorConstants } from "../../constants/elevator.constants";
import { ElevatorControllerService } from "../../services/elevator-controller/elevator-controller.service";

export class Elevator {
  id: number;
  currentFloor = 1;
  direction: Direction = 'stop';
  targetFloors: number[] = [];
  isMoving = false;

  constructor(id: number, private elevatorControllerService: ElevatorControllerService) {
    this.id = id;
  }

  // Adding target floor to the selcted elevator
  addFloor(floor: number): void {
    if (!this.targetFloors.includes(floor)) {
      this.targetFloors.push(floor);
      this.sortTargets();
    }
  }

  // sort Targets according to direction
  sortTargets(): void {
    this.targetFloors.sort((a, b) =>
      this.direction === 'down' ? b - a : a - b
    );
  }

  // move the elevtor to cover all the target floors
  move(): void {
    if (this.targetFloors.length === 0) {
      this.direction = 'stop';
      return;
    }

    const nextFloor = this.targetFloors[0];
    if (this.currentFloor === nextFloor) {
      // Log in Reguest Logs
      this.elevatorControllerService.requestLogs.push(
        `Elevator ${this.id} stopping on floor ${this.currentFloor} (boarding)`
      );
      
      console.log(
        `Elevator ${this.id} stopping on floor ${this.currentFloor} (boarding)`
      );
      this.targetFloors.shift();
      // calling move() after person move out of elevator
      setTimeout(() => this.move(), ElevatorConstants.CONFIG.DEFAULT_HALT_TIME);
    } else {
      this.direction = nextFloor > this.currentFloor ? 'up' : 'down';
      this.currentFloor += this.direction === 'up' ? 1 : -1;

      // Log in Reguest Logs
      this.elevatorControllerService.requestLogs.push(
        `Elevator ${this.id} moving to floor ${this.currentFloor}`
      );

      console.log(`Elevator ${this.id} moving to floor ${this.currentFloor}`);

      // calling move() after halt time of moving elevator from one floor to another
      setTimeout(() => this.move(), ElevatorConstants.CONFIG.DEFAULT_HALT_TIME);
    }
  }
}