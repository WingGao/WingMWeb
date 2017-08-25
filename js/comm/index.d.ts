import { CheckboxProps } from 'semantic-ui-react';

export = WingMWeb;
export as namespace WingMWeb;

declare namespace WingMWeb {
    type bOnChange = (event: React.SyntheticEvent<any>, data: any) => void;

    function twoWayBind(that: React.ReactInstance,
                        key: string, cb?: Function, getVal?: Function,
                        valueKey?: 'value' | string): { value: any, onChange: bOnChange };

    interface NewStateOption {
        after: (oldState: any) => void;
    }

    function setState(that: React.ReactInstance, newState: object, opt?: NewStateOption): void;

    //semantic
    function stTwoWayCheckbox(that: React.ReactInstance, key: string, cb?: Function): { checked: boolean, onChange: (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => void };

    function stTwoWayRadio(that: React.ReactInstance, key: string, ckval: any, cb?: Function): { checked: boolean, value: any };

    /**
     * 自动绑定menu
     * @param that
     * @param key 所要绑定的state中的变量
     * @param name menu的name
     */
    function stTwoWayMenu(that: React.ReactInstance, key: string, name: any, cb?: Function): { onClick: Function, active: boolean, name: string };

    //request
    interface FetchOption {
        method?: string;
        dataType?: string | 'json' | 'form';
        body?: string;
        credentials?: string;
        headers?: object;
        //是否本地缓存
        localCache?: boolean;
    }

    function fetchJSON(url?: string, opts?: FetchOption): Promise<any>;

    function fGetJSON(url: string, data?: object, opts?: FetchOption): Promise<any>;

    function fPostJSON(url: string, data?: object, opts?: FetchOption): Promise<any>;

    //格式化
    namespace formatter {
        //转成 10,000.01,不带￥
        function cny(y: any): string;

        //unix时间转成YYYY-MM-DD
        function unixToDate(unix: string | number): string;
    }

    // 将list转换为tree
    interface LTTOption {
        key_id?: string | 'id';
        key_parent?: string | 'parent';
        key_child?: string | 'child';
        key_sort?: string | null;
    }
    class LTT {
        constructor(list: Array<any>, options: LTTOption);
    }

    //
}
