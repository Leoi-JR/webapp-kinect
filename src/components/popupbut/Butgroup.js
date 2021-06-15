import React, {Component} from "react";
import {Button} from "antd";
import {PropTypes} from 'prop-types';
import $ from 'jquery';

class Butgroup extends Component {
    static propTypes = {
        x:PropTypes.number.isRequired,
        y:PropTypes.number.isRequired,
        source: PropTypes.array.isRequired,
        target: PropTypes.array.isRequired,
        objectid: PropTypes.number.isRequired,
        map:PropTypes.object.isRequired,
        // updateDijk: PropTypes.func.isRequired,
        changePanel: PropTypes.func.isRequired,
        changeEdge: PropTypes.func.isRequired
    }

    constructor() {
        super();
    }

    setTarget = () => {
        const {objectid} = this.props;
        const t = this;

        $.ajax({
            type: "post",
            url: "http://localhost:8080/dijkstra",
            data: {
                // "source": JSON.stringify(source),
                "target": JSON.stringify(objectid)
            },
            cache: false,
            success: (data)=>{
                const res = JSON.parse(data);
                const {geojson, sum_top5_weight, sum_weight} = res;
                let edgeinfo = [];
                for(let i = 0; i < 5; i++){
                    edgeinfo.push(geojson['features'][i]['properties']);
                }
                console.log(edgeinfo)
                t.props.changeEdge({sum_top5_weight, sum_weight, edgeinfo})
                t.updateMap(geojson);
                t.props.changePanel(2);
            },
            error: ()=>{
                alert("error")
            }
        });
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

        // map.addSource('roads', { 'type': 'geojson', 'data': geo});
        // map.addLayer({
        //     'id': 'roads',
        //     'type': 'line',
        //     'source': 'roads',
        //     'paint': {
        //         'line-width': 8,
        //         'line-color': [
        //             "interpolate",
        //             ["linear"],
        //             ["get", "rate"],
        //             // 0,
        //             // '#17ff00',
        //             0,
        //             '#ffffcc',
        //             0.16,
        //             '#ffeda0',
        //             0.33,
        //             '#fed976',
        //             0.52,
        //             '#feb24c',
        //             0.68,
        //             '#fd8d3c',
        //             0.84,
        //             '#fc4e2a',
        //             1,
        //             '#e31a1c'
        //         ],
        //     },
        //     'layout': {
        //         'line-cap': 'round',
        //         'line-join': 'round',
        //         'line-sort-key': ["get", "rate"]
        //     },
        //     'filter': ['!=', 'rate', 0]
        // },
        //     'road-base'
        //     );
        // map.on('click', 'roads', function (e) {
        //     const gid = e.features[0].properties.gid;
        //     map.setFilter('road-base', ['in', 'gid', gid]);
        //     $.ajax({
        //         type: "post",
        //         data: {
        //             gid: gid
        //         },
        //         url: "http://localhost:8080/querybuilding",
        //         cache: false,
        //         success: (bid)=>{
        //             map.setFilter('buildings2', ['in', ['get', 'OBJECTID'], ["literal", JSON.parse(bid)]]);
        //         },
        //         error: ()=>{
        //             alert("error")
        //         }
        //     });
        // })
    }

    changeInfoPanel = () => {
        this.props.changePanel(1);
    }

    removeDijk = () => {
        this.props.changePanel(0);
        const {map} = this.props;
        const geo = {
            'type': 'FeatureCollection',
            'features': []
        }
        map.getSource('roads').setData(geo);
    }

    render() {
        const left = this.props.x;
        const top = this.props.y;
        return (
            <div style={{position: "absolute", left: left, top: top}}>
                <Button type="primary" shape="round" size={'middle'} onClick={this.setTarget} style={{
                    backgroundColor: "rgb(230, 231, 236)",
                    color: "rgb(125, 133, 149)",
                    borderColor: "rgb(230, 231, 236)",
                    marginBottom: "2px"
                }}>
                    活动举办地
                </Button>
                <br/>
                <Button type="primary" shape="round" size={'middle'} onClick={this.changeInfoPanel} style={{
                    backgroundColor: "rgb(230, 231, 236)",
                    color: "rgb(125, 133, 149)",
                    borderColor: "rgb(230, 231, 236)",
                    marginBottom: "2px"
                }}>
                    查看信息
                </Button>
                <br/>
                <Button type="primary" shape="round" size={'middle'} onClick={this.removeDijk} style={{
                    backgroundColor: "rgb(230, 231, 236)",
                    color: "rgb(125, 133, 149)",
                    borderColor: "rgb(230, 231, 236)",
                    marginBottom: "2px"
                }}>
                    清除
                </Button>
            </div>
        )
    }
}

export default Butgroup;