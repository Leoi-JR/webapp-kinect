import {Component} from 'react';
import Plot from 'react-plotly.js';
import {PropTypes} from 'prop-types';
import { Table, Statistic, Row, Col, Avatar, Image } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

import "./Showinfo.css";

class Showinfo extends Component{
    static propTypes = {
        statisticbuild: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
    }

    render() {
        const {values, labels} = this.props.statisticbuild;
        const building_num = values.reduce((prev,current,index,arr)=>{
            return prev+current
        });
        const colors = ['#8dd3c7',
            '#ffffb3',
            '#bebada',
            '#fb8072',
            '#80b1d3',
            '#fdb462',
            '#b3de69',
            '#fccde5',
            '#d9d9d9',
            '#bc80bd',
            '#ccebc5',
            '#ffed6f'];
        let data = [{
            values: values,
            labels: labels,
            domain: {column: 0},
            name: '建筑用途',
            hoverinfo: 'name+label+percent',
            hole: .7,
            type: 'pie',
            marker: {
                colors: colors
            }
        }];

        let layout = {
            title: {
                text:'深圳大学沧海校区',
                font: {
                    size: 34
                }
            },
            annotations: [
                {
                    font: {
                        size: 20
                    },
                    showarrow: false,
                    text: '建筑分类',
                    x: 0.5,
                    y: 0.5
                }
            ],
            height: 360,
            width: 400,
            showlegend: false,
            grid: {rows: 1, columns: 1},
            plot_bgcolor: "#fff",
            paper_bgcolor: "rgba(0,0,0,0)",
            margin: {
                // t: 20,
                b: 30
            }
        };

        const columns = [
            {
                title: '颜色',
                dataIndex: 'color1',
                key: 'color1',
                render: color => (
                    <>
                        <div style={{height: '10px', width: '10px', backgroundColor: color}}>
                        </div>
                    </>
                ),
            },
            {
                title: '用途',
                dataIndex: 'usage',
                key: 'usage',
            },
            {
                title: '数量',
                dataIndex: 'count',
                key: 'count',
            },
        ];

        let datasource = [];
        for(let i = 0; i < values.length; i++){
            datasource[i] = {
                key: String(i),
                color1: colors[i],
                usage: labels[i],
                count: values[i],
            }
        }
        return (
            <div>
                <div id={'buildpie'}>
                    <Plot
                        data={data}
                        layout={layout}
                        config={{displayModeBar: false}}
                    />
                </div>
                <Row gutter={16} justify="center">
                    <Col span={4}>
                        <Statistic title="建筑总数" value={building_num} prefix={<HomeOutlined />} valueStyle={{fontSize: "30px"}} />
                    </Col>
                </Row>
                <div id={'tablesize'}>
                    <Table dataSource={datasource} columns={columns} showHeader={false} size="small" rowClassName={'myrow'}  pagination={{position: ['none']}} />
                </div>
            </div>

        );
    }

}

export default Showinfo;