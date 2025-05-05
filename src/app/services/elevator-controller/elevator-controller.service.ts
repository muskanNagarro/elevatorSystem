import { Injectable } from '@angular/core';
import { Elevator } from '../../utility/elevator/elevator';
import { Direction, ElevatorConstants, RequestType } from '../../constants/elevator.constants';

@Injectable({
  providedIn: 'root'
})
export class ElevatorControllerService {

  elevators: Elevator[] = [];
  requestLogs: string[] = [];

  constructor() {
    for (let i = 1; i <= ElevatorConstants.CONFIG.TOTAL_ELEVATORS; i++) {
      this.elevators.push(new Elevator(i, this));
    }
  }

  generateRequest(): RequestType {
    const floor = Math.ceil(Math.random() * 10);
    const direction: Direction =
      floor === ElevatorConstants.CONFIG.TOTAL_FLOORS ? 'down' : floor === 1 ? 'up' : Math.random() > 0.5 ? 'up' : 'down';
    return { floor, direction };
  }

  // assign best elevator and make request to move the best elevator
  requestForElevator(request: RequestType): void {
    let bestElevator = this.elevators[0];
    let minDistance = Infinity;

    //Looping over all elevators
    for (const elevator of this.elevators) {
      // calculating distance from current position for each elevator
      const distance = Math.abs(elevator.currentFloor - request.floor);
      const isCompatible =
        elevator.direction === 'stop' ||
        (elevator.direction === request.direction &&
          ((elevator.direction === 'up' && elevator.currentFloor <= request.floor) ||
           (elevator.direction === 'down' && elevator.currentFloor >= request.floor)));

      // Assigning elevator with min distance
      if (isCompatible && distance < minDistance) {
        bestElevator = elevator;
        minDistance = distance;
      }
    }

    // adding target floor to selected elevator
    bestElevator.addFloor(request.floor);
    if (!bestElevator.isMoving) {
      bestElevator.isMoving = true;
      bestElevator.move();
    }
  }

  // get all elevators
  getElevators(): Elevator[] {
    return this.elevators;
  }

   // retrieves the list of request logs
  getLogs(): string[] {
    return this.requestLogs;
  }

  // clears all the request logs
  clearLogs(): void {
    this.requestLogs = [];
  }

   // tracking List Data by index
   trackByIndex(index: number): number {
    return index;
  }
}
