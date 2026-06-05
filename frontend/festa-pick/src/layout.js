import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import styled from "styled-components";

const LayoutWrapper = styled.div`
  --app-header-height: 64px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0b1326;
  color: #dae2fd;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: var(--app-header-height);
  background: #0b1326;
`;

const Layout = ({ children, showFooter = true }) => {
  return React.createElement(
    LayoutWrapper,
    null,
    React.createElement(Header),
    React.createElement(MainContent, null, children),
    showFooter && React.createElement(Footer),
  );
};

export default Layout;
