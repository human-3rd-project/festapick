import React, { useEffect, useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import {
  BadgeCheck,
  Heart,
  HeartHandshake,
  Stars,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import { useAuth } from "../../context/AuthContext";
import {
  ActionArea,
  BackgroundLayer,
  ContentShell,
  Decoration,
  DonateButton,
  DonateButtonText,
  DonationPage,
  Eyebrow,
  EyebrowText,
  FeatureCard,
  FeatureDescription,
  FeatureGrid,
  FeatureIcon,
  FeatureTitle,
  GlowBlob,
  GradientText,
  HeroContent,
  HeroPanel,
  Lead,
  LiveDot,
  StatDivider,
  StatItem,
  StatLabel,
  Stats,
  StatValue,
  Title,
} from "./DonationCss";

const DONATION_AMOUNT = 10000;
const TOSS_CLIENT_KEY = process.env.REACT_APP_TOSS_CLIENT_KEY;

const benefits = [
  {
    icon: Stars,
    tone: "primary",
    title: "프리미엄 등급 업그레이드",
    description:
      "후원 즉시 프리미엄 등급으로 승급되어 더욱 특별한 혜택을 누리실 수 있습니다.",
  },
  {
    icon: Users,
    tone: "secondary",
    title: "광고 없는 쾌적한 환경",
    description:
      "모든 광고가 제거되어 축제 정보를 더욱 빠르고 쾌적하게 확인하실 수 있습니다.",
  },
  {
    icon: BadgeCheck,
    tone: "tertiary",
    title: "서비스 성장을 위한 큰 힘",
    description:
      "여러분의 소중한 후원은 페스타픽이 더 좋은 정보를 제공하고 성장하는 데 큰 도움이 됩니다.",
  },
];

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response;

const getDonationId = (response) => {
  const data = getResponseData(response);
  return typeof data === "object" && data !== null
    ? data.donationId || data.id
    : data;
};

const generateOrderId = () => {
  const random = Math.random().toString(36).slice(2, 12);
  return `don_${Date.now()}_${random}`.slice(0, 64);
};

const getCustomerKey = (user) => {
  const userId = user?.userId ?? user?.id ?? user?.memberId;
  return userId ? `festa_user_${userId}` : "";
};

const getApiErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const DEFAULT_DONATION_STATISTICS = {
  totalDonationAmount: 0,
  totalDonorCount: 0,
};

const toNumber = (value) => {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const formatWon = (value) => `${toNumber(value).toLocaleString("ko-KR")}원`;

const formatPeople = (value) => `${toNumber(value).toLocaleString("ko-KR")}명`;

function Donation() {
  const navigate = useNavigate();
  const { isLoggedIn, isAuthLoading, user } = useAuth() || {};
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [donationStatistics, setDonationStatistics] = useState(
    DEFAULT_DONATION_STATISTICS,
  );

  useEffect(() => {
    let isMounted = true;

    const fetchDonationStatistics = async () => {
      try {
        const response = await AxiosApi.donationStatistics();
        const data = getResponseData(response);

        if (!isMounted) {
          return;
        }

        setDonationStatistics({
          totalDonationAmount: toNumber(data?.totalDonationAmount),
          totalDonorCount: toNumber(data?.totalDonorCount),
        });
      } catch {
        if (isMounted) {
          setDonationStatistics(DEFAULT_DONATION_STATISTICS);
        }
      }
    };

    fetchDonationStatistics();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDonate = async () => {
    if (isProcessing || isAuthLoading) {
      return;
    }

    if (!isLoggedIn) {
      window.alert("로그인 후 후원할 수 있습니다.");
      navigate("/login", { state: { redirectTo: "/donation" } });
      return;
    }

    if (!TOSS_CLIENT_KEY) {
      setStatusMessage("결제 설정이 필요합니다. Toss client key를 확인해주세요.");
      return;
    }

    const customerKey = getCustomerKey(user);
    if (!customerKey) {
      setStatusMessage("사용자 정보를 확인할 수 없습니다. 다시 로그인해주세요.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage("결제창을 준비하고 있습니다.");

    try {
      const applyResponse = await AxiosApi.donationApply(DONATION_AMOUNT);
      const donationId = getDonationId(applyResponse);

      if (!donationId) {
        throw new Error("후원 신청 번호를 확인할 수 없습니다.");
      }

      const orderId = generateOrderId();
      await AxiosApi.donationPayments(donationId, orderId);

      const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey });

      await payment.requestPayment({
        method: "CARD",
        amount: {
          value: DONATION_AMOUNT,
          currency: "KRW",
        },
        orderId,
        orderName: "FestaPick 후원",
        customerName: user?.nickname || undefined,
        customerEmail: user?.email || undefined,
        successUrl: `${window.location.origin}/donation/success`,
        failUrl: `${window.location.origin}/donation/fail`,
      });
    } catch (error) {
      setStatusMessage(
        getApiErrorMessage(error, "결제 요청을 시작하지 못했습니다."),
      );
      setIsProcessing(false);
    }
  };

  return (
    <DonationPage>
      <BackgroundLayer aria-hidden="true">
        <GlowBlob />
        <GlowBlob $variant="secondary" />
      </BackgroundLayer>

      <ContentShell>
        <HeroPanel aria-labelledby="donation-title">
          <Decoration aria-hidden="true">
            <HeartHandshake />
          </Decoration>

          <HeroContent>
            <Eyebrow>
              <LiveDot />
              <EyebrowText>Support the Vibe</EyebrowText>
            </Eyebrow>

            <Title id="donation-title">
              축제의 열기를 더하는
              <br />
              <GradientText>당신의 응원</GradientText>
            </Title>

            <Lead>
              페스타픽과 함께 더 나은 지역 축제 문화를 만들어가요.
              <br />
              당신의 후원은 아티스트의 무대와 지역 사회의 활기를 지속시키는
              힘이 됩니다.
            </Lead>

            <ActionArea>
              <DonateButton
                type="button"
                aria-busy={isProcessing}
                aria-label="축제 후원하기 10000원"
                disabled={isProcessing || isAuthLoading}
                onClick={handleDonate}
              >
                <DonateButtonText>
                  {isProcessing ? "결제창 준비 중" : "축제 후원하기 (10,000원)"}
                </DonateButtonText>
                <Heart />
              </DonateButton>

              {statusMessage && <Lead role="status">{statusMessage}</Lead>}

              <Stats aria-label="후원 현황">
                <StatItem>
                  <StatValue>
                    {formatWon(donationStatistics.totalDonationAmount)}
                  </StatValue>
                  <StatLabel>누적 후원금</StatLabel>
                </StatItem>
                <StatDivider />
                <StatItem>
                  <StatValue>
                    {formatPeople(donationStatistics.totalDonorCount)}
                  </StatValue>
                  <StatLabel>함께한 후원자</StatLabel>
                </StatItem>
              </Stats>
            </ActionArea>
          </HeroContent>
        </HeroPanel>

        <FeatureGrid aria-label="후원 혜택">
          {benefits.map(({ icon: Icon, tone, title, description }) => (
            <FeatureCard key={title} $tone={tone}>
              <FeatureIcon $tone={tone}>
                <Icon />
              </FeatureIcon>
              <FeatureTitle>{title}</FeatureTitle>
              <FeatureDescription>{description}</FeatureDescription>
            </FeatureCard>
          ))}
        </FeatureGrid>
      </ContentShell>
    </DonationPage>
  );
}

export default Donation;
