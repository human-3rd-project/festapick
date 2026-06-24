import "./App.css";
import Layout from "./layout";
import { Navigate, Routes, useLocation, Route } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import FestaSearch from "./pages/search/FestaSearch";
import Calendar from "./pages/calendar/Calendar";
import AiRecommendPage from "./pages/AiRecommendPage/AiRecommendPage";
import FestaDetail from "./pages/detail/FestaDetail";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import FindIdPage from "./pages/auth/FindIdPage";
import FindPasswordPage from "./pages/auth/FindPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SocialLoginPage from "./pages/auth/SocialLoginPage";
import AdminDonation from "./pages/admin/AdminDonation";
import AdminMember from "./pages/admin/AdminMember";
import AdminReview from "./pages/admin/AdminReview";
import AdminFestival from "./pages/admin/AdminFestival";
import Donation from "./pages/donation/Donation";
import DonationSuccess from "./pages/donation/DonationSuccess";
import DonationFail from "./pages/donation/DonationFail";
import MyPageInfo from "./pages/mypage/mypage_infomation/MyPageInfo";
import MyPageLocal from "./pages/mypage/mypage_local/MyPageLocal";
import MyPageFavorite from "./pages/mypage/mypage_favorite/MyPageFavorite";
import MyPageRecord from "./pages/mypage/mypage_record/MyPageRecord";
import MyPageReview from "./pages/mypage/mypage_review/MyPageReview";
import MyPageAccount from "./pages/mypage/mypage_account/MyPageAccount";
import PasswordVerify from "./pages/mypage/mypage_password/PasswordVerify";
import Advertise from "./components/advertise/Advertise";

const noLayoutPaths = [
  "/login",
  "/signup",
  "/find-id",
  "/find-password",
  "/reset-password",
  "/social-login",
];

function App() {
  const { pathname } = useLocation();
  const hideHeaderFooter = noLayoutPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  const routes = (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/search" element={<FestaSearch />} />
      <Route path="/nearby" element={<FestaSearch />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/ai" element={<AiRecommendPage />} />
      <Route path="/ai-recommend" element={<AiRecommendPage />} />
      <Route path="/detail/:festivalId" element={<FestaDetail />} />

      <Route path="/donation" element={<Donation />} />
      <Route path="/donation/success" element={<DonationSuccess />} />
      <Route path="/donation/fail" element={<DonationFail />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/find-id" element={<FindIdPage />} />
      <Route path="/find-password" element={<FindPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/social-login" element={<SocialLoginPage />} />

      <Route
        path="/mypage"
        element={<Navigate to="/mypage/profile" replace />}
      />
      <Route path="/mypage/profile" element={<MyPageInfo />} />
      <Route path="/mypage/region" element={<MyPageLocal />} />
      <Route path="/mypage/favorite" element={<MyPageFavorite />} />
      <Route path="/mypage/record" element={<MyPageRecord />} />
      <Route path="/mypage/review" element={<MyPageReview />} />
      <Route path="/mypage/account" element={<MyPageAccount />} />
      <Route path="/mypage/password/verify" element={<PasswordVerify />} />
      <Route path="/mypage/password/reset" element={<ResetPasswordPage />} />

      <Route path="/admin" element={<Navigate to="/admin/members" replace />} />
      <Route path="/admin/members" element={<AdminMember />} />
      <Route path="/admin/reviews" element={<AdminReview />} />
      <Route path="/admin/festivals" element={<AdminFestival />} />
      <Route path="/admin/donations" element={<AdminDonation />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  return (
    <div className="App">
      {hideHeaderFooter ? (
        routes
      ) : (
        <Layout showFooter={!isAdminPath}>{routes}</Layout>
      )}
      <Advertise />
    </div>
  );
}

export default App;
