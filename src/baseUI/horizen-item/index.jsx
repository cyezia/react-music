import React, { useEffect, useState, useRef } from 'react';
import Scroll from '../scroll/index';
import { PropTypes } from 'prop-types';
import { List, ListItem} from './style';


function Horizen(props) {
  const [refreshCategoryScroll, setRefreshCategoryScroll] = useState(false);
  const Category = useRef(null);

  const { list, oldVal, title } = props;
  const { handleClick } = props;

  // 初始化内容宽度逻辑
  useEffect(() => {
    let categoryDOM = Category.current;
    let tagElems = categoryDOM.querySelectorAll("span");
    let totalWidth = 0;
    Array.from(tagElems).forEach(ele => {
      totalWidth += ele.offsetWidth;
    });
    totalWidth += 2;
    categoryDOM.style.width = `${totalWidth}px`
    setRefreshCategoryScroll(true);
  }, [refreshCategoryScroll]);

  const clickHandle = (item) => {
    handleClick(item.key);
  }

  return (
    <Scroll direction={"horizontal"} refresh={true}>
      <div ref={Category}>
        <List>
          <span>{title}</span>
          {
            list.map((item) => {
              return (
                <ListItem
                  key={item.key}
                  className={oldVal === item.key ? 'selected' : ''}
                  onClick={() => clickHandle(item)}
                >
                  {item.name}
                </ListItem>
              )
            })
          }
        </List>
      </div>
    </Scroll>
  );
}

// 接收的参数
// list 接收的列表数据
// oldVal 当前的item值
// title 列表左边的标题
// handleCilck 点击不同的item执行的方法
Horizen.defaultProps = {
  list: [],
  // oldVal: '',
  // title: '',
  handleClick: null
};

Horizen.propTypes = {
  list: PropTypes.array,
  // oldVal: PropTypes.string,
  // title: PropTypes.string,
  handleClick: PropTypes.func
}

export default React.memo(Horizen);