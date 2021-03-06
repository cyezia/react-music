import React from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import PropTypes from 'prop-types';

const HeaderContainer = styled.div`
  position: fixed;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 10000;
  display: flex;
  line-height: 40px;
  color: ${style["font-color-light"]};
  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }
  >h1 {
    font-size: ${style["font-size-l"]};
    font-weight: 700;
  }
`

// 函数式组件天生不具备被上层组件直接调用ref的条件 用forwardRef包裹来处理
const Header = React.forwardRef((props, ref) => {
  const { handleClick, title } = props;

  return (
    <HeaderContainer ref={ref}>
      <i className="iconfont back" onClick={handleClick}>&#xe655;</i>
      <h1>{title}</h1>
    </HeaderContainer>
  )
})

Header.defaultProps = {
  handleClick: () => {},
  title: "标题"
};

Header.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string
};

export default React.memo(Header);