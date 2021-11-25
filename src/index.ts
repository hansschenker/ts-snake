import { interval, map, scan, take, tap } from "rxjs";

import "./style.css";

type Size = number;

type Color = "red" | "green";

type Square = { x: number; y: number; size: Size; color: string };

type Snake = Square[];

const range = (min: number, max: number) =>
  Array.from({ length: max - min + 1 }, (_, i) => min + i);

const renderSnake = (snake: Snake) => {
  const boardEl = document.getElementById("board"); //

  snake.map((square, i) => {
    console.log("i:", i);

    const divEl = document.createElement("div");
    divEl.innerText = "X";
    divEl.style.position = "absolute";
    divEl.style.display = "inline-block";
    divEl.style.left = square.x + "px";
    divEl.style.top = square.y + "px";
    divEl.style.width = square.size + "px";
    divEl.style.height = square.size + "px";
    divEl.style.backgroundColor = "green";
    divEl.style.border = "1px solid black";
    divEl.style.textAlign = "center";

    console.log("divEl:", divEl);
    boardEl!.appendChild(divEl);
  });
};

const generateSnake = (nbrs: number[]): Snake => {
  return nbrs.map((n, i) => ({
    x: n * 40,
    y: 70,
    size: 40,
    color: "green",
  })); //?
};

const snake = generateSnake(range(1, 1));
console.log("snake:", snake);

const updateSnake = (x: number) => {
  snake.forEach((s) => (s.x += 40));
};
const ticks$ = interval(1000);

ticks$
  .pipe(
    map(n => snake.forEach(s => s.x += 40)),
    tap(() => renderSnake(snake)),
    take(4)
  )
  .subscribe();
