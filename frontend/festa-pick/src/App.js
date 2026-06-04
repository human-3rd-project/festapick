import "./App.css";
import Layout from "./layout";
import { Routes, useLocation } from "react-router-dom";

const noLayoutPaths = [
  "/login",
  "/signup",
  "/register",
  "/find-id",
  "/find-password",
  "/find-account",
  "/find-id-password",
];

function App() {
  const { pathname } = useLocation();
  const hideHeaderFooter = noLayoutPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const routes = (
    <Routes>
      {/* // TODO : 라우터 설정 */}
      {/* <Route path="/" element={<Home />} /> */}
      {/* <Route path="/about" element={<About />} /> */}
    </Routes>
  );

  return (
    <div className="App">
      {hideHeaderFooter ? routes : <Layout>{routes}</Layout>}
    </div>
  );
}

export default App;
