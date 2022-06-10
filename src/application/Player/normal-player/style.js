import styled, { keyframes } from "styled-components";
import style from '../../../assets/global-style';
import disc from './disc.png';
import needle from './needle.png';

const rotate = keyframes`
  0%{
    transform: rotate(0);
  }
  100%{
    transform: rotate(360deg);
  }
`

export const NormalPlayerContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 150;
  background: ${style["background-color"]};
  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
    &.layer {
      background: ${style["font-color-desc"]};
      opacity: 0.3;
      filter: none;
    }
  }
  &.normal-enter,
  &.normal-exit-done {
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
  &.normal-enter-active,
  &.normal-exit-active {
    .top,
    .bottom {
      transform: translate3d(0, 0, 0);
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32); // 缓动动画效果
    }
    opacity: 1;
    transition: all 0.4s;
  }
  &.normal-exit-active {
    opacity: 0;
  }
`

export const Top = styled.div`
  box-sizing: border-box;
  position: absolute;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid ${style["border-color-v2"]};
  padding-bottom: 5px;
  width: 100%;
  height: 8%;
  .back {
    margin-left: 5px;
    z-index: 50;
    .iconfont {
      display: block;
      padding: 9px;
      font-size: 24px;
      color: ${style["font-color-desc"]};
      font-weight: bold;
      transform: rotate(90deg);
    }
  }
  .text{
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }
  .title {
    line-height: 25px;
    font-size: ${style["font-size-l"]};
    color: ${style["font-color-desc"]};
    ${style.noWrap()};
  }
  .subtitle {
    line-height: 20px;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc-v2"]};
    ${style.noWrap()}; // 规定表格单元格中的内容不换行
  }
`

export const Middle = styled.div`
  position: fixed;
  width: 100%;
  top: 8%;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
  overflow: hidden;
  .fade-enter {
    opacity: 0;
  }
  .fade-enter-active {
    opacity: 1;
    transition: all 0.4s;
  }
  .fade-enter-done {
    transition: none;
  }
  .fade-exit-active {
    opacity: 0;
  }
  .fade-exit-done {
    opacity: 0;
  }
`

export const CDWrapper = styled.div`
  margin: auto;
  position: absolute;
  width: 100%;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
  .needle{
    position: absolute;
    top: -6.67vw;
    left: 48vw;
    width: 25vw;
    height: 40vw;
    z-index: 100;
    background-image: url(${needle});
    ${style.bgFull()};
    transform-origin: 4.5vw 4.5vw;
    transition: all 0.3s;
    transform: rotate(0);
    &.pause{
      transform: rotate(-30deg);
    }
  }
  .cd {
    top: 16%;
    position: absoluta;
    width: 70%;
    height: 70vw;
    background-image: url(${disc});
    border: 4px solid ${style["border-color-v2"]};
    border-radius: 50%;
    ${style.bgFull()};
    .image {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 68%;
      height: 68%;
      margin: auto;
      border-radius: 50%;
    }
    .play {
      animation: ${rotate} 20s linear infinite;
      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .playing_lyric {
    position: absolute;
    margin: auto;
    width: 80%;
    top: 95vw;
    font-size: 14px;
    line-height: 20px;
    white-space: normal;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
  }
`