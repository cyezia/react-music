// 封装Album的JSX代码

import React from 'react';
import { TopDesc, Menu } from './style';
import SongsList from '../../application/SongList/index';

function AlbumDetail(props) {
  // debugger;
  const { currentAlbum, pullUpLoading } = props;

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          {/* 给图片上的图标和文字提供一个遮罩 因为字体颜色设置的白色，当背景图片也是白色的时候，会看不清，故提供一个阴影来衬托文字 */}
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10}万</span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  };

  const renderMenu = () => {
    return ( 
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  };

  const renderSongList = () => {
    return (
      <SongsList
        songs={currentAlbum.tracks}
        collectCount={currentAlbum.subscribedCount}
        showCollect={true}
        loading={pullUpLoading}
        // musicAnimation={props.musicAnimation}
        showBackground={true}
      ></SongsList>
    )
  }

  return (
    <div>
      { renderTopDesc() }
      { renderMenu() }
      { renderSongList() }
    </div>
  )
};
export default React.memo(AlbumDetail);

