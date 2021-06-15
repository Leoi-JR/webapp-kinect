import {connect} from 'react-redux';

import Receiver from '../components/receiver/Receiver';
import {changeXY, curEdge, curPanel, selectedDaoju, updateDijk} from "../redux/actions";

const mapStateToProps = (state, ownProps) => (
    {
        map: state.initMap,
        x: state.updateButState.x,
        y: state.updateButState.y,
        config: state.initConfig,
    }
)

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateDijk: (data) => dispatch(updateDijk(data)),
        changePanel: (data) => dispatch(curPanel(data)),
        changeEdge: (data) => dispatch(curEdge(data)),
        changeXY: (data) => dispatch(changeXY(data)),
        changeDaoju: (data) => dispatch(selectedDaoju(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Receiver)