import React from 'react';
import {connect} from 'dva';
import styles from './playPage.scss'
import { formatTime } from '../utils/index';

@connect(({play}) => {
    return play
}, dispatch=> {
    return {
        getUrl: id=>{
            dispatch({
                type: 'play/getUrl',
                payload: id
            })
        },
        changePlay: payload=>{
            dispatch({
                type: 'play/changePlay',
                payload
            })
        }
    }
})

class Play extends React.PureComponent{
    constructor(props) {
        super(props)
        this.state = {
            progress: 0,
            isPlay: true
        }
    }
    componentDidMount() {
        let id = this.props.match.params.id;
        this.props.getUrl(id)
    }
    //播放进度更新触发的钩子函数
    timeUpdate() {
        let progress = this.refs.audio.currentTime/this.refs.audio.duration*100;
        this.setState({
            progress
        })
    }

    //获取总时长
    get duration() {
        if(this.refs.audio && this.refs.audio.duration) {
            return formatTime(this.refs.audio.duration)
        }
        return '00:00'
    }
    //当前播放时间
    get currentTime() {
        if(this.refs.audio && this.refs.audio.currentTime) {
            return formatTime(this.refs.audio.currentTime)
        }
        return '00:00'
    }

    //播放/暂停
    changeState() {
        this.setState({
            isPlay: !this.state.isPlay
        }, () => {
            this.state.isPlay?this.refs.audio.play():this.refs.audio.pause()
        })
    }
    //触摸进度条事件
    touchStart() {
        this.setState({
            isPlay: false
        }, () => {
            this.refs.audio.pause()
        })
    }
    touchMove(e) {
        console.log('触摸', e.touches)
        let touch = e.touches[0],
            progressEle = this.refs.progress;
        let progress = (touch.pageX - progressEle.offsetLeft)/progressEle.offsetWidth;
        if(progress>1) {
            progress = 1;
        }
        if(progress<0) {
            progress = 0;
        }
        this.setState({
            progress: progress*100
        }, () => {
            this.refs.audio.currentTime = progress*this.refs.audio.duration
        })

    }
    touchEnd() {
        this.setState({
            isPlay: true
        }, () => {
            this.refs.audio.play()
        })
    }

    //切换歌曲
    changePlay(type){
        this.props.changePlay(type)
    }
  render(){
      console.log(this.props, 'props-play.....')
    if(!Object.keys(this.props.detail).length) {
        return null
    }
    return <div className={styles.playPages}>
        <h1>播放歌曲页面</h1>
        <div>
            <div className={styles.top}>
                <img className={styles.picUrl} src={this.props.detail.al.picUrl}/> 
                <div className={styles.tit}>
                    <h3 className={styles.songName}>{this.props.detail.name}</h3>
                    <h6>{this.props.detail.al.name}</h6>
                    <h6>{this.props.detail.alia[0]}</h6>
                </div>
            </div>
            <div className={styles.bottom}>
                <span>{this.currentTime}</span>
                <div className={styles.progress}
                    onTouchStart={this.touchStart.bind(this)}
                    onTouchMove={this.touchMove.bind(this)}
                    onTouchEnd={this.touchEnd.bind(this)}
                >
                    <p ref="progress">
                        <span style={{width:this.state.progress+'%'}}></span>
                    </p>
                </div>
                <span>{this.duration}</span>
            </div>
            <div>
                <button onClick={() => this.changePlay('prev')}>上一曲</button>
                <button onClick={this.changeState.bind(this)}>{this.state.isPlay?'暂停':'播放'}</button>
                <button onClick={() => this.changePlay('next')}>下一曲</button>
            </div>
        </div>
        {
            this.props.url?<audio src={this.props.url} autoPlay ref="audio" onTimeUpdate={() => this.timeUpdate()}></audio>:null
        }
    </div>
  }
}


export default Play;
