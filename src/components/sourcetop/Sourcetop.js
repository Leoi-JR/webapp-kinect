import {Component} from 'react';
import Plot from 'react-plotly.js';
import {PropTypes} from 'prop-types';
import {Table, Statistic, Row, Col, Avatar, Image, Button} from 'antd';
import {HomeOutlined, ArrowLeftOutlined} from '@ant-design/icons';
import $ from "jquery";

import './Sourcetop.css';

class Sourcetop extends Component {
    static propTypes = {
        sourceinfo: PropTypes.object.isRequired,
        changePanel: PropTypes.func.isRequired,
        changeEdge: PropTypes.func.isRequired,
        changeSelectedBuild: PropTypes.func.isRequired,
        map: PropTypes.object.isRequired,
        selectedBuild: PropTypes.object.isRequired  // 记录被选择的建筑id
    }

    constructor(props) {
        super(props);
    }

    updateClassName = (record, index) => {
        // if(Object.keys(this.props.selectedBuild).length === 0){
        //
        // }
        // else{
        const {ids} = this.props.selectedBuild;
        if(ids.indexOf(record['id'])>=0){
            return 'myrow selectedRow'
        }
        // }
        return 'myrow'
    }

    customizePoint = (e) => {
        const {ids} = this.props.selectedBuild;
        const {changeSelectedBuild, map} = this.props;

        const t = this;
        $.ajax({
            type: "post",
            url: "http://localhost:8080/updateroad",
            data: {
                "custom_id": JSON.stringify(ids),
                "way_point": JSON.stringify(e.lngLat.wrap())
            },
            cache: false,
            success: (data)=>{
                const res = JSON.parse(data);
                const {geojson, sum_top5_weight, sum_weight} = res;
                let edgeinfo = [];
                for(let i = 0; i < 5; i++){
                    edgeinfo.push(geojson['features'][i]['properties']);
                }

                t.props.changeEdge({sum_top5_weight, sum_weight, edgeinfo})
                t.updateMap(geojson);
                t.props.changePanel(2);
                changeSelectedBuild({ids: []});
                map.off('click', t.customizePoint)
            },
            error: ()=>{
                alert("error")
            }
        })

    }

    updateMap=(geo)=>{
        const {map} = this.props;
        map.getSource('roads').setData(geo);
        // if(typeof(map.getSource("roads")) == "undefined"){
        // }
        // else{
        //     map.removeLayer("roads");
        //     map.removeSource("roads");
        // }
        //
        // map.addSource('roads', { 'type': 'geojson', 'data': geo});
        // map.addLayer({
        //         'id': 'roads',
        //         'type': 'line',
        //         'source': 'roads',
        //         'paint': {
        //             'line-width': 8,
        //             'line-color': [
        //                 "interpolate",
        //                 ["linear"],
        //                 ["get", "rate"],
        //                 // 0,
        //                 // '#edff00',
        //                 // 1,
        //                 // 'red'
        //                 0,
        //                 '#ffffcc',
        //                 0.16,
        //                 '#ffeda0',
        //                 0.33,
        //                 '#fed976',
        //                 0.52,
        //                 '#feb24c',
        //                 0.68,
        //                 '#fd8d3c',
        //                 0.84,
        //                 '#fc4e2a',
        //                 1,
        //                 '#e31a1c'
        //             ],
        //         },
        //         'layout': {
        //             'line-cap': 'round',
        //             'line-join': 'round',
        //             'line-sort-key': ["get", "rate"]
        //         },
        //         'filter': ['!=', 'rate', 0]
        //     },
        //     'road-base'
        // );
        // map.on('click', 'roads', function (e) {
        //     console.log(e.features[0])
        // })
    }

    updateIds = (id) => {
        const {ids} = this.props.selectedBuild;
        console.log(ids)
        const {map} = this.props;
        const startLen = ids.length;
        const index = ids.indexOf(id)
        if(index >= 0){
            ids.splice(index, 1);
        }
        else{
            ids.push(id);
        }
        this.props.changeSelectedBuild({ids});
        const endLen = ids.length;
        map.setFilter('buildings2', ['in', ['get', 'OBJECTID'], ["literal", ids]]);

        if(startLen === 0 && endLen === 1){
            map.on('click', this.customizePoint)
        }
        else if(startLen === 1 && endLen === 0){
            map.off('click', this.customizePoint)
        }
    }

    render() {
        const {sourceinfo} = this.props;
        console.log(this.props.selectedBuild)
        const {gid, nowname, person} = sourceinfo;
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
                values: person,
                labels: nowname,
                domain: {column: 0},
                name: '建筑人数占比',
                hoverinfo: 'label+percent',
                hole: .7,
                type: 'pie',
                marker: {
                    colors: colors
                },
            }
        ];

        let layout = {
            title: {
                text: '建筑人数Top5',
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
                    text: '建筑人数占比',
                    x: 0.5,
                    y: 0.5
                },
            ],
            height: 360,
            width: 400,
            showlegend: false,
            grid: {rows: 1, columns: 1},
            plot_bgcolor: "#fff",
            paper_bgcolor: "rgba(0,0,0,0)",
            margin: {
                l: 20,
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
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: '建筑名称',
                dataIndex: 'buildname',
                key: 'buildname',
            },
            {
                title: '人数',
                dataIndex: 'count',
                key: 'count',
            },
        ];

        let datasource = [];
        for (let i = 0; i < nowname.length; i++) {
            datasource[i] = {
                key: String(i),
                id: gid[i],
                color1: colors[i],
                buildname: nowname[i],
                count: person[i],
            }
        }
        return (
            <div>
                <Button
                    // type="primary"
                    icon={<ArrowLeftOutlined />}
                    size={'large'}
                    style={{width: '80px'}}
                    // loading={loadings[2]}
                    onClick={() => this.props.changePanel(2)}
                />
                <div id={'sourcepie'}>
                    <Plot
                        data={data}
                        layout={layout}
                        config={{displayModeBar: false}}
                    />
                </div>
                <div id={'tablesize'}>
                    <Table className="no-hover" dataSource={datasource} columns={columns} showHeader={true} size="default"
                           rowClassName={this.updateClassName} pagination={{position: ['none']}}
                           onRow={record => {
                                        return {
                                            onClick: event => {this.updateIds(record['id'])}, // 点击行
                                            onDoubleClick: event => {},
                                            onContextMenu: event => {},
                                            onMouseEnter: event => {}, // 鼠标移入行
                                            onMouseLeave: event => {},
                                         };
                                      }
                           }/>
                </div>
            </div>

        );
    }

}

export default Sourcetop;