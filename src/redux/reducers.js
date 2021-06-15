import {combineReducers} from 'redux';

import {
    INITMAP,
    SET_JSON_CONFIG,
    UPDATE_GEO_DATA,
    REMOVE_BUTTON,
    SHOW_BUTTON,
    CHANGE_XY,
    ORIGIN_XY,
    UPDATE_DIJKSTRA,
    GET_BUILD,
    UPDATE_BUILD,
    CHANGE_PANEL,
    UPDATE_EDGE,
    UPDATE_SOURCE,
    UPDATE_SELECTED_BUILD,
    UPDATE_SELECTED_DAOJU
} from './action-types';

// 保存map对象
export function initMap(state = {}, action) {
    switch (action.type) {
        case INITMAP: {
            return action.data;
        }
        default:
            return state;
    }
}

// 地图初始化需要的token，经纬度，zoom等
export function initConfig(state = {}, action) {
    switch (action.type) {
        case SET_JSON_CONFIG:
            return action.data
        default:
            return state
    }
}

// 保存地图添加的地理数据
export function updateGeoData(state = {}, action) {
    switch (action.type) {
        case UPDATE_GEO_DATA:
            return {...state, ...action.data}
        default:
            return state
    }
}

export function updateButState(state = {ox: 0, oy: 0, x: 0, y: 0, display: false, objectid: -1}, action) {
    switch (action.type) {
        case SHOW_BUTTON:
            return {...state, ...action.data, display: true};
        case REMOVE_BUTTON:
            return {...state, ...action.data, display: false};
        case CHANGE_XY:
            return {...state, ...action.data};
        case ORIGIN_XY:
            return {...state, ...action.data};
        default:
            return state;
    }

}  // state:{x, y, display, objectid, ox, oy, x, y}

export function dijkstra(state = {source: [], target: []}, action) {
    switch (action.type) {
        case UPDATE_DIJKSTRA:
            return action.data;
        default:
            return state;
    }
}

export function staticBuild(state = {values: [], lables: []}, action) {
    switch (action.type) {
        case GET_BUILD:
            return action.data;
        default:
            return state;
    }
}

//切换成当前选择的建筑的信息
export function updateBuild(state = {}, action) {
    switch (action.type) {
        case UPDATE_BUILD:
            return action.data;
        default:
            return state;
    }
}

//更改信息面板需要展示的内容
export function changePanel(state = 0, action) {
    switch (action.type) {
        case CHANGE_PANEL:
            return action.data;
        default:
            return state;
    }
}

//记录前五条道路的信息  sum_top5_weight, sum_weight, edgeinfo
export function updateEdge(state = {}, action) {
    switch (action.type) {
        case UPDATE_EDGE:
            return action.data;
        default:
            return state;
    }
}

//记录前五建筑的信息  {gid, nowname, person}
export function updateSource(state = {}, action) {
    switch (action.type) {
        case UPDATE_SOURCE:
            return action.data;
        default:
            return state;
    }
}

//需要干预路径的建筑
export function changeSelectedBuild(state={ids: []}, action) {
    switch (action.type) {
        case UPDATE_SELECTED_BUILD:
            return action.data;
        default:
            return state;
    }
}

//道具描述
export function changeDaoju(state=0, action) {
    switch (action.type) {
        case UPDATE_SELECTED_DAOJU:
            return action.data;
        default:
            return state;
    }
}

export default combineReducers({
    initMap,
    initConfig,
    updateGeoData,
    updateButState,
    dijkstra,
    staticBuild,
    updateBuild,
    changePanel,
    updateEdge,
    updateSource,
    changeSelectedBuild,
    changeDaoju
});