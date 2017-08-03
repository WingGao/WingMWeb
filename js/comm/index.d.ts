export = WingMWeb;
export as namespace WingMWeb;

declare namespace WingMWeb {
    function twoWayBind(that: React.ReactInstance,
        key: string, cb?: Function, getVal?: Function,
        valueKey = 'value'): { value: any, onChange: Function };

    interface NewStateOption {
        after: (oldState) => void,
    }
    function setState(that: React.ReactInstance, newState: object, opt?: NewStateOption);


    //semantic

    function stTwoWayRadio(that: React.ReactInstance, key: string, ckval: any, cb?: Function): { checked: boolean, value: any }
    /**
     * 自动绑定menu
     * @param that 
     * @param key 所要绑定的state中的变量
     * @param name menu的name
     */
    function stTwoWayMenu(that: React.ReactInstance, key: string, name: any, cb?: Function): { onClick: Function, active: boolean, name: string }

    //request 
    interface FetchOption {
        method?: string,
        dataType?: string | 'json' | 'form',
        body?: string,
        credentials?: string,
        headers?: object,
        //是否本地缓存
        localCache?: boolean,
    }

    function fetchJSON(url?: string, opts?: FetchOption): Promise;
    function fGetJSON(url: string, data?: object, opts?: FetchOption): Promise;
    function fPostJSON(url: string, data?: object, opts?: FetchOption): Promise;

    //格式化
    namespace formatter {
        //转成 10,000.01,不带￥
        function cny(y: any): string;
        //unix时间转成YYYY-MM-DD
        function unixToDate(unix: string | number): string;
    }
}