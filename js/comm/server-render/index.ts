import * as React from 'react';
import { uniqueId } from 'lodash';

const debug = require('debug')('log:Wing/SRComponent');

export interface SRComponentInst extends React.Component {
  readonly srId: string;
  readonly srReady: () => void;
}

/**
 * 服务端渲染组件
 */
export class SRComponent<P, S> extends React.Component<P, S> {
  readonly srId = uniqueId('sr_');

  constructor(props: P, context?: any) {
    super(props, context);
    service.add(this as any);
  }

  /**
   * 渲染完成回调
   * 默认延迟500ms
   */
  protected srReady() {
    debug('srReady');
    setTimeout(() => {
      service.remove(this as any);
    }, 500);
  }
}

class SRService {
  waitingComponents: Map<string, SRComponentInst> = new Map<string, SRComponentInst>();
  finish = false;

  // 添加需要等待的组件
  add(comp: SRComponentInst) {
    debug('add', comp.srId, comp);
    if (this.finish) { // 删除完成节点
      document.getElementById('wing_ssr_completed').remove();
    }
    this.finish = false;
    this.waitingComponents.set(comp.srId, comp);
  }

  remove(comp: SRComponentInst) {
    debug('remove', comp.srId, comp);
    this.waitingComponents.delete(comp.srId);
  }

  start() {
    const loopDuration = 5000;
    setInterval(() => {
      let waitSize = this.waitingComponents.size;
      if (waitSize === 0 && !this.finish) {
        debug('finish');
        this.finish = true;
        // 完成
        let a = document.createElement('span');
        a.id = 'wing_ssr_completed';
        a.style.display = 'none';
        document.body.appendChild(a);
      } else if (waitSize > 0) {
        debug('waitingComponents', waitSize);
      }
    }, loopDuration);
  }
}

const service = new SRService();

export function srStart() {
  service.start();
}
