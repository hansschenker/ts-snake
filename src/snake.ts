import { interval, map, scan, take, tap } from "rxjs";

type Size = number;
export const size: Size = 30;

//  export type Color = "red" | "green";

export type Position = { x: number; y: number };

// export type Direction = "left" | "right" | "up" | "down";

//export type Move = [number, Position]

// export const moves: Move[] = [
//   [ 37, { x: -1, y: 0 } ],
//   [ 39, { x: 1, y: 0 } ],
//   [ 38, { x: 0, y: -1 } ],
//   [ 40, { x: 0, y: 1 } ],
// ];

export type Square = { position: Position; size: Size; color: string };

export type Snake = Square[];

export const range = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);

export interface SnakeState {
  snake: Snake;
  length: number;
//   move: Move;
}

export const generateSnake = (nbrs: number[]): Snake => {
  const lastNbr = nbrs[nbrs.length - 2];
  //const lastNbr = 2
//   console.log("last nbr", nbrs[nbrs.length - 2]);

  const snake = nbrs.map((n, i) => ({
    position: { x: n * size, y: 170 },
    size: size,
    color: i === lastNbr ? "red" : "green",
  })); //?

  return snake;
};
