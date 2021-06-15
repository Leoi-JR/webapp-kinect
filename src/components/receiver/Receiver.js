import React from 'react';
import {PropTypes} from 'prop-types';
import WebSocket from 'react-websocket';
import $ from "jquery";
import {dijkstra} from "../../redux/reducers";

class Receiver extends React.Component {
    static propTypes = {
        map: PropTypes.object.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        config: PropTypes.object.isRequired,
        // updateDijk: PropTypes.func.isRequired,
        changePanel: PropTypes.func.isRequired,
        changeEdge: PropTypes.func.isRequired,
        changeDaoju: PropTypes.func.isRequired
    }

    constructor() {
        super();
        this.state = {
            building_ids: [],
            areaSelectGeojson: {
                'type': 'FeatureCollection',
                'features': []
            },
            areaBanGeojson: {
                'type': 'FeatureCollection',
                'features': []
            },
            roadGidList: [],  // 禁走道路
            areaGidList: [],  // 禁走区域
            dijkstraRes: {},
            guideRes: {}
        }
    }

    handleMessage = (msg) => {
        let {areaSelectGeojson, dijkstraRes, guideRes, building_ids} = this.state

        let areaSelectLinestring = {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        };

        let areaSelectPolygon = {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[]]
            }
        };

        let areaBanLinestring = {
            'type': 'Feature',
            'geometry': {
                'type': 'LineString',
                'coordinates': []
            }
        };

        let areaBanPolygon = {
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[]]
            }
        };

        const {map} = this.props;
        const res = JSON.parse(msg);
        if (res["type"] === "describe"){
            const type = res["data"];
            switch (type) {
                case "ban_people":
                    this.props.changeDaoju(1);
                    break;
                case "arrow":
                    this.props.changeDaoju(2);
                    break;
                case "flag":
                    this.props.changeDaoju(3);
                    break;
                case "traffic_cone":
                    this.props.changeDaoju(4);
                    break;
                case "thumbtack":
                    this.props.changeDaoju(5);
                    break;
                default:
                    this.props.changeDaoju(0);
            }
        }
        if (res["type"] === "pan") {
            const panx = res.data[0] * this.props.config.width*3;
            const pany = -res.data[1] * this.props.config.height*3;
            map.panBy([panx, pany])
            this.props.changeXY({x: this.props.x - panx, y: this.props.y - pany});
        }
        if (res["type"] === "zoom") {
            map.zoomTo(map.getZoom() + res["data"] * 10, {duration: 100})
        }
        if (res["type"] === "dijkstra") {
            this.onDijkstra(res, map);
            this.setState({dijkstraRes: res});
        }
        if (res["type"] === "clear_road") {
            this.props.changePanel(0);
            const geo = {
                'type': 'FeatureCollection',
                'features': []
            }
            map.getSource('roads').setData(geo);
            this.setState({dijkstraRes: {}});
        }
        if (res["type"] === "area_select") {
            this.onAreaSelect(res, map, areaSelectGeojson, areaSelectLinestring, areaSelectPolygon);
        }
        if (res["type"] === "ban_people") {
            this.onBanPeople(res, map)
            if(Object.keys(dijkstraRes).length > 0){
                this.onDijkstra(dijkstraRes, map);
            }
        }
        if (res["type"] === "ban_area") {
            this.onBanArea(res, map, areaBanLinestring, areaBanPolygon)
            if(Object.keys(dijkstraRes).length > 0){
                this.onDijkstra(dijkstraRes, map);
            }
            if(Object.keys(guideRes).length > 0 && building_ids.length !== 0){
                this.onGuide(res, map);
            }
        }
        if (res["type"] === "guide") {
            if(building_ids.length !== 0){
                this.onGuide(res, map);
                this.setState({guideRes: res})
            }
        }
        if(res["type"] === "clear_guide"){
            this.setState({guideRes: {}})
        }
    }

    updateMap = (geo) => {
        const {map} = this.props;
        map.getSource('roads').setData(geo);
    }

    onDijkstra = (res, map) => {
        const {x, y} = res["data"];
        const mapx = this.props.config.width - this.props.config.width * x - this.props.config.width * 0.65 * 0.005;
        const mapy = this.props.config.height * y - this.props.config.height * 0.12;
        const coord = map.unproject([mapx, mapy]);  // 返回的{lat: ..., lng: ...}
        $.ajax({
            type: "post",
            url: "http://localhost:8080/dijkstra2",
            data: {
                "coord": JSON.stringify(coord)
            },
            cache: false,
            success: (data) => {
                const res = JSON.parse(data);
                const {geojson, sum_top5_weight, sum_weight} = res;
                let edgeinfo = [];
                for (let i = 0; i < 5; i++) {
                    edgeinfo.push(geojson['features'][i]['properties']);
                }
                this.props.changeEdge({sum_top5_weight, sum_weight, edgeinfo})
                this.updateMap(geojson);
                this.props.changePanel(2);
            },
            error: () => {
                alert("error")
            }
        });
    }

    onAreaSelect = (res, map, areaSelectGeojson, areaSelectLinestring, areaSelectPolygon) => {

        const {x, y} = res["data"];

        if (x === -1000 && y === -1000) {
            areaSelectGeojson = {
                'type': 'FeatureCollection',
                'features': []
            }
            this.setState({
                areaSelectGeojson,
                building_ids: []
            })
        } else {
            const mapx = this.props.config.width - this.props.config.width * x - this.props.config.width * 0.65 * 0.005;
            const mapy = this.props.config.height * y - this.props.config.height * 0.12;
            const coord = map.unproject([mapx, mapy]);  // 返回的{lat: ..., lng: ...}
            const features = map.queryRenderedFeatures([[mapx - 5, mapy - 5], [mapx + 5, mapy + 5]], {
                layers: ['area-select-points']
            });

            // Remove the linestring from the group
            // So we can redraw it based on the points collection
            if (areaSelectGeojson.features.length > 1) {
                areaSelectGeojson.features.pop();
                areaSelectGeojson.features.pop();
            }

            // If a feature was clicked, remove it from the map
            if (features.length) {
                const id = features[0].properties.id;
                areaSelectGeojson.features = areaSelectGeojson.features.filter(function (point) {
                    return point.properties.id !== id;
                });
            } else {
                const point = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [coord.lng, coord.lat]
                    },
                    'properties': {
                        'id': String(new Date().getTime())
                    }
                };

                areaSelectGeojson.features.push(point);
            }
            this.setState({areaSelectGeojson})
        }

        if (areaSelectGeojson.features.length > 1) {
            areaSelectLinestring.geometry.coordinates = areaSelectGeojson.features.map(
                function (point) {
                    return point.geometry.coordinates;
                }
            );
            areaSelectLinestring.geometry.coordinates.push(areaSelectLinestring.geometry.coordinates[0])
            areaSelectPolygon.geometry.coordinates[0] = areaSelectGeojson.features.map(
                function (point) {
                    return point.geometry.coordinates;
                }
            );

            areaSelectGeojson.features.push(areaSelectLinestring);
            areaSelectGeojson.features.push(areaSelectPolygon);
        }

        map.getSource('areaSelectGeojson').setData(areaSelectGeojson);
        if (areaSelectGeojson.features.length > 4) {
            let region = [];
            for (let i = 0; i < areaSelectGeojson.features.length - 2; i++) {
                region.push(areaSelectGeojson.features[i].geometry.coordinates)
            }
            $.ajax(
                {
                    type: "post",
                    url: "http://localhost:8080/queryintersect",
                    data: {
                        "region": JSON.stringify(region),
                        "intersect_target": JSON.stringify("building_3857")
                    },
                    cache: false,
                    success: (data) => {
                        const ids = JSON.parse(data);
                        this.setState({
                            building_ids: ids
                        })
                        map.setFilter('buildings2', ['in', ['get', 'OBJECTID'], ["literal", ids]]);
                    },
                    error: () => {
                        alert("area select Receiver error")
                    }
                }
            )
        }else{
            map.setFilter('buildings2', ['in', 'null', '']);
        }
    }

    onBanPeople = (res, map) => {
        const {x, y} = res["data"];
        const {roadGidList} = this.state;
        if (x === -1000 && y === -1000) {
            if(roadGidList.length !== 0){
                $.ajax(
                    {
                        type: "post",
                        url: "http://localhost:8080/ban",
                        data: {
                            "is_ban": JSON.stringify(0),
                            "is_delete_all": JSON.stringify(true),
                            "gid_list": JSON.stringify(roadGidList)
                        },
                        cache: false,
                        success: (data) => {
                            console.log("ban people delete all success");
                            this.setState({roadGidList: []});
                        },
                        error: () => {
                            alert("ban people delete all error")
                        }
                    }
                )
            }
            //    所有路可通行

        } else {
            const mapx = this.props.config.width - this.props.config.width * x - this.props.config.width * 0.65 * 0.005;
            const mapy = this.props.config.height * y - this.props.config.height * 0.12;
            console.log(mapx, mapy)
            const coord = map.unproject([mapx, mapy]);  // 返回的{lat: ..., lng: ...}
            $.ajax(
                {
                    type: "post",
                    url: "http://localhost:8080/ban",
                    data: {
                        "point_list": JSON.stringify([coord]),
                        "is_ban": JSON.stringify(res["is_ban"]),
                        "is_delete_all": JSON.stringify(false)
                    },
                    cache: false,
                    success: (data) => {
                        console.log("ban peeople success");
                        const gids = JSON.parse(data);
                        if(gids.length === 0){
                        }else{
                            const gid_index = roadGidList.indexOf(gids[0])
                            if (gid_index > -1) {
                                roadGidList.splice(gid_index, 1)
                            } else {
                                roadGidList.push(gids[0]);
                                this.setState(roadGidList);
                            }
                        }
                    },
                    error: () => {
                        alert("ban people error")
                    }
                }
            )
        }
    }

    onBanArea = (res, map, areaBanLinestring, areaBanPolygon) => {

        let {areaBanGeojson, areaGidList} = this.state;
        const {x, y} = res["data"];
        if (x === -1000 && y === -1000) {
            if(areaGidList.length !== 0){
                areaBanGeojson = {
                    'type': 'FeatureCollection',
                    'features': []
                }
                this.setState({
                    areaBanGeojson,
                    areaGidList: []
                })
                $.ajax(
                    {
                        type: "post",
                        url: "http://localhost:8080/banarea",
                        data: {
                            "pre_gids": JSON.stringify(areaGidList),
                            "ban_gids": JSON.stringify([])
                        },
                        cache: false,
                        success: () => {
                            map.setFilter('road-ban', ['in', 'null', '']);
                        },
                        error: () => {
                            alert("ban area Receiver error 1")
                        }
                    }
                )
            }

        } else {
            const mapx = this.props.config.width - this.props.config.width * x - this.props.config.width * 0.65 * 0.005;
            const mapy = this.props.config.height * y - this.props.config.height * 0.12;
            const coord = map.unproject([mapx, mapy]);  // 返回的{lat: ..., lng: ...}
            const features = map.queryRenderedFeatures([[mapx - 5, mapy - 5], [mapx + 5, mapy + 5]], {
                layers: ['area-ban-points']
            });

            // Remove the linestring from the group
            // So we can redraw it based on the points collection
            if (areaBanGeojson.features.length > 1) {
                areaBanGeojson.features.pop();
                areaBanGeojson.features.pop();
            }

            // If a feature was clicked, remove it from the map
            if (features.length) {
                const id = features[0].properties.id;
                areaBanGeojson.features = areaBanGeojson.features.filter(function (point) {
                    return point.properties.id !== id;
                });
            } else {
                const point = {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [coord.lng, coord.lat]
                    },
                    'properties': {
                        'id': String(new Date().getTime())
                    }
                };

                areaBanGeojson.features.push(point);
            }
            this.setState({areaBanGeojson})
        }

        if (areaBanGeojson.features.length > 1) {
            areaBanLinestring.geometry.coordinates = areaBanGeojson.features.map(
                function (point) {
                    return point.geometry.coordinates;
                }
            );
            areaBanLinestring.geometry.coordinates.push(areaBanLinestring.geometry.coordinates[0])
            areaBanPolygon.geometry.coordinates[0] = areaBanGeojson.features.map(
                function (point) {
                    return point.geometry.coordinates;
                }
            );

            areaBanGeojson.features.push(areaBanLinestring);
            areaBanGeojson.features.push(areaBanPolygon);
        }

        map.getSource('areaBanGeojson').setData(areaBanGeojson);
        if (areaBanGeojson.features.length > 4) {
            let region = [];
            for (let i = 0; i < areaBanGeojson.features.length - 2; i++) {
                region.push(areaBanGeojson.features[i].geometry.coordinates)
            }
            $.ajax(
                {
                    type: "post",
                    url: "http://localhost:8080/queryintersect",
                    data: {
                        "region": JSON.stringify(region),
                        "intersect_target": JSON.stringify("szuroad3")
                    },
                    cache: false,
                    success: (data) => {
                        const gids = JSON.parse(data);
                        console.log(gids)
                        $.ajax(
                            {
                                type: "post",
                                url: "http://localhost:8080/banarea",
                                data: {
                                    "pre_gids": JSON.stringify(areaGidList),
                                    "ban_gids": JSON.stringify(gids)
                                },
                                cache: false,
                                success: () => {
                                    map.setFilter('road-ban', ['in', ['get', 'gid'], ["literal", gids]]);
                                    this.setState({areaGidList: gids})
                                },
                                error: () => {
                                    alert("Receiver error2")
                                }
                            }
                        )
                    },
                    error: () => {
                        alert("Receiver error3")
                    }
                }
            )
        }else{
            map.setFilter('road-ban', ['in', 'null', '']);
            if(areaGidList !== 0){
                $.ajax(
                    {
                        type: "post",
                        url: "http://localhost:8080/banarea",
                        data: {
                            "pre_gids": JSON.stringify(areaGidList),
                            "ban_gids": JSON.stringify([])
                        },
                        cache: false,
                        success: () => {
                            map.setFilter('road-ban', ['in', 'null', '']);
                        },
                        error: () => {
                            alert("ban area Receiver error 1")
                        }
                    }
                )
            }
        }
    }

    onGuide = (res, map) => {
        const {x, y} = res["data"];
        const {building_ids} = this.state;
        const mapx = this.props.config.width - this.props.config.width * x - this.props.config.width * 0.65 * 0.005;
        const mapy = this.props.config.height * y - this.props.config.height * 0.12;
        const coord = map.unproject([mapx, mapy]);  // 返回的{lat: ..., lng: ...}
        $.ajax({
            type: "post",
            url: "http://localhost:8080/updateroad",
            data: {
                "custom_id": JSON.stringify(building_ids),
                "way_point": JSON.stringify(coord.wrap())
            },
            cache: false,
            success: (data)=>{
                const res = JSON.parse(data);
                const {geojson, sum_top5_weight, sum_weight} = res;
                let edgeinfo = [];
                for(let i = 0; i < 5; i++){
                    edgeinfo.push(geojson['features'][i]['properties']);
                }

                this.props.changeEdge({sum_top5_weight, sum_weight, edgeinfo})
                this.updateMap(geojson);
                this.props.changePanel(2);
            },
            error: ()=>{
                alert("error")
            }
        })
    }

    render() {
        return (
            <div>
                <WebSocket url="ws://127.0.0.1:8080/sendcoord?id=web" onMessage={this.handleMessage}
                           ref={websocket => this.send = websocket}/>
            </div>
        );
    }
}

export default Receiver;