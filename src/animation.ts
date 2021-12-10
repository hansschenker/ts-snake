
// import { FRAMES } from './frames';
import { Observable, Subscriber,map, takeWhile, endWith, identity } from 'rxjs';
import { Position } from './snake';

export // Linear interpolation function
function lerp(start:Position, end:Position) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const rate = 0.05;
  
  return {
    x: start.x + dx * rate,
    y: start.y + dy * rate,
  };
}


// frames start

/**
 * An alternating array of Subscribers and their start times.
 */
let _subscribers: (Subscriber<number>|number)[] = [];

let active = false;
let id = -1;

function start() {
  active = true;
  id = requestAnimationFrame(tick);
}

function tick() {
  const copy = _subscribers.slice();
  const now = Date.now();
  for (let i = 0; i < copy.length; i+=2) {
    const subscriber = copy[i] as Subscriber<number>;
    const start = copy[i+1] as number;
    subscriber.next(now - start);
  }
  if (_subscribers.length) {
    id = requestAnimationFrame(tick);
  }
}

function removeSubscriber(index: number) {
  _subscribers.splice(index, 2);
  if (_subscribers.length === 0) {
    active = false;
    cancelAnimationFrame(id);
  }
}

/**
 * A shared observable of animation frames.
 * 
 * Since animation frames are global in nature, all subscriptions to this
 * observable are inherently shared. Emits a `number` that is the number of 
 * milliseconds since subscription started on each tick. This observable
 * does not end.
 */
export const FRAMES = new Observable<number>(subscriber => {
  _subscribers.push(subscriber, Date.now());
  if (!active) {
    start();
  }
  return () => {
    const index = _subscribers.indexOf(subscriber);
    if (index) {
      removeSubscriber(index);
    }
  };
});

// frames end

/**
 * Returns an observable that emits numbers between 0 and 1 for a give duration of time.
 * 
 * If the `ms` argument is `5000`, and an animation frame fires at 2500ms, then it will emit
 * `0.5`. If the animation frame fires at 4000ms, then it will emit `0.8`. If the animation
 * frame first at 5000ms or later, it will emit `1` and complete.
 * 
 * @param ms The number of milliseconds for the observable to last
 * @param frames A frame source for milliseconds elapsed since subscription
 */
export function duration(ms: number, frames = FRAMES) {
  return new Observable<number>(subscriber => {
    // NOTE: FRAMES cannot error or complete.
    return frames.subscribe((elapsed) => {
      let d = elapsed / ms;
      if (d < 1) {
        subscriber.next(d);
      } else {
        subscriber.next(1);
        subscriber.complete();
      }
    });
  })
}

