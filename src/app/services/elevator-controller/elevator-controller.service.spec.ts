import { TestBed } from '@angular/core/testing';

import { ElevatorControllerService } from './elevator-controller.service';

describe('ElevatorControllerService', () => {
  let service: ElevatorControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElevatorControllerService);
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

  it('should return the current request logs', () => {
    service['requestLogs'] = ['Elevator 1 moving', 'Elevator 2 stopping'];
    const logs = service.getLogs();
    expect(logs).toEqual(['Elevator 1 moving', 'Elevator 2 stopping']);
  });

  it('should clear all request logs', () => {
    service['requestLogs'] = ['Log 1', 'Log 2'];
    service.clearLogs();
    expect(service['requestLogs']).toEqual([]);
  });

  it('should return the index passed to it', () => {
    expect(service.trackByIndex(0)).toBe(0);
    expect(service.trackByIndex(5)).toBe(5);
  });
});
