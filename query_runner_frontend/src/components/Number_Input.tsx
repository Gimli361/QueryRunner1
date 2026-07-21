import React from 'react';
import type { InputNumberProps } from 'antd';
import { InputNumber } from 'antd';

const onChange: InputNumberProps['onChange'] = (value) => {
  console.log('changed', value);
};

const Number_Input: React.FC = () => <InputNumber min={1}  defaultValue={1000} onChange={onChange} />;

export default Number_Input;