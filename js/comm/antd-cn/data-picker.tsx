import * as React from 'react';
import { DatePicker } from 'antd';
import * as localeCN from 'antd/lib/date-picker/locale/zh_CN';
import { merge } from 'lodash';

export function DatePickerCN(props) {
  props = merge({ locale: localeCN }, props);
  return (<DatePicker {...props} />);
}
