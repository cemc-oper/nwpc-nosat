import React from 'react';
import PropTypes from 'prop-types';


import { Row, Col, Button, Form, Input} from 'antd';


export default class CommandOutputPanel extends React.Component{
  constructor(props) {
    super(props);
  }

  handleClearClick(e) {
    const {handler} = this.props;
    handler.clear_command_output_handler();
  }

  render(){
    const {command_output, title} = this.props;
    return (
      <div>
        <Row>
          <Col span={8}>
            <h3>{title}</h3>
          </Col>
          <Col span={8} offset={8} style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <Button type="default" icon="enter" />
            <Button type="default" icon="arrow-down"/>
            <Button type="default" icon="delete" onClick={this.handleClearClick.bind(this)}/>
          </Col>
        </Row>
        <Row>
          <Form>
            <Form.Item>
              <Input.TextArea value={command_output} readOnly/>
            </Form.Item>
          </Form>
        </Row>
      </div>
    )
  }
}

CommandOutputPanel.propTypes = {
  title: PropTypes.string,
  command_output: PropTypes.string,
  handler: PropTypes.shape({
    clear_command_output_handler: PropTypes.func
  })
};

CommandOutputPanel.defaultProps = {
  title: '命令输出'
};