// easing functions
export function easeInQuad(t: number) {
    return t * t;
  }
  
  export function easeOutQuad(t: number) {
    return  -t * (t - 2);
  }
  
  export function easeInOutQuad(t: number) {
    return ((t *= 2) < 1) ? (t ** 3 / 2) :
      (((t -= 2) * t * t + 2) / 2);
  }
  
  export function easeInCubic(t: number) {
    return t ** 3;
  }
  
  export function easeOutCubic(t: number) {
    return (t = t - 1) * t * t + 1;
  }
  
  export function easeInOutCubic(t: number) {
    return ((t *= 2) < 1) ?  (t ** 3 / 2) :
      (((t -= 2) * t * t + 2) / 2);
  }
  
  export function easeInQuart(t: number) {
    return t ** 4;
  }
  
  export function easeOutQuart(t: number) {
    return -1 * ((t = t - 1) * t * t * t - 1);
  }
  
  export function easeInOutQuart(t: number) {
    return ((t *= 2) < 1) ? (t ** 4 / 2) :
     (((t -= 2) * t ** 3 - 2) / -2);
  }
  
  export function easeInQuint(t: number) {
    return t ** 5;
  }
  
  export function easeOutQuint(t: number) {
    return (t = t - 1) * t ** 4 + 1;
  }
  
  export function easeInOutQuint(t: number) {
    return  ((t *= 2) < 1) ? (t ** 5 / 2) :
      (((t -= 2) * t ** 4 + 2) / 2);
  }
  
  export function easeInSine(t: number) {
    return -1 * Math.cos(t * (Math.PI / 2)) + 1;
  }
  
  export function easeOutSine(t: number) {
    return Math.sin(t * (Math.PI / 2));
  }
  
  export function easeInOutSine(t: number) {
    return (Math.cos(Math.PI * t) - 1) / 2;
  }
  
  export function easeInExpo(t: number) {
    return (t === 0) ? 0 : Math.pow(2, 10 * (t - 1));
  }
  
  export function easeOutExpo(t: number) {
    return (t === 1) ? 1 : (-Math.pow(2, -10 * t) + 1);
  }
  
  export function easeInOutExpo(t: number) {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if ((t *= 2) < 1) return Math.pow(2, 10 * (t - 1)) / 2;
    return (-Math.pow(2, -10 * --t) + 2) / 2;
  }
  
  export function easeInCirc(t: number) {
    return -(Math.sqrt(1 - t * t) - 1);
  }
  
  export function easeOutCirc(t: number) {
    return Math.sqrt(1 - (t = t - 1) * t);
  }
  
  export function easeInOutCirc(t: number) {
    if ((t *= 2) < 1) return (Math.sqrt(1 - t * t) - 1) / -2;
    return (Math.sqrt(1 - (t -= 2) * t) + 1) / 2;
  }
  
  const DOUBLE_PI = 6.283185307179586;
  const ASIN_1 = Math.asin(1);
  const p1 = 0.3;
  const ev1 = p1 / DOUBLE_PI * ASIN_1;
  
  export function easeInElastic(t: number) {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return -1 * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * 1 - ev1) * DOUBLE_PI / p1);
  }
  
  const p2 = 0.3;
  const ev2 = p2 / DOUBLE_PI * ASIN_1;
  
  export function easeOutElastic(t: number) {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2 , -10 * t) * Math.sin((t * 1 - ev2) * DOUBLE_PI / p2) + 1;
  }
  
  const p3 = 0.45;
  const ev3 = p3 / DOUBLE_PI * ASIN_1;
  
  export function easeInOutElastic(t: number) {
    if (t === 0) return 0;
    if ((t /= 1/2) === 2) return 1;
    let x: number;
    let m: number;
    if (t < 1) {
      x = 1;
      m = 0;
    } else {
      x = -1;
      m = 1;
    }
    t -= 1;
    return Math.pow(2, x * 10 * t) * Math.sin((t - ev3) * DOUBLE_PI / p3) / (x * 2) + m;
  }
  
  const s = 1.70158;
  
  export function easeInBack(t: number) {
    return t * t * ((s + 1) * t - s);
  }
  
  export function easeOutBack(t: number) {
    return (t = t - 1) * t * ((s + 1) * t + s) + 1;
  }
  
  export function easeInOutBack(t: number) { 
    const s1 = s * 1.525;
    if ((t *= 2) < 1) {
      return (t * t * ((s1 + 1) * t - s1)) / 2;
    }
    return ((t -= 2) * t * ((s1 + 1) * t + s1) + 2) / 2;
  }
  
  const step1 = 4 / 11;
  const step2 = 8 / 11;
  const step3 = 10 / 11;
  const a2 = 6 / 11;
  const a3 = 9 / 11;
  const a4 = 21 / 22;
  const acc = 7.5625;
  
  export function easeInBounce(t: number) {
    return 1 - easeOutBounce(1 - t);
  }
  
  export function easeOutBounce(t: number) {
    if (t < step1) {
      return acc * t * t;
    } else if (t < step2) {
      return acc * (t -= a2) * t + 0.75;
    } else if (t < step3) {
      return acc * (t -= a3) * t + 0.9375;
    } else {
      return acc * (t -= a4) * t + 0.984375;
    }
  }
  
  export function easeInOutBounce(t: number) {
    if (t < 1/2) return easeInBounce(t * 2) / 2;
    return easeOutBounce(t) / 2 + 0.5;
  }
  
  



/**
 * Configuration for a {@link tween} call.
 */
export interface TweenConfig {
  /**
   * The starting number of the tween
   */
  start: number;
  /**
   * The final number to tween to.
   */
  end: number;
  /**
   * The amount of time to tween between the `start` and the `end` values.
   */
  duration: number;
  /**
   * An optional global frame source. An observable of elapsed milliseconds since subscription.
   */
  frames?: Observable<number>;
  /**
   * An optional easing function
   */
  easing?: (input: number) => number; // TODO: create a type.
}

/**
 * Returns an observable of numbers between a `start` and an `end` value, incrementally moving 
 * from `start` toward `end` over the period specified as `duration` in the config object.
 * 
 * Additionally, an easing function can be provided.
 * 
 * @param config The tween configuration
 */
export function tween({
  start,
  end,
  duration: ms,
  easing = identity,
  frames = FRAMES
}: TweenConfig) {
  const diff = end - start;
  // TODO: This may need to be optimized later
  return duration(ms, frames).pipe(map(d => easing(d) * diff + start));
}

// ----------------------------------------------------------------
/**
 * Returns an `Observable` of numbers progressing by a given velocity.
 * 
 * The number can represent any unit, but is commonly used to represent pixels travelled
 * or degrees rotated, etc.
 * 
 * @param unitsPerMillisecond The number of units to progress per millisecond
 * @param frames The frame source, an observable of milliseconds elapsed since start. {@see FRAMES}
 */
 export function velocity(unitsPerMillisecond: number, frames: Observable<number> = FRAMES) {
    return frames.pipe(
      map(elapsed => elapsed * unitsPerMillisecond)
    )
  }

 