import * as React from 'react';

declare interface Timer {
}

export interface TimerProps {
  setTimeout: (callback: (...args: any[]) => void, ms: number, ...args: any[]) => Timer;
  clearTimeout: (t: Timer) => void;
  setInterval: (callback: (...args: any[]) => void, ms: number, ...args: any[]) => Timer;
  clearInterval: (t: Timer) => void;
  // setImmediate: _setImmediate.bind(timers),
  // clearImmediate: _clearImmediate.bind(timers),
  // requestAnimationFrame: _requestAnimationFrame.bind(timers),
  // cancelAnimationFrame: _cancelAnimationFrame.bind(timers),
}

declare class TimerComponent extends React.Component {
}

declare function timer<P>(comp: React.ComponentClass): P;

export default timer;
