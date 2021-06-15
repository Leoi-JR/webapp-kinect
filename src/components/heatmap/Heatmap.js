import React from 'react';
import {PropTypes} from 'prop-types';
import axios from 'axios';

export default class Heatmap extends React.Component{
    static propTypes = {
        source: PropTypes.array.isRequired,
        target: PropTypes.array.isRequired,
        map: PropTypes.object.isRequired
    }
    constructor(props){
        super(props);
    }

    getSource=(e)=>{
        let {source} = this.state;
        source.push(e.lngLat.wrap());
        this.setState(
            {source}
        )
    }

    getTarget=(e)=>{
        let {target} = this.state;
        target.push(e.lngLat.wrap());
        this.setState(
            {target}
        )
    }

    bindSource = ()=>{
        this.setState({
            source:[]
        })
        this.props.map.off('click', this.getTarget)
        this.props.map.on('click', this.getSource)
    }

    bindTarget = ()=>{
        this.setState({
            target:[]
        })
        this.props.map.off('click', this.getSource)
        this.props.map.on('click', this.getTarget)
    }

    removeCoords= ()=>{
        const {source, target} = this.state;

        this.props.map.off('click', this.getTarget)
        this.props.map.off('click', this.getSource)
        console.log(this.state.source, this.state.target)

        axios.post("http://localhost:8080/dijkstra",
            {
                source: JSON.stringify(source),
                target: JSON.stringify(target)
            }).then(function (res) {
            this.updateMap(res);
        }).catch(function (error) {
            console.log(error);
        });
    }

    updateMap=(geo)=>{
        const {map} = this.props;
        if(typeof(map.getSource("roads")) == "undefined"){
        }
        else{
            map.removeLayer("roads");
            map.removeSource("roads");
        }

        map.addSource('roads', { 'type': 'geojson', 'data': JSON.parse(geo)});
        map.addLayer({
            'id': 'roads',
            'type': 'line',
            'source': 'roads',
            'paint': {
                'line-width': 8,
                'line-color': [
                    "interpolate",
                    ["linear"],
                    ["get", "count"],
                    0,
                    'cyan',
                    0.33,
                    'lime',
                    0.37,
                    'yellow',
                    1,
                    'red'
                ],
                'line-opacity':[
                    "case",
                    ["==", ["get", "count"], 0], 0,
                    1
                ]
            },
            'layout': {
                'line-cap': 'round',
                'line-join': 'round'
            }
        });
    }

    render(){
        return (
            <div>
                <button onClick={this.bindSource}>source</button>
                <button onClick={this.bindTarget}>target</button>
                <button onClick={this.removeCoords}>submit</button>
            </div>
        )
    }
}