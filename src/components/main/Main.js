import React from 'react';
import {PropTypes} from 'prop-types';

import Map from '../../containers/map';
import Receiver from '../../containers/receiver';
import Butgroup from '../../containers/butgroup';
import Showinfo from "../../containers/showinfo";
import './Main.css';
import Avatar from "antd/es/avatar";
import Buildinfo from "../../containers/buildinfo";
import Edgetop from "../../containers/edgetop";
import Sourcetop from "../../containers/sourcetop";

class Main extends React.Component{
    static propTypes = {
        map: PropTypes.object.isRequired,
        config: PropTypes.object.isRequired,
        getConfig: PropTypes.func.isRequired,
        display:PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props);
        props.getConfig();
        props.staticBuild();
    }


    render() {
        const configLoaded = Object.keys(this.props.config).length !== 0;
        const mapLoaded = Object.keys(this.props.map).length !== 0;
        // const display = this.props.display;
        const display = false;
        const {curpanel, map, curdaoju} = this.props;
        let panel;
        switch (curpanel) {
            case 0:
                mapLoaded && map.setFilter('buildings2', ['in', 'OBJECTID', '']);
                panel = mapLoaded && <Showinfo />;
                break;
            case 1:
                map.setFilter('buildings2', ['in', 'OBJECTID', '']);
                panel = <Buildinfo />;
                break;
            case 2:
                map.setFilter('buildings2', ['in', 'OBJECTID', '']);
                panel = <Edgetop />;
                break;
            case 3:
                panel = <Sourcetop />;
                break;
            default:
                map.setFilter('buildings2', ['in', 'OBJECTID', '']);
                panel = mapLoaded && <Showinfo />;
        }
        let describe;
        switch (curdaoju){
            case 0:
                describe = "";
                break;
            case 1:
                describe = "与该道具相交的路段禁止通行";
                break;
            case 2:
                describe = "将人流引导至与箭头相邻的节点";
                break;
            case 3:
                describe = "将道具所在地设置成活动举办地";
                break;
            case 4:
                describe = "该道具围成的区域禁止通行";
                break;
            case 5:
                describe = "该道具包围的建筑楼，其内部人员的走向将受引导道具影响";
                break;
            default:
                describe = "0";
        }
        return (
            <div>
                <div id="headtop">
                    <div id={"title"}>
                        <div>
                            <Avatar src={'./png/logo.png'} size='large'/>
                            &nbsp;交互式数字沙盘可视化系统
                        </div>

                        <div id="brief">
                            &nbsp;&nbsp;&nbsp;&nbsp;该系统基于深度学习算法，构建“传感器输入－智能计算终端－可视化输出”的数字沙盘计算模型，结合校园活动热力模拟模型完成支持多人协作、多道具的交互式智慧校园沙盘决策平台的构建。
                        </div>
                    </div>

                    <div id={"logo"}>
                        <img alt={"GIE_logo"} src={'./png/GIE_logo.png'} style={{"height": "120px"}}/>
                    </div>
                </div>
                <div id="left">
                    {configLoaded && <Map />}
                    {mapLoaded && <Receiver />}
                    {display && <Butgroup />}
                </div>
                {/*<div id="heatmap">*/}
                {/*    /!*{!mapIsNull && <Heatmap map={map} />}*!/*/}
                {/*    该系统以深度学习为驱动，构建“传感器输入－智能计算终端－可视化输出”的数字沙盘计算模型，是可支持多人协作、多道具的交互式智慧校园沙盘决策平台。*/}
                {/*</div>*/}
                <div id="topright">
                     {/*{mapLoaded && <Showinfo />}*/}
                    {panel}
                </div>
                <div id="middleright">
                    <div className="mr-sub">
                        道具识别区
                    </div>
                    <div className="mr-sub">
                        道具说明
                        <div id="describe">
                            {describe}
                        </div>
                    </div>
                </div>
                <div id="bottomright">
                    <div id="br-sub1">
                        道具存放区
                    </div>
                </div>
            </div>
        )
    }
}

export default Main;