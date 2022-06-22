import styled from 'styled-components';
import style from '../../assets/global-style';

// props中的globalRank和tracks,length均代表是否为全球榜
export const Container = styled.div`
  position: fixed;
  top: 90px;
  /* 解决mini播放器出现后底部内容被遮挡，判断playList长度，如果大于0则正在播放，等于0则没有播放 */
  bottom: ${props => props.play > 0 ? "60px" : 0};
  width: 100%;
  .offical,.global {
    margin: 10px 5px;
    padding-top: 15px;
    font-weight: 700;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc"]};
  }
`

export const List = styled.ul`
  margin-top: 10px;
  padding: 0 5px;
  display: ${props => props.globalRank ? "flex" : ""};
  flex-direction: row; // 水平排列 起点在左边
  justify-content: space-between; // 均分 项目两侧等距
  flex-wrap: wrap;
  background: ${style["background-color"]};
  &::after {
    content: "";
    display: block;
    width: 32vw; // vw 视窗宽度的百分比
  }
`
export const ListItem = styled.li`
  display: ${props => props.tracks.length ? "flex" : ""};
  padding: 3px 0;
  border-bottom: 1px solid ${style["border-color"]};
  .img_wrapper {
    width: ${props => props.tracks.length ? "27vw" : "32vw"};
    height: ${props => props.tracks.length ? "27vw" : "32vw"};
    border-radius: 3px;
    position: relative;
    .decorate {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 35px;
      border-radius: 3px;
      background: linear-gradient(hsla(0,0%,100%,0),hsla(0,0%,43%,.4));
    }
    img {
      width: 100%;
      height: 100%;
      border-radius: 3px;
    }
    .update_frequecy {
      position: absolute;
      left: 7px;
      bottom: 7px;
      font-size: ${style["font-size-ss"]};
      color: ${style["font-color-light"]};
    }
  }
`

export const SongList = styled.ul`
  flex: 1; // 平分空间
  display: flex;
  flex-direction: column; // 垂直排列
  justify-content: space-around; // 均分，左右两边等距
  padding: 10px 10px;
  >li {
    font-size: ${style["font-size-s"]};
    color: grey;
  }
`