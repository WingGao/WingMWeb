import * as React from 'react';
import { uniqueId } from 'lodash';

const debug = require('debug')('log:Wing/SRComponent');

export interface SRComponentInst extends React.Component {
  readonly srId: string;
  readonly srReady: () => void;
}

export class SRComponent<P, S> extends React.Component<P, S> {
  readonly srId = uniqueId('sr_');

  constructor(props: P, context?: any) {
    super(props, context);
    service.add(this as any);
  }

  protected srReady() {
    debug('srReady');
    service.remove(this as any);
  }
}

class SRService {
  waitingComponents: Map<string, SRComponentInst> = new Map<string, SRComponentInst>();
  finish = false;

  // 添加需要等待的组件
  add(comp: SRComponentInst) {
    this.finish = false;
    this.waitingComponents.set(comp.srId, comp);
  }

  remove(comp: SRComponentInst) {
    this.waitingComponents.delete(comp.srId);
  }

  start() {
    const loopDuration = 5000;
    setInterval(() => {
      if (this.waitingComponents.size === 0 && !this.finish) {
        this.finish = true;
        // 完成
        let a = document.createElement('a');
        a.id = 'wing_ssr_completed';
        a.style.display = 'none';
        document.body.appendChild(a);
      }
    }, loopDuration);
  }
}

const service = new SRService();

export function srStart() {
  service.start();
}
