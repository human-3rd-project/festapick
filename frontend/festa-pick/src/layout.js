// TODO : 레이아웃 컴포넌트 작성
import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <div>
      {/* 헤더 */}
      <header>
        <Header />
      </header>

      {/* 메인 콘텐츠 */}
      <main>
        <outlet />
      </main>

      {/* 푸터 */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
