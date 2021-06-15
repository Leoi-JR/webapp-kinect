import {connect} from 'react-redux';

import Buildinfo from "../components/buildinfo/Buildinfo";

const mapStateToProps = (state) => {
    return {
        properties: state.updateBuild,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Buildinfo)