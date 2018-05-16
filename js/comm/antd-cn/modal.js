import * as React from 'react';
import { Modal } from 'antd';
import { merge } from 'lodash';

export class ModalCN {
    static error(props) {
        props = merge({ okText: '确定', title: '错误' }, props);
        return Modal.error(props);
    }

    static success(props) {
        props = merge({ okText: '确定', title: '成功' }, props);
        return Modal.success(props);
    }

    static confirm(props) {
        props = merge({ okText: '是', title: '确认', cancelText: '否' }, props);
        return Modal.confirm(props);
    }

    static build(props) {
        props = merge({ okText: '确定', cancelText: '取消' }, props);
        return <Modal {...props}>{props.content}</Modal>;
    }

    static confirmDelete(props) {
        props = merge({
            okText: '删除', okType: 'danger', title: '确认删除', cancelText: '取消',
            content: '是否删除？',
        }, props);
        return Modal.confirm(props);
    }
}
