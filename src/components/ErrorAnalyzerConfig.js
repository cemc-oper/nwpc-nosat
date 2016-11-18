import React, { Component, PropTypes } from 'react';

export default  class ErrorAnalyzerConfig extends Component{
    constructor(props) {
        super(props);
    }

    getConfig() {
        let config = Object();
        config.error_log_path = this.refs.error_log_path_node.value;
        config.analytics_type = this.refs.analytics_type_node.value;
        config.begin_date = this.refs.begin_date_node.value;
        config.end_date = this.refs.end_date_node.value;
        return config;
    }

    render() {
        const { error_log_path, analytics_type, begin_date, end_date } = this.props;
        return (
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-primary">
                            <div className="panel-heading">
                                <h3 className="panel-title">配置</h3>
                            </div>
                            <div className="panel-body">
                                <form>
                                    <div className="form-group">
                                        <label className="">错误日志路径</label>
                                        <input type="text" className="form-control" ref="error_log_path_node" defaultValue={error_log_path} />
                                    </div>
                                    <div className="form-group">
                                        <label>统计类型</label>
                                        <select className="form-control" ref="analytics_type_node" defaultValue={analytics_type}>
                                            <option value="day">Day</option>
                                            <option value="weekday">Weekday</option>
                                            <option value="system">System</option>
                                            <option value="date-hour">Hour by day</option>
                                            <option value="hour">Hour</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>起始日期</label>
                                        <input type="date" className="form-control" ref="begin_date_node" defaultValue={begin_date} />
                                    </div>
                                    <div className="form-group">
                                        <label>结束日期</label>
                                        <input type="date" className="form-control" ref="end_date_node" defaultValue={end_date} />
                                    </div>
                                </form>
                            </div>
                        </div>



                    </div>
                </div>
            </div>
        );
    }
}

ErrorAnalyzerConfig.propTypes = {
    error_log_path: PropTypes.string,
    analytis_type: PropTypes.string,
    begin_date: PropTypes.string,
    end_date: PropTypes.string
}
