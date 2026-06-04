import "./App.css";
// import Layout from "./layout";
import { Routes, useLocation } from "react-router-dom";
import AdminDonation from "./pages/admin/AdminDonation";
import AdminMember from "./pages/admin/AdminMember";

// const noLayoutPaths = [
//   "/login",
//   "/signup",
//   "/register",
//   "/find-id",
//   "/find-password",
//   "/find-account",
//   "/find-id-password",
// ];

function App() {
  // const { pathname } = useLocation();
  // const hideHeaderFooter = noLayoutPaths.some(
  //   (path) => pathname === path || pathname.startsWith(`${path}/`),
  // );

  // const routes = (
  //   <Routes>
  //     {/* // TODO : 라우터 설정 */}
  //     {/* <Route path="/" element={<Home />} /> */}
  //     {/* <Route path="/about" element={<About />} /> */}
  //   </Routes>
  // );

  // return (
  //   <div className="App">
  //     {hideHeaderFooter ? routes : <Layout>{routes}</Layout>}
  //   </div>
  // );
  return (
    <div className="App">
      <AdminDonation />
    </div>
  );
}

export default App;
