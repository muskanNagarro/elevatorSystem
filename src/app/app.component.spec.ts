import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ElevatorControllerService } from './services/elevator-controller/elevator-controller.service';
import { ElevatorConstants, RequestType } from './constants/elevator.constants';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockService: jasmine.SpyObj<ElevatorControllerService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj<ElevatorControllerService>('ElevatorControllerService', [
      'getElevators',
      'generateRequest',
      'requestForElevator',
      'clearLogs'
    ], {
      requestLogs: []
    });

    TestBed.configureTestingModule({
      declarations: [],
      providers: [{ provide: ElevatorControllerService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should initialize floors and elevators on ngOnInit', () => {
    component.ngOnInit();

    expect(component.floors.length).toBe(ElevatorConstants.CONFIG.TOTAL_FLOORS);
    expect(component.floors[0]).toBe(1);
    expect(mockService.getElevators).toHaveBeenCalled();
  });

  it('should auto-generate requests in ngOnInit', fakeAsync(() => {
    const mockRequest: RequestType = { floor: 4, direction: 'up' };
    mockService.getElevators.and.returnValue([]);
    mockService.generateRequest.and.returnValue(mockRequest);

    component.ngOnInit();
    tick(ElevatorConstants.CONFIG.DEFAULT_AUTO_GEN_HALT_TIME);

    expect(mockService.generateRequest).toHaveBeenCalled();
    expect(mockService.requestForElevator).toHaveBeenCalledWith(mockRequest);
    expect(mockService.requestLogs).toContain(
      'Request received: UP from floor 4'
    );
  }));

  it('should call requestForElevator with parsed request in manualRequest', () => {
    const floor = '3';
    const direction = 'down';
    const expectedRequest: RequestType = { floor: 3, direction: 'down' };

    component.manualRequest(floor, direction);

    expect(mockService.requestForElevator).toHaveBeenCalledWith(expectedRequest);
  });

  it('should call clearLogs on clearLogs()', () => {
    component.clearLogs();
    expect(mockService.clearLogs).toHaveBeenCalled();
  });
});
