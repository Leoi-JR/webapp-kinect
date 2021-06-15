import {connect} from "react-redux";
import Heatmap from "../components/heatmap/Heatmap";
import {updateDijk} from "../redux/actions";

const mapStateToProps = (state, ownProps) => ({
    source: state.dijkstra.source,
    target: state.dijkstra.target,
    map: state.initMap
})

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateDijk: (data) => dispatch(updateDijk(data))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Heatmap)