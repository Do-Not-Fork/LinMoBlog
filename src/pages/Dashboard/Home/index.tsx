import {Calendar, CalendarProps, Card, ConfigProvider, Progress, Space, theme} from "antd";
import './index.sass';
import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import dayjs, {Dayjs} from "dayjs";
import 'dayjs/locale/zh-cn';
import zhCN from "antd/lib/locale/zh_CN";
import ArticleRecord from "../../../components/articleRecord";
import TheYearPass from "../../../components/theYearPass";
import ArticleAnalytics from "../../../components/articleAnalytics";
import WordCloud from "../../../components/wordCloud";
import avator from '../../../assets/avator.jpg'
import Typed from 'typed.js';
import MainContext from "../../../components/conText.tsx";
const Home = () => {
    const [ip,setIp] = useState('')
    const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
        console.log(value.format('YYYY-MM-DD'), mode);
    };
    dayjs.locale('zh-cn');
    const [oneSay, setOneSay] = useState('');
    const { token } = theme.useToken();

    const wrapperStyle: React.CSSProperties = {
        width: 350,
        position: "absolute",
        right: "0",
        bottom: "120px",
        margin: "30px",
        border: "none",
        borderRadius: token.borderRadiusLG,
    };

    const typedRef = useRef(null);

    useEffect(() => {
        const getSay = async () => {
            const res = await axios.get('https://zj.v.api.aa1.cn/api/wenan-zl/?type=json');
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const myIP = data.ip;
            setIp(myIP)
            setOneSay(res.data.msg);
        };
        getSay();

        const options = {
            strings: ['"遇事不决，可问春风“'],  // 使用获取到的数据作为字符串
            typeSpeed: 50,
            backSpeed: 30,
        };

        const typedInstance = new Typed(typedRef.current, options);
        return () => {
            typedInstance.destroy();
        };
    }, []);

    const isDark = JSON.parse(useContext(MainContext))
        return (
        <div className="home">
            <div className="about_logo">
                <div className="about_me">
                    <img src={avator} alt=""  style={{width:75,height:75,borderRadius: '50%',border: '2px solid #b7b7b7'}}/>
                    <div ref={typedRef} className="typed"></div>
                </div>
                <Space wrap style={{marginTop: 20}}>
                    <Progress type="circle" percent={70} size={65} format={() => <span style={{color:isDark?"white":'black'}}>CPU</span>}/>
                    <Progress type="circle" percent={50} size={65} format={() => <span style={{color:isDark?"white":'black'}}>内存</span>} />
                    <Progress type="circle" percent={70} size={65} format={() => <span style={{color:isDark?"white":'black'}}>磁盘</span>} />
                </Space>
            </div>
            <ArticleAnalytics />
            <ArticleRecord isDark={isDark}/>
            <WordCloud />
            <Card size="small" title={
                <div className="custom-card-header">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                    每日箴言
                </div>
            } style={{minWidth: 350, height: 200}}>
                <div className="oneSay">
                    <span className="stick">📌</span>
                    <p className="onesay_content">{oneSay}</p>
                </div>
            </Card>

            <ConfigProvider locale={zhCN}>
                <div style={wrapperStyle}>
                    <TheYearPass/>
                    <Calendar fullscreen={false} onPanelChange={onPanelChange}/>
                </div>
            </ConfigProvider>

            <Card className="cardInfo">
                <h3>信息</h3>
                <p>ip: {ip}</p>
                <p>已不间断运行： 320小时</p>
            </Card>
        </div>
    );

};

export default Home;
