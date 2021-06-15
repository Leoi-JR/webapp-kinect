import {connect} from 'react-redux';

import Edgetop from "../components/edgetop/Edgetop";
import {curPanel, curSource} from "../redux/actions";
import {PropTypes} from "prop-types";

const mapStateToProps = (state, ownProps) => (
    {
        edgeinfo: state.updateEdge
    }
)

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        changeSource: (data) => dispatch(curSource(data)),
        changePanel: (data) => dispatch(curPanel(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Edgetop)