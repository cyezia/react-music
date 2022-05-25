// 存放不同的action
import { CHANGE_SINGER_LIST, CHANGE_PAGE_COUNT, CHANGE_ENTER_LOADING } from './constants';
import { fromJS } from 'immutable';
import { getHotSingerListRequest, getSingerListRequest } from '../../../api/request';

const changeSingerList = (data) => ({
  type: CHANGE_SINGER_LIST,
  data: fromJS(data)
});

const changePageCount = (data) => ({
  type: CHANGE_PAGE_COUNT,
  data
});

const changeEnterLoading = (data) => ({
  type: CHANGE_ENTER_LOADING,
  data
});

export const getHotSingerList = () => {
  return(dispatch) => {
    getHotSingerListRequest(0).then(res => {
      const data = res.artists;
      dispatch(changeSingerList(data));
      dispatch(changeEnterLoading(false));
    }).catch(() => {
      console.log("热门歌手获取失败");
    })
  }
};