import { TestBed } from '@angular/core/testing';

import { ElevatorSystemService } from './elevator-system.service';

describe('ElevatorSystemService', () => {
  let service: ElevatorSystemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElevatorSystemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should create service with 4 elevators', () => {
    expect(service.elevators.length).toBe(4);
  });

  it('should generate a valid request', () => {
    const req = service.generateRequest();
    expect(req.floor).toBeGreaterThanOrEqual(1);
    expect(req.floor).toBeLessThanOrEqual(10);
    expect(['up', 'down']).toContain(req.direction);
  });

  it('should assign request to an elevator', () => {
    const request = { floor: 5, direction: 'up' as const };
    service.requestForElevator(request);
    const anyAssigned = service.elevators.some(e => e.targetFloors.includes(5));
    expect(anyAssigned).toBeTrue();
  });
});
