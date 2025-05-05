import { ElevatorConstants } from '../../constants/elevator.constants';
import { ElevatorControllerService } from '../../services/elevator-controller/elevator-controller.service';
import { Elevator } from './elevator';

describe('Elevator', () => {
  let elevator: Elevator;
  let mockService: jasmine.SpyObj<ElevatorControllerService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('ElevatorControllerService', [], {
      requestLogs: []
    });

    elevator = new Elevator(1, mockService);
  });

  it('should initialize correctly', () => {
    expect(elevator.id).toBe(1);
    expect(elevator.currentFloor).toBe(1);
    expect(elevator.direction).toBe('stop');
    expect(elevator.targetFloors).toEqual([]);
    expect(elevator.isMoving).toBeFalse();
  });

  it('should add floor to targetFloors if not already present', () => {
    elevator.addFloor(3);
    expect(elevator.targetFloors).toContain(3);
  });

  it('should not add duplicate floors', () => {
    elevator.addFloor(3);
    elevator.addFloor(3);
    expect(elevator.targetFloors).toEqual([3]);
  });

  it('should sort targetFloors ascending when direction is up or stop', () => {
    elevator.direction = 'up';
    elevator.addFloor(5);
    elevator.addFloor(2);
    expect(elevator.targetFloors).toEqual([2, 5]);
  });

  it('should sort targetFloors descending when direction is down', () => {
    elevator.direction = 'down';
    elevator.addFloor(5);
    elevator.addFloor(2);
    expect(elevator.targetFloors).toEqual([5, 2]);
  });

  it('should stop if no target floors on step', () => {
    spyOn(console, 'log');
    elevator.move();
    expect(elevator.direction).toBe('stop');
    expect(mockService.requestLogs.length).toBe(0);
  });

  it('should move up one floor on step if target is above', () => {
    elevator.currentFloor = 1;
    elevator.addFloor(3);
    jasmine.clock().install();
    elevator.move();
    jasmine.clock().tick(ElevatorConstants.CONFIG.DEFAULT_HALT_TIME);
    expect(elevator.currentFloor).toBe(3);
    expect(elevator.direction).toBe('up');
    jasmine.clock().uninstall();
  });

  it('should move down one floor on step if target is below', () => {
    elevator.currentFloor = 5;
    elevator.addFloor(3);
    jasmine.clock().install();
    elevator.move();
    jasmine.clock().tick(ElevatorConstants.CONFIG.DEFAULT_HALT_TIME);
    expect(elevator.currentFloor).toBe(3);
    expect(elevator.direction).toBe('down');
    jasmine.clock().uninstall();
  });

  it('should stop at target floor and remove it from queue', () => {
    elevator.currentFloor = 3;
    elevator.addFloor(3);
    spyOn(console, 'log');
    jasmine.clock().install();
    elevator.move();
    jasmine.clock().tick(ElevatorConstants.CONFIG.DEFAULT_HALT_TIME);
    expect(elevator.targetFloors).toEqual([]);
    expect(mockService.requestLogs).toContain(
      'Elevator 1 stopping on floor 3 (boarding)'
    );
    expect(console.log).toHaveBeenCalledWith('Elevator 1 stopping on floor 3 (boarding)');
    jasmine.clock().uninstall();
  });
});
