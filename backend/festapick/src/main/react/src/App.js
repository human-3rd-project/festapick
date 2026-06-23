import "./App.css";
import Layout from "./layout";
import { useEffect } from "react";
import {
  Navigate,
  Routes,
  useLocation,
  useParams,
  Route,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
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
import KakaoPopupCallbackPage from "./pages/auth/KakaoPopupCallbackPage";
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
  "/oauth/kakao/callback",
];

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isLoggedIn, isAuthLoading } = useAuth() || {};

  if (isAuthLoading) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          redirectTo: `${location.pathname}${location.search}`,
        }}
      />
    );
  }

  return children;
};

const LegacyFestivalRoute = () => {
  const { festivalId } = useParams();
  const { search } = useLocation();

  return (
    <Navigate
      to={`/detail/${encodeURIComponent(festivalId || "")}${search}`}
      replace
    />
  );
};

function App() {
  const { pathname } = useLocation();
  const hideHeaderFooter = noLayoutPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isAdminPath = pathname === "/admin" || pathname.startsWith("/admin/");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  const routes = (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/search" element={<FestaSearch />} />
      <Route path="/nearby" element={<FestaSearch />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/ai" element={<AiRecommendPage />} />
      <Route path="/ai-recommend" element={<AiRecommendPage />} />
      <Route path="/detail/:festivalId" element={<FestaDetail />} />
      <Route path="/festivals/:festivalId" element={<LegacyFestivalRoute />} />

      <Route path="/donation" element={<Donation />} />
      <Route
        path="/donation/success"
        element={
          <ProtectedRoute>
            <DonationSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/donation/fail"
        element={
          <ProtectedRoute>
            <DonationFail />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/find-id" element={<FindIdPage />} />
      <Route path="/find-password" element={<FindPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/social-login" element={<SocialLoginPage />} />
      <Route path="/oauth/kakao/callback" element={<KakaoPopupCallbackPage />} />

      <Route
        path="/mypage"
        element={
          <ProtectedRoute>
            <Navigate to="/mypage/profile" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/profile"
        element={
          <ProtectedRoute>
            <MyPageInfo />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/region"
        element={
          <ProtectedRoute>
            <MyPageLocal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/favorite"
        element={
          <ProtectedRoute>
            <MyPageFavorite />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/record"
        element={
          <ProtectedRoute>
            <MyPageRecord />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/review"
        element={
          <ProtectedRoute>
            <MyPageReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/account"
        element={
          <ProtectedRoute>
            <MyPageAccount />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/password/verify"
        element={
          <ProtectedRoute>
            <PasswordVerify />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mypage/password/reset"
        element={
          <ProtectedRoute>
            <ResetPasswordPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Navigate to="/admin/members" replace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/members"
        element={
          <ProtectedRoute>
            <AdminMember />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute>
            <AdminReview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/festivals"
        element={
          <ProtectedRoute>
            <AdminFestival />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/donations"
        element={
          <ProtectedRoute>
            <AdminDonation />
          </ProtectedRoute>
        }
      />

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
