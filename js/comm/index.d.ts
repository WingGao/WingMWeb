import { CheckboxProps } from 'semantic-ui-react';

export = WingMWeb;
export as namespace WingMWeb;

declare namespace WingMWeb {
  // request
  interface FetchOption {
    method?: string;
    dataType?: string | 'json' | 'form';
    body?: string;
    credentials?: string;
    headers?: object;
    // 是否本地缓存
    localCache?: boolean;
    // 参数模式
    allowDots?: boolean;
    arrayFormat?: 'dot';
  }

  function fetchJSON(url?: string, opts?: FetchOption): Promise<any>;

  function fGetJSON(url: string, data?: object, opts?: FetchOption): Promise<any>;

  function fPostJSON(url: string, data?: object, opts?: FetchOption): Promise<any>;

  // 安全的JSON解析器
  function JSONparse(s: string, defaultVal?: any): any;

  // 格式化
  namespace formatter {
    // 转成 10,000.01,不带￥
    function cny(y: any): string;

    // unix时间转成YYYY-MM-DD
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

    GetTree(): any;
  }

  // loader
  function simpleLoad(urls: Array<string>): Promise<any>;

  function removeLoad(urls: Array<string>): void;

  // crypt
  function md5_16(msg: any): string;
}
