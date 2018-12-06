import {getUrl, getDetail} from '../services/example';

export default {
    namespace: 'play',
    state: {
        id: 0,
        url: '',
        info: {},
        detail: {},
        current: 0,
        playList: []
    },
    effects: {
        //获取一首歌曲的播放文件和详情
        * getUrl({payload}, {call, put}) {
            let res = yield call(getUrl, payload)
            console.log(payload, '...payload')
            console.log(res, 'urlList')
            let detail = yield call(getDetail, payload)
            let obj = {info: res.data.data[0]}
            obj.id = payload;
            obj.url = res.data.data[0].url;
            obj.detail = detail.data.songs[0]
            console.log(detail, 'detail')
            yield put({
                type: 'updateState',
                payload: obj
            })
        },

        //获取一组歌曲的播放文件和详情
        * getUrls({payload}, {call, put}) {
            let res = yield call(getUrl, payload.join(','));
            let details = yield call(getDetail, payload.join(','));
            res = res.data.data;
            details = details.data.songs;
            let playList = [];
            details.forEach(item=>{
                playList.push({
                    detail: item,
                    info: res.filter(val=>val.id==item.id)[0]
                })
            })
            yield put({
                type: 'updateState',
                payload: {playList}
            })
        }
    },

    reducers: {
        updateState(state, action){
            console.log(action, '...action')
            return {...state, ...action.payload}
        },
        changePlay(state, {payload}){
            let newState = {...state};
            if(payload == 'prev'){
                if(state.current == 0){
                    newState.current = state.playList.length-1;
                }else{
                    newState.current--;
                }
            } else {
                if(state.current == state.playList.length-1){
                    newState.current = 0;
                } else {
                    newState.current++;
                }
            }
            newState.id = state.playList[newState.current].info.id;
            newState.url = state.playList[newState.current].info.url;
            newState.info = state.playList[newState.current].info;
            newState.detail = state.playList[newState.current].detail;

            return newState;
        }
    }
}