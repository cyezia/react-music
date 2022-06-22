import styled from 'styled-components';

export const Content = styled.div`
  position: fixed;
  top: 90px;
  /* 解决mini播放器出现后底部内容被遮挡，判断playList长度，如果大于0则正在播放，等于0则没有播放 */
  bottom: ${props => props.play > 0 ? "60px" : 0};
  width: 100%;
`