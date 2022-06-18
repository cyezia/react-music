import React, { useState, useEffect, useCallback } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Container } from './style';
import Scroll from '../../baseUI/scroll/index';
import SearchBox from '../../baseUI/search-box/index';

const Search = (props) => {
  // 控制动画
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setShow(true);
  }, [])

  const handleQuery = (q) => {
    setQuery(q);
    if(!q) return;

  }

  // 由于是传给子组件的方法，用useCallback包裹，以使得在依赖未改变，始终给子组件传递的是相同的引用
  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container>
        <div className="search_box_wrapper">
          <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
        </div>
      </Container>

    </CSSTransition>
  )
}

export default React.memo(Search);
