import React, { forwardRef, useEffect, useState,useRef } from 'react';
import PropTypes from "prop-types";
import BScroll from 'better-scroll';
import styled from 'styled-components';

// 作为通用组件，scroll在业务中会被经常取到原生DOM对象，函数式组件天生不具备被上层组件直接调用ref的条件，故用forwardRef进行包裹
const Scroll = forwardRef((props, ref) => {
  // better-scroll实例对象
  const [bScroll, setBScroll] = useState();
  // current指向初始化better-scroll实例需要的DOM元素
  const scrollContaninerRef = useRef();
  
  // 从外面接收props 解构赋值拿到参数
  const {direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom} = props;
  const {onScroll, pullUp, pullDown} = props;

  // 创建better-scroll
  useEffect(() => {
    const scroll = new BScroll(scrollContaninerRef.current, {
      scrollX: direction === "horizental",
      scrollY: direction === "vertical",
      probeType: 3,
      click: click,
      bounce: {
        top: bounceTop,
        bottom: bounceBottom
      }
    });
    setBScroll(scroll);
    return () => {
      setBScroll(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 每次重新渲染都要刷新实例 防止无法滑动
  useEffect(() => {
    if(refresh && bScroll) {
      bScroll.refresh();
    }
  });

  // 给实例绑定scroll事件
  useEffect(() => {
    if(!bScroll || !onScroll) return;
    bScroll.on('scroll', (scroll) => {
      onScroll(scroll);
    })
    return () => {
      bScroll.off('scroll');
    }
  }, [onScroll, bScroll]);

  // 判断是否上拉到底 调用上拉刷新函数
  useEffect(() => {
    if(!bScroll || pullUp) return;
    bScroll.on('scrollEnd', () => {
      // 判断是否滑到底了
      if(bScroll.y <= bScroll.maxScrollY + 100) {
        pullUp();
      }
    });
    return () => {
      bScroll.off('scrollEnd');
    }
  }, [pullUp, bScroll]);

  // 下拉判断 调用下拉加载函数
  useEffect(() => {
    if(!bScroll || pullDown) return;
    bScroll.on('touchEnd', (pos) => {
      // 判断用户下拉动作
      if(pos.y >= 50) {
        pullDown();
      }
    });
    return () => {
      bScroll.off('touchEnd');
    }
  }, [pullDown, bScroll]);

})



Scroll.propTypes = {
  direction: PropTypes.oneOf(['vertical', 'horizental']), //滚动的方向 垂直 水平
  click: true, // 是否支持点击
  refresh: PropTypes.bool, // 刷新
  onScroll: PropTypes.func, // 滑动触发的回调函数
  pullUp: PropTypes.func, // 上拉加载
  pullDown: PropTypes.func, // 下拉刷新
  pullUpLoading: PropTypes.bool, // 是否显示上拉loading动画
  pullDownLoading: PropTypes.bool, // 是否显示下拉loading动画
  bounceTop: PropTypes.bool, // 是否支持向上吸顶
  bounceBottom: PropTypes.bool // 是否支持向下吸底
}

Scroll.defaultProps = {
  direction: "vertical",
  click: true,
  refresh: true,
  onScroll: null,
  pullUp: null,
  pullDown: null,
  pullUpLoading: false,
  pullDownLoading: false,
  bounceTop: true,
  bounceBottom: true
}

export default Scroll;