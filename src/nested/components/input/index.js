import React from 'react';
import { Input, Form } from 'antd';

const { Item: FormItem } = Form;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};

function AntInput({ data, ...rest }) {
  // console.log(rest);
  const { name, placeholder } = data;

  return (
    <FormItem label={name} {...formItemLayout}>
      <Input placeholder={placeholder || name}></Input>
    </FormItem>
  );

  //   return </Input>;
}

export default AntInput;
