
import * as React from 'react';
import { Table } from 'antd';
import { DragDropContext, DragDropContextProvider, DragSource, DropTarget } from 'react-dnd';
import { default as HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { compose } from 'redux';
import { TableProps } from 'antd/lib/table';
import { omit, isEqual, merge } from 'lodash';
import './dragTable.less';

function dragDirection(
    dragIndex,
    hoverIndex,
    initialClientOffset,
    clientOffset,
    sourceClientOffset
) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

class BodyRow extends React.Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps,
        } = this.props as any;
        const style = { ...restProps.style, cursor: 'move' };

        let className = restProps.className;
        if (isOver && initialClientOffset) {
            const direction = dragDirection(
                dragRow.index,
                restProps.index,
                initialClientOffset,
                clientOffset,
                sourceClientOffset
            );
            if (direction === 'downward') {
                className += ' drop-over-downward';
            }
            if (direction === 'upward') {
                className += ' drop-over-upward';
            }
        }

        return connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);

export interface DragSortingTableProps extends TableProps<any> {
    onRawMove?: (data: any) => void;
}
class DragSortingTable extends React.Component<DragSortingTableProps> {
    state = {
        data: [],
    };

    components = {
        body: {
            row: DragableBodyRow,
        },
    };
    inited = false;
    componentDidMount() {
        this.componentWillReceiveProps(this.props);
    }
    componentWillReceiveProps(nextProps: DragSortingTableProps) {
        if (!isEqual(nextProps, this.props) || !this.inited) {
            this.inited = true;
            this.setState({ data: nextProps.dataSource });
        }
    }

    moveRow = (dragIndex, hoverIndex) => {
        const { onRawMove } = this.props;
        const { data } = this.state;
        const dragRow = data[dragIndex];
        let newState = update(this.state, {
            data: {
                $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
            },
        })
        this.setState(newState);
        if (onRawMove != null) onRawMove(newState.data);
    }

    render() {
        let tableProps = merge({
            footer: () => '拖拽来排序',
        }, omit(this.props, 'dataSource'));
        return (
            <Table
                {...tableProps}
                dataSource={this.state.data}
                components={this.components}
                pagination={false}
                onRow={(record, index) => ({
                    index,
                    moveRow: this.moveRow,
                })}
            />
        );
    }
}

export default compose<new () => React.Component<DragSortingTableProps, any>>(
    DragDropContext(HTML5Backend)
)(DragSortingTable);
