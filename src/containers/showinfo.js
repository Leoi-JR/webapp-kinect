import {connect} from 'react-redux';

import Showinfo from "../components/showinfo/Showinfo";
import axios from "axios";
import {setConfigs, staticBuild} from "../redux/actions";
import $ from "jquery";

const mapStateToProps = (state, ownProps) => (
    {
        statisticbuild: state.staticBuild,
    }
)

const mapDispatchToProps = (dispatch, ownProps) => {
    return {}
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Showinfo)