import { Component } from '@angular/core';
import { ElevatorSystemService } from './services/elevator-system/elevator-system.service';
import { CommonModule } from '@angular/common';
import { Elevator, RequestType } from './constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  elevators: Elevator[] = [];
  autoGenerate: boolean = true;

  constructor(private elevatorSystemService: ElevatorSystemService){}

  ngOnInit(): void {
    this.elevators = this.elevatorSystemService.getElevators();
    // setInterval(() => {
    //   const request = this.elevatorSystemService.generateRequest();
    //   console.log(`Request received: ${request.direction.toUpperCase()} from floor ${request.floor}`);
    //   this.elevatorSystemService.requestForElevator(request);
    // }, 15000);
  }
  manualRequest(floor: string, direction: string): void {
    const parsedFloor = +floor;
    const parsedDirection = direction === 'up' ? 'up' : 'down'; 
    const request: RequestType = { floor: parsedFloor, direction: parsedDirection };
    this.elevatorSystemService.requestForElevator(request);
  }
  
}
