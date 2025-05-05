export type Direction = 'up' | 'down' | 'stop';
export interface RequestType {
  floor: number;
  direction: Direction;
}
export const ElevatorConstants = {
    CONFIG: {
      TOTAL_FLOORS: 10,
      TOTAL_ELEVATORS: 4,
      DEFAULT_HALT_TIME: 10000, 
      DEFAULT_AUTO_GEN_HALT_TIME: 15000, 
    }
};