import React, { useEffect, useState, useRef, memo } from 'react';
import Scroll from '../scroll/index';
import { PropTypes } from 'prop-types';
import { List, ListItem} from './style';


function Horizen(props) {
  const { list, oldVal, title } = props;
  const { handleClick } = props;

  const Category = useRef(null);
  // 初始化内容宽度逻辑
  useEffect(() => {
    let categoryDOM = Category.current;
    let tagElems = categoryDOM.querySelectorAll("span");
    let totalWidth = 0;
    Array.from(tagElems).forEach(ele => {
      totalWidth += ele.offsetWidth;
    });
    categoryDOM.style.width = `${totalWidth}px`
  }, []);

  return (
    <Scroll direction={"horizental"}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {
            list.map((item) => {
              return (
                <ListItem
                  key={item.key}
                  className={`${oldVal === item.key ? 'selected' : ''}`}
                  onclick={() => handleClick(item.key)}
                >{item.name}</ListItem>
              )
            })
          }
        </List>
      </div>
    </Scroll>
  )
}

// 接收的参数
// list 接收的列表数据
// oldVal 当前的item值
// title 列表左边的标题
// handleCilck 点击不同的item执行的方法
Horizen.defaultProps = {
  list: [],
  oldVal: '',
  title: '',
  handleClick: null
};

Horizen.propTypes = {
  list: PropTypes.array,
  oldVal: PropTypes.string,
  title: PropTypes.string,
  handleClick: PropTypes.func
}

export default React.memo(Horizen);