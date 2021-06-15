import React from 'react';
import mapboxgl from 'mapbox-gl';
import {PropTypes} from 'prop-types';
import $ from "jquery";

import "./Map.css";


export default class Map extends React.Component {
    static propTypes = {
        map: PropTypes.object.isRequired,
        geoData: PropTypes.object.isRequired,
        config: PropTypes.object.isRequired,
        display: PropTypes.bool.isRequired,
        objectid: PropTypes.number.isRequired,
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        ox: PropTypes.number.isRequired,
        oy: PropTypes.number.isRequired,
        showButton: PropTypes.func.isRequired,
        removeButton: PropTypes.func.isRequired,
        changeXY: PropTypes.func.isRequired,
        originXY: PropTypes.func.isRequired,
        createMap: PropTypes.func.isRequired,
        updateGeoData: PropTypes.func.isRequired,
        updateBuild: PropTypes.func.isRequired,
        changePanel: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const t = this;
        if (Object.keys(this.props.config).length !== 0) {
            // const blankStyle = {
            //     version: 8,
            //     name: "BlankMap",
            //     sources: {},
            //     layers: [
            //         {
            //             id: 'background',
            //             type: 'background',
            //             paint: { 'background-color': '#fff' } /* 背景颜色 */
            //         }
            //     ]
            // };
            const map = new mapboxgl.Map({
                container: this.mapContainer,
                style: this.props.config.style,
                center: [this.props.config.lng, this.props.config.lat],
                zoom: this.props.config.zoom,
                accessToken: this.props.config.accessToken
            });
            map.on("load", () => {
                    fetch("./data/building2.geojson")
                        .then(res => res.json())
                        .then(
                            (result) => {
                                this.props.updateGeoData({'building': result});

                                map.addSource('buildings', {'type': 'geojson', 'data': result});
                                map.addSource('roads', {
                                    'type': 'geojson', 'data': {
                                        'type': 'FeatureCollection',
                                        'features': []
                                    }
                                })
                                map.addLayer({
                                    'id': 'buildings-shadow',
                                    'type': 'fill',
                                    'source': 'buildings',
                                    'paint': {
                                        'fill-color': 'rgba(136, 175, 248, 0.3)',
                                        'fill-outline-color': 'rgba(0, 0, 0, 0.3)',
                                    }
                                });
                                map.addLayer({
                                    'id': 'buildings',
                                    'type': 'fill',
                                    'source': 'buildings',
                                    'paint': {
                                        'fill-color': '#88aff8',
                                        'fill-outline-color': 'rgba(0, 0, 0, 0)',
                                    },
                                    'filter': ['in', 'null', '']
                                });

                                map.addLayer({
                                    'id': 'buildings2',
                                    'type': 'fill',
                                    'source': 'buildings',
                                    'paint': {
                                        'fill-color': 'rgba(84,39,143,0.6)',
                                        'fill-outline-color': 'rgba(0, 0, 0, 0)',
                                    },
                                    'filter': ['in', 'null', '']
                                });

                                $.ajax({
                                    type: "get",
                                    url: "http://localhost:8080/roads",
                                    cache: false,
                                    success: (geo) => {
                                        map.addSource('road-base', {'type': 'geojson', 'data': JSON.parse(geo)});
                                        map.addLayer({
                                            'id': 'road-base',
                                            'type': 'line',
                                            'source': 'road-base',
                                            'paint': {
                                                'line-color': 'rgb(167,0,0)',
                                                'line-gap-width': 9,
                                            },
                                            'layout': {
                                                'line-cap': 'round',
                                                'line-join': 'round',
                                            },
                                            'filter': ['in', 'null', '']
                                        });
                                        map.addLayer({
                                            'id': 'road-ban',
                                            'type': 'line',
                                            'source': 'road-base',
                                            'paint': {
                                                'line-color': 'rgba(76,71,71,0.75)',
                                                'line-width': 9,
                                            },
                                            'layout': {
                                                'line-cap': 'round',
                                                'line-join': 'round',
                                            },
                                            'filter': ['in', 'null', '']
                                        });
                                        map.addLayer({
                                                'id': 'roads',
                                                'type': 'line',
                                                'source': 'roads',
                                                'paint': {
                                                    'line-width': 8,
                                                    'line-color': [
                                                        "interpolate",
                                                        ["linear"],
                                                        ["get", "rate"],
                                                        0,
                                                        '#fed976',
                                                        0.16,
                                                        '#feb24c',
                                                        0.33,
                                                        '#fd8d3c',
                                                        0.52,
                                                        '#fc4e2a',
                                                        0.68,
                                                        '#e31a1c',
                                                        0.84,
                                                        '#bd0026',
                                                        1,
                                                        '#800026'
                                                    ],
                                                },
                                                'layout': {
                                                    'line-cap': 'round',
                                                    'line-join': 'round',
                                                    'line-sort-key': ["get", "rate"]
                                                },
                                                'filter': ['!=', 'rate', 0]
                                            },
                                            'road-base'
                                        );
                                    },
                                    error: () => {
                                        alert("error")
                                    }
                                });

                                map.on('click', 'buildings-shadow', function (e) {
                                    // console.log("click", e)
                                    // map.getCanvas().style.cursor = 'pointer';
                                    const feature = e.features[0];
                                    // console.log(map.queryRenderedFeatures(e.point, {layers: ['buildings-shadow']}))
                                    t.props.updateBuild(feature.properties);
                                    const state = {
                                        x: e.point.x + 2,
                                        y: e.point.y + 2,
                                        objectid: feature.properties.OBJECTID
                                    }

                                    let third_param;
                                    if (t.props.objectid === feature.properties.OBJECTID) {
                                        if (t.props.display) {
                                            t.props.removeButton(state);
                                            third_param = '';
                                            t.props.changePanel(0);
                                        } else {
                                            t.props.showButton(state);
                                            third_param = feature.properties.OBJECTID;
                                            t.props.changePanel(1);
                                        }
                                    } else {
                                        t.props.showButton(state);
                                        t.props.changePanel(1);
                                        third_param = feature.properties.OBJECTID;
                                    }
                                    map.setFilter('buildings', ['in', 'OBJECTID', third_param]);
                                });

                                map.on("mousedown", function (e) {
                                    // console.log("down", e)
                                    t.props.originXY({ox: e.point.x, oy: e.point.y + 80});
                                    // console.log(e.point)
                                    // t.props.changeXY({...e.point});
                                })
                                map.on("drag", function (e) {
                                    // console.log("move", e)
                                    const {clientX, clientY} = e.originalEvent;
                                    t.props.changeXY({
                                        x: clientX - t.props.ox + t.props.x,
                                        y: clientY - t.props.oy + t.props.y
                                    });
                                    t.props.originXY({ox: clientX, oy: clientY});
                                    // t.props.changeXY({...e.point});
                                })

                                // Change it back to a pointer when it leaves.
                                // map.on('mouseleave', 'buildings', function () {
                                //     map.getCanvas().style.cursor = '';
                                //     map.setFilter('buildings', ['in', 'OBJECTID', '']);
                                // });
                                this.props.createMap(map);
                            },
                            (error) => {
                                alert("error!");
                            });
                    map.addSource('areaSelectGeojson', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': []
                        }
                    });
                    map.addLayer({
                        id: 'area-select-points',
                        type: 'circle',
                        source: 'areaSelectGeojson',
                        paint: {
                            'circle-radius': 2,
                            'circle-color': '#ff6700'
                        },
                        filter: ['in', '$type', 'Point']
                    });
                    map.addLayer({
                        id: 'area-select-lines',
                        type: 'line',
                        source: 'areaSelectGeojson',
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        paint: {
                            'line-color': 'rgba(0,0,0,0.32)',
                            'line-width': 1
                        },
                        filter: ['in', '$type', 'LineString']
                    });
                    map.addLayer({
                        id: 'area-select-polygon',
                        type: 'fill',
                        source: 'areaSelectGeojson',
                        layout: {},
                        paint: {
                            'fill-color': '#000000',
                            'fill-opacity': 0.1
                        },
                        filter: ['in', '$type', 'Polygon']
                    });
                    map.addSource('areaBanGeojson', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': []
                        }
                    });
                    map.addLayer({
                        id: 'area-ban-points',
                        type: 'circle',
                        source: 'areaBanGeojson',
                        paint: {
                            'circle-radius': 2,
                            'circle-color': '#082492'
                        },
                        filter: ['in', '$type', 'Point']
                    });
                    map.addLayer({
                        id: 'area-ban-lines',
                        type: 'line',
                        source: 'areaBanGeojson',
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        paint: {
                            'line-color': 'rgba(0,0,0,0.31)',
                            'line-width': 1
                        },
                        filter: ['in', '$type', 'LineString']
                    });
                    map.addLayer({
                        id: 'area-ban-polygon',
                        type: 'fill',
                        source: 'areaBanGeojson',
                        layout: {},
                        paint: {
                            'fill-color': '#cb2323',
                            'fill-opacity': 0.1
                        },
                        filter: ['in', '$type', 'Polygon']
                    });
                }
            )

        }

    }

    render() {
        return (
            <div>
                <div ref={el => this.mapContainer = el} className="mapContainer"/>
            </div>
        )
    }
}
