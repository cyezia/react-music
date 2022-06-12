import React, { useRef } from 'react';
import { getName, prefixStyle } from '../../../api/utils';
import { NormalPlayerContainer, Top, Middle, Bottom, CDWrapper, Operators, ProgressWrapper } from './style';
import ProgressBar from '../../../baseUI/progress-bar/index';
import { CSSTransition } from 'react-transition-group';
import animations from 'create-keyframe-animation';

function NormalPlayer (props) {
  // debugger;
  const { song, fullScreen } =  props;
  const { toggleFullScreenDispatch } = props;

  // 处理transform的浏览器兼容性问题
  const transform = prefixStyle("transform");

  const normalPlayerRef = useRef();
  const cdWrapperRef = useRef();

  return (
    <CSSTransition
      className="normal"
      in={fullScreen}
      timeout={400}
    >
      <NormalPlayerContainer>
      <div className="background">
        <img src={song.al.picUrl + "?param=300x300"} width="100%" height="100%" alt="歌曲图片" />
      </div>
      <div className="background layer"></div>
      <Top className="top">
        <div className="back">
          <i className="iconfont icon-back">&#xe662;</i>
        </div>
        <div className="text">
          <h1 className="title">{song.name}</h1>
          <h1 className="subtitle">{getName(song.ar)}</h1>
        </div>
      </Top>
      <Middle>
        <CDWrapper>
          <div className="cd">
            <img className="image play" src={song.al.picUrl + "?param=400x400"} alt="" />
          </div>
        </CDWrapper>
      </Middle>
      <Bottom className="bottom">
        <ProgressWrapper>
          <span className="time time-l">0:00</span>
          <div className="progress-bar-wrapper">
            <ProgressBar percent={0.2}></ProgressBar>
          </div>
          <div className="time time-r">4:17</div>
        </ProgressWrapper>
        <Operators>
          <div className="icon i-left" >
            <i className="iconfont">&#xe625;</i>
          </div>
          <div className="icon i-left">
            <i className="iconfont">&#xe6e1;</i>
          </div>
          <div className="icon i-center">
            <i className="iconfont">&#xe723;</i>
          </div>
          <div className="icon i-right">
            <i className="iconfont">&#xe718;</i>
          </div>
          <div className="icon i-right">
            <i className="iconfont">&#xe640;</i>
          </div>
        </Operators>
      </Bottom>
    </NormalPlayerContainer>
    </CSSTransition>
    
  );
}
export default React.memo (NormalPlayer);