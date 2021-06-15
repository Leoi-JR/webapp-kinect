import {connect} from 'react-redux';

import Butgroup from "../components/popupbut/Butgroup";
import {curEdge, curPanel, updateDijk} from "../redux/actions";

const mapStateToProps = (state) => {
    return {
        x: state.updateButState.x,
        y: state.updateButState.y,
        source: state.dijkstra.source,
        target: state.dijkstra.target,
        objectid: state.updateButState.objectid,
        map: state.initMap
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        // updateDijk: (data) => dispatch(updateDijk(data)),
        changePanel: (data) => dispatch(curPanel(data)),
        changeEdge: (data) => dispatch(curEdge(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Butgroup)