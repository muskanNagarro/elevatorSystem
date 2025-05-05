import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElevatorControllerService } from './services/elevator-controller/elevator-controller.service';
import { Elevator } from './utility/elevator/elevator';
import { ElevatorConstants, RequestType } from './constants/elevator.constants';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  elevators: Elevator[] = [];
  autoGenerate: boolean = true;
  floors: number[] = [];
  currentTime: Date = new Date();

  constructor(public elevatorControllerService: ElevatorControllerService){}

  ngOnInit(): void {
    this.floors = Array.from({ length: ElevatorConstants.CONFIG.TOTAL_FLOORS }, (_, i) => i + 1);
    this.elevators = this.elevatorControllerService.getElevators();

    // Auto generate request for elevator after defined halt time
    setInterval(() => {
      const request = this.elevatorControllerService.generateRequest();
      this.elevatorControllerService.requestLogs.push(
        `Request received: ${request.direction.toUpperCase()} from floor ${request.floor}`
      );
      console.log(`Request received: ${request.direction.toUpperCase()} from floor ${request.floor}`);
      this.elevatorControllerService.requestForElevator(request);
    }, ElevatorConstants.CONFIG.DEFAULT_AUTO_GEN_HALT_TIME);
  }

  // When user requst for elevator with floor and direction
  manualRequest(floor: string, direction: string): void {
    const parsedFloor = +floor;
    const parsedDirection = direction === 'up' ? 'up' : 'down'; 
    const request: RequestType = { floor: parsedFloor, direction: parsedDirection };
    this.elevatorControllerService.requestLogs.push(
          `Request received: ${request.direction.toUpperCase()} from floor ${request.floor}`
        );
    this.elevatorControllerService.requestForElevator(request);
  }
  
  // clear logs
  clearLogs(): void {
    this.elevatorControllerService.clearLogs();
  }
}
