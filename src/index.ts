import {
  delay,
  distinctUntilChanged,
  merge,
  mergeMap,
  of,
  scan,
  takeUntil,
  withLatestFrom,
} from "rxjs";
import "./style.css";
import {
  combineLatest,
  fromEvent,
  filter,
  interval,
  map,
  repeat,
  switchMap,
  take,
  tap,
} from "rxjs";
import {
  Snake,
  size,
  range,
  generateSnake,
  SnakeState,
  Position,
} from "./snake";

// type Direction = "x" | "-x" | "y" | "-y";

// interface Position {
//   x: number;
//   y:  number;
// }
interface Move {
  step: string;
  direction: string;
}

type Keys = {
  [key: number]: string;
};

const keysToDirection: Keys = {
  37: "-x",
  39: "x",
  38: "-y",
  40: "y",
};

const snakeEl = document.getElementById("snake");
const root = document.documentElement;
// root.style.setProperty('--snake-width', "20px")
// root.style.setProperty('--delta-x', "0px")
// root.style.setProperty('--delta-y', "0px")

const left$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
  filter((e) => e.keyCode === 37),
  map((e) => keysToDirection[e.keyCode])
);
const right$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
  filter((e) => e.keyCode === 39),
  map((e) => keysToDirection[e.keyCode])
);
const up$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
  filter((e) => e.keyCode === 38),
  map((e) => keysToDirection[e.keyCode])
);
const down$ = fromEvent<KeyboardEvent>(document, "keydown").pipe(
  filter((e) => e.keyCode === 40),
  map((e) => keysToDirection[e.keyCode])
);

const keys$ = merge(left$, right$, up$, down$)
const timer$ = interval(1000)
  .pipe(
    withLatestFrom(keys$),
    take(15),
    map((v) => ({ number: v[0], move: v[1] }))
  )
  //.subscribe((v) => console.log(v))
  .subscribe(moveDirection);


//@ts-ignore
function moveDirection({ number, move }) {

  let step = 30;
  let translate = "";
  let translateDeltaX = `${number * step}px`;
  
  console.log("move:",translateDeltaX);

  if (move === "x") {
    translate = `translateX(${number * step}px)`;
  } else if (move === "y") {
    translate = `translateY(${number * step}px)`;
  } else if (move === "-x") {
    translate = `translateX(${-number * step}px)`;
  } else if (move === "-y") {
    translate = `translateY(${-number * step}px)`;
  }

  snakeEl!.style.setProperty("transform", translate);
}




