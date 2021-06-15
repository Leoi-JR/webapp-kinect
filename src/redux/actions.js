import {
    INITMAP,
    SET_JSON_CONFIG,
    UPDATE_GEO_DATA,
    SHOW_BUTTON,
    REMOVE_BUTTON,
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

export const createMap = (data) => ({type:INITMAP, data});
export const setConfigs = (data) => ({type: SET_JSON_CONFIG, data});
export const updateGeoData = (data) => ({type: UPDATE_GEO_DATA, data});
export const showButton = (data) => ({type: SHOW_BUTTON, data});
export const removeButton = (data) => ({type: REMOVE_BUTTON, data});
export const changeXY = (data) => ({type: CHANGE_XY, data});
export const originXY = (data) => ({type: ORIGIN_XY, data});
export const updateDijk = (data) => ({type: UPDATE_DIJKSTRA, data});
export const staticBuild = (data) => ({type: GET_BUILD, data});
export const curBuild = (data) => ({type: UPDATE_BUILD, data});
export const curPanel = (data) => ({type: CHANGE_PANEL, data});
export const curEdge = (data) => ({type: UPDATE_EDGE, data});
export const curSource = (data) => ({type: UPDATE_SOURCE, data});
export const selectedBuild = (data) => ({type: UPDATE_SELECTED_BUILD, data});
export const selectedDaoju = (data) => ({type: UPDATE_SELECTED_DAOJU, data});