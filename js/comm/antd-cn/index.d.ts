import { ModalFuncProps, ModalProps, ModalFunc } from 'antd/lib/modal/Modal';

export class ModalCN {
  static error(props: ModalFuncProps): ModalFunc;

  static success(props: ModalFuncProps): ModalFunc;

  static confirm(props: ModalFuncProps): ModalFunc;

  static confirmDelete(props: ModalFuncProps): ModalFunc;

  static build(props: ModalFuncProps & { content: any }): ModalFunc;
}

export * from './data-picker';
export * from './utils';
