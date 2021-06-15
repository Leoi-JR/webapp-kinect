import {connect} from 'react-redux';
import axios from 'axios';

import Map from '../components/map/Map';
import {
    createMap,
    updateGeoData,
    changeXY,
    showButton,
    removeButton,
    originXY,
    curBuild,
    curPanel
} from "../redux/actions";

const mapStateToProps = (state, ownProps) => {
    return {
        map: state.initMap,
        config: state.initConfig,
        geoData: state.updateGeoData,
        display: state.updateButState.display,
        objectid: state.updateButState.objectid,
        ox: state.updateButState.ox,
        oy: state.updateButState.oy,
        x: state.updateButState.x,
        y: state.updateButState.y,
    }
}


const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        createMap: (data) => dispatch(createMap(data)),
        updateGeoData: (data) => dispatch(updateGeoData(data)),
        showButton: (data) => dispatch(showButton(data)),
        removeButton: (data) => dispatch(removeButton(data)),
        changeXY: (data) => dispatch(changeXY(data)),
        originXY: (data) => dispatch(originXY(data)),
        updateBuild: (data) => dispatch(curBuild(data)),
        changePanel: (data) => dispatch(curPanel(data))
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);