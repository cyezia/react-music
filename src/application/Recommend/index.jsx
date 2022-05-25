import React, { useEffect } from 'react';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll/index';
import { Content } from './style';
import * as actionTypes from './store/actionCreators'; 
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

// 推荐组件
function Recommend(props) {

  // mock数据
  // 轮播图
  // const bannerList = [1,2,3,4].map (item => {
  //   return { imageUrl: "http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg"}
  // });
  // // 推荐列表
  // const recommendList = [1,2,3,4,5,6,7,8,9,10].map(item => {
  //   return {
  //     id: 1,
  //     picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
  //     playCount: 17171122, // 播放量
  //     name: "朴树、许巍、李健、郑钧、老狼、赵雷"
  //   }
  // });

  const { bannerList, recommendList } = props;
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

  useEffect(() => {
    // 如果页面有数据则不发请求
    // immutable数据结构中长度属性siza
    if(!bannerList.size){
      getBannerDataDispatch();
    }
    if(!recommendList.size){
      getRecommendListDataDispatch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];


  return (
    // 加入外部容器content 引入滚动条组件
    <Content>
      <Scroll className="list">
        <div>
          {/* <Slider bannerList={bannerList}></Slider> */}
          <Slider bannerList={bannerListJS}></Slider>
          {/* <RecommendList recommendList={recommendList}></RecommendList> */}
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      { renderRoutes(props.route.routes) }
    </Content>
  );
}

// 映射redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList'])
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    },
  }
};

// export default React.memo(Recommend);
// 将UI组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));