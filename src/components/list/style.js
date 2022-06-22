import styled from 'styled-components';
import style from '../../assets/global-style';

export const ListWrapper = styled.div`
  max-width: 100%;

  // 推荐歌单
  .title {
    font-weight: 700; // 字体加粗
    padding-left: 6px;
    font-size: 14px;
    line-height: 60px;
  }
`;

export const List = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row; // 主轴为水平方向排列，起点在左边
  flex-wrap: wrap; // 主轴总尺寸超出容器时换行，第一行在上方
  justify-content: space-around; // 每个项目两侧间隔相等，所有项目之间的间隔比项目边缘的大一倍
`;

export const ListItem = styled.div`
  position: relative;
  width: 32%;

  // 图片容器
  .img_wrapper {
    .decorate {
      position: absolute;
      top: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      // 设置渐变
      background: linear-gradient(hsla(0, 0%, 43%, .4), hsla(0, 0%, 100%, 0));
    }
    position: relative;
    /* 给图片一个占位高度（图片加载时需要占位，否则better-scroll无法正确获取子元素的高度，导致content的判定高度小于wrapper） */
    height: 0;
    padding-bottom: 100%;

    // 播放量
    .play_count {
      position: absolute;
      z-index: 99; // 提高播放量的层级
      right: 2px;
      top: 2px;
      font-size: ${style["font-size-s"]};
      line-height: 15px;
      color: ${style["font-color-light"]};
      .play {
        vertical-align: top;
      }
    }

    // 图片样式
    img {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
  }

  // 列表文字样式
  .desc {
    overflow: hidden;
    margin-top: 2px;
    padding: 0 2px;
    height: 50px;
    text-align: left;
    font-size: ${style["font-size-s"]};
    line-height: 1.4;
    color: ${style["font-color-desc"]};
  }
`;