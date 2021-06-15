import {connect} from 'react-redux';

import Sourcetop from "../components/sourcetop/Sourcetop";
import {curEdge, curPanel, selectedBuild} from "../redux/actions";


const mapStateToProps = (state, ownProps) => (
    {
        sourceinfo: state.updateSource,
        map: state.initMap,
        selectedBuild: state.changeSelectedBuild
    }
)

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changePanel: (data) => dispatch(curPanel(data)),
        changeEdge: (data) => dispatch(curEdge(data)),
        changeSelectedBuild: (data) => dispatch(selectedBuild(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sourcetop)