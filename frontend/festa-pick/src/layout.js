import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import styled from "styled-components";

const LayoutWrapper = styled.div`
  min-height: 100vh;
`;

const MainContent = styled.main`
  padding-top: 64px;
`;

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <Header />
      </header>

      <main>{children}</main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
