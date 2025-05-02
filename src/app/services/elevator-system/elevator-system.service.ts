import { Injectable } from '@angular/core';
import { Direction, Elevator, RequestType } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class ElevatorSystemService {

  elevators: Elevator[] = [];

  constructor() {
    for (let i = 1; i <= 4; i++) {
      this.elevators.push(new Elevator(i));
    }
  }

  generateRequest(): RequestType {
    const floor = Math.ceil(Math.random() * 10);
    const direction: Direction =
      floor === 10 ? 'down' : floor === 1 ? 'up' : Math.random() > 0.5 ? 'up' : 'down';
    return { floor, direction };
  }

  requestForElevator(request: RequestType): void {
    let bestElevator = this.elevators[0];
    let minDistance = Infinity;

    for (const elevator of this.elevators) {
      const distance = Math.abs(elevator.currentFloor - request.floor);
      const isCompatible =
        elevator.direction === 'stop' ||
        (elevator.direction === request.direction &&
          ((elevator.direction === 'up' && elevator.currentFloor <= request.floor) ||
           (elevator.direction === 'down' && elevator.currentFloor >= request.floor)));

      if (isCompatible && distance < minDistance) {
        bestElevator = elevator;
        minDistance = distance;
      }
    }

    bestElevator.addFloor(request.floor);
    if (!bestElevator.isMoving) {
      bestElevator.isMoving = true;
      bestElevator.step();
    }
  }

  getElevators(): Elevator[] {
    return this.elevators;
  }
}
