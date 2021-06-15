import {Component} from 'react';
import Plot from 'react-plotly.js';
import {PropTypes} from 'prop-types';
import {Table, Statistic, Row, Col, Avatar, Image} from 'antd';
import $ from 'jquery';

import './Edgetop.css';

class Edgetop extends Component {
    static propTypes = {
        edgeinfo: PropTypes.object.isRequired,
        changeSource: PropTypes.func.isRequired,
        changePanel: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
    }

    getSourceTop5 = (data) => {
        const {edgeinfo} = this.props.edgeinfo;

        $.ajax({
            type: "post",
            url: "http://localhost:8080/getsourcetop5",
            data: {
                "sourcelist": JSON.stringify(edgeinfo[data['key']]['buildsource'])
            },
            cache: false,
            success: (data)=>{
                const res = JSON.parse(data);
                this.props.changeSource(res);  // {gid, nowname, person}
                this.props.changePanel(3)
            },
            error: ()=>{
                alert("error")
            }
        })
    }

    render() {
        const {sum_top5_weight, sum_weight, edgeinfo} = this.props.edgeinfo;
        const top5_each_value = [];
        const top5_each_label = [];
        for(let i = 0; i < edgeinfo.length; i++){
            top5_each_label.push(edgeinfo[i]['gid']);
            top5_each_value.push(edgeinfo[i]['weight']);
        }
        const colors = [
            '#a6cee3',
            '#1f78b4',
            '#b2df8a',
            '#33a02c',
            '#fb9a99',
            '#e31a1c',
            '#fdbf6f',
            '#ff7f00',
            '#cab2d6',
            '#6a3d9a',
            '#ffff99',
            '#b15928'
        ];
        let data = [
            {
                values: [sum_weight-sum_top5_weight, sum_top5_weight],
                labels: ['Other', 'Top5'],
                domain: {column: 0},
                name: 'Top5总占比',
                hoverinfo: 'name+label+percent',
                hole: .7,
                type: 'pie',
                marker: {
                    colors: colors.slice(5, 7)
                },
                showlegend: true
            },
            {
                values: top5_each_value,
                labels: top5_each_label,
                domain: {column: 1},
                name: 'Top5占比',
                hoverinfo: 'name+label+percent',
                hole: .7,
                type: 'pie',
                marker: {
                    colors: colors
                },
                showlegend: false,
            }
        ];

        let layout = {
            title: {
                text: '道路流量信息',
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
                    text: 'Top5总占比',
                    x: 0.10,
                    y: 0.5
                },
                {
                    font: {
                        size: 20
                    },
                    showarrow: false,
                    text: 'Top5占比',
                    x: 0.88,
                    y: 0.5
                }
            ],
            height: 400,
            width: 520,
            showlegend: true,
            legend: {
                x: -0.1,
                xanchor: 'left',
                y: 1
            },
            grid: {rows: 1, columns: 2},
            plot_bgcolor: "#fff",
            paper_bgcolor: "rgba(0,0,0,0)",
            margin: {
                l: 0,
                b: 30
            }
        };

        const columns = [
            {
                title: '',
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
                title: 'ID',
                dataIndex: 'gid',
                key: 'gid',
            },
            {
                title: '流量',
                dataIndex: 'weight',
                key: 'weight',
            },
        ];

        let datasource = [];
        for (let i = 0; i < top5_each_value.length; i++) {
            datasource[i] = {
                key: String(i),
                gid: top5_each_label[i],
                color1: colors[i],
                weight: top5_each_value[i],
            }
        }
        return (
            <div>
                <div id={'edgepie'}>
                    <Plot
                        data={data}
                        layout={layout}
                        config={{displayModeBar: false}}
                    />
                </div>

                <div id={'tablesize'}>
                    <Table dataSource={datasource} columns={columns} showHeader={true} size="default"
                           rowClassName={'myrow'} pagination={{position: ['none']}}
                           onRow={record => {
                                return {
                                    onClick: event => {this.getSourceTop5(record)}, // 点击行
                                    onDoubleClick: event => {},
                                    onContextMenu: event => {},
                                    onMouseEnter: event => {}, // 鼠标移入行
                                    onMouseLeave: event => {},
                                };
                    }} />
                </div>
            </div>

        );
    }

}

export default Edgetop;