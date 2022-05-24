import React, { useEffect, useState, useRef, memo } from 'react';
import styled from 'styled-components';
import Scroll from '../scroll/index';
import { PropTypes } from 'prop-types';
import style from '../../assets/global-style';

function Horizen(props) {
  const { list, oldVal, title } = props;
  const { handleClick } = props;
  return (
    <Scroll>
      <div>
        <List>
          <span></span>
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