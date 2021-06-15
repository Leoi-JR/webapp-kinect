import {Component} from 'react';
import {Avatar, Col, Row} from "antd";
import {PropTypes} from 'prop-types';

class Buildinfo extends Component{
    static propTypes = {
        properties: PropTypes.object.isRequired,
    }

    constructor() {
        super();
    }

    render() {
        const colors = [
            '#fbb4ae',
            '#b3cde3',
            '#ccebc5',
            '#decbe4',
            '#fed9a6',
            '#ffffcc',
            '#e5d8bd',
            '#fddaec',
            '#f2f2f2'
        ]
        const pngs = {'NOWNAME': ['./png/jianzhu.png', '名称'], 'BLDG_USAGE': ['./png/yongtu.png', '用途'], 'BLDG_HEIGH': ['./png/colum-height.png', '楼高'], 'UP_BLDG_FL': ['./png/louceng.png', '楼层'], 'DOWN_BLDG_': ['./png/dixiashi.png', '地下层'], 'FLOOR_AREA': ['./png/zhandimianji.png', '面积']}
        const style = { padding: '28px 0', textAlign: 'center', borderRadius: '5px', fontSize: "24px", fontFamily:  "Times New Roman, Microsoft Yahei" };

        const {properties} = this.props;
        return (
            <div>
                <Row>
                    <Col style={{fontSize: "30px", padding: '10px 20px'}}>
                        详细信息：
                    </Col>
                </Row>
                <div style={{margin: '20px 10px 0px'}}>
                    <Row gutter={[2,32]}>
                        {Object.keys(pngs).map((key, i)=>
                            (
                                <Col className="gutter-row" span={12} key={i}>
                                    <Row style={{...style, backgroundColor: colors[i]}}>
                                        <Col className="gutter-row" span={12}>
                                            <Avatar size="large" src={pngs[key][0]} />
                                            &nbsp;{pngs[key][1]}
                                        </Col>
                                        <Col className="gutter-row" span={12}>
                                            {properties[key]}
                                        </Col>
                                    </Row>
                                </Col>
                            )
                        )}
                    </Row>
                </div>

            </div>

        )
    }
}

export default Buildinfo;