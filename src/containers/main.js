import {connect} from 'react-redux';
import axios from 'axios';
import $ from 'jquery';

import Main from '../components/main/Main';
import {setConfigs, staticBuild} from '../redux/actions';

const mapStateToProps = (state, ownProps) => (
    {
        map: state.initMap,
        config: state.initConfig,
        display: state.updateButState.display,
        curpanel: state.changePanel,
        curdaoju: state.changeDaoju
    }
)

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getConfig: () => {
            axios.get('./static/setting.json').then((res) => {
                    dispatch(setConfigs(res.data.initSetting))
                }
            )
        },
        // 获取建筑分类信息给信息面板展示
        staticBuild: () => {
            $.get({
                    url: "http://localhost:8080/staticbuild",
                    cache: false,
                    success: (data) => {
                        dispatch(staticBuild(JSON.parse(data)));
                    },
                    error: () => {
                        alert("error")
                    }
                }
            )
        }
    }
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Main);
