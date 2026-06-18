import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Gem } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import { useAuth } from "../../context/AuthContext";
import {
  ActionButton,
  BackgroundLayer,
  BenefitNotice,
  BenefitText,
  CheckInner,
  CheckWrap,
  Confetti,
  ConfettiLayer,
  ContentWrap,
  Glow,
  Message,
  SuccessCard,
  SuccessPage,
  Title,
} from "./DonationSuccessCss";

const DONATION_AMOUNT = 10000;

const confettiPieces = [
  { left: 8, color: "#ddb7ff", delay: 100, duration: 4300, xOffset: 120, rotation: 620, scale: 1.2 },
  { left: 16, color: "#ffb0cd", delay: 420, duration: 5100, xOffset: -80, rotation: 540, scale: 0.9 },
  { left: 23, color: "#ffb690", delay: 250, duration: 4700, xOffset: 150, rotation: 700, scale: 1.4 },
  { left: 31, color: "#f0dbff", delay: 720, duration: 5600, xOffset: -140, rotation: 680, scale: 0.8 },
  { left: 42, color: "#ddb7ff", delay: 560, duration: 4400, xOffset: 90, rotation: 520, scale: 1.1 },
  { left: 51, color: "#ffb0cd", delay: 180, duration: 5300, xOffset: -110, rotation: 760, scale: 1.35 },
  { left: 60, color: "#ffb690", delay: 820, duration: 4900, xOffset: 125, rotation: 610, scale: 0.95 },
  { left: 69, color: "#f0dbff", delay: 340, duration: 5700, xOffset: -95, rotation: 690, scale: 1.25 },
  { left: 78, color: "#ddb7ff", delay: 660, duration: 4600, xOffset: 135, rotation: 580, scale: 0.85 },
  { left: 88, color: "#ffb0cd", delay: 60, duration: 5200, xOffset: -155, rotation: 720, scale: 1.3 },
  { left: 95, color: "#ffb690", delay: 940, duration: 5000, xOffset: -70, rotation: 640, scale: 1 },
  { left: 36, color: "#f0dbff", delay: 1080, duration: 5900, xOffset: 165, rotation: 780, scale: 0.75 },
];

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response;

const getApiErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

function DonationSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchCurrentUser } = useAuth() || {};
  const hasConfirmedRef = useRef(false);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("결제 승인 정보를 확인하고 있습니다.");
  const [paymentInfo, setPaymentInfo] = useState(null);

  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");

  useEffect(() => {
    if (hasConfirmedRef.current) {
      return;
    }

    hasConfirmedRef.current = true;

    const confirmDonation = async () => {
      const amountNumber = Number(amount);

      if (!paymentKey || !orderId || !amount || !Number.isFinite(amountNumber)) {
        setStatus("error");
        setMessage("결제 승인에 필요한 정보가 없습니다.");
        return;
      }

      if (amountNumber !== DONATION_AMOUNT) {
        setStatus("error");
        setMessage("결제 금액이 후원 금액과 일치하지 않습니다.");
        return;
      }

      try {
        await AxiosApi.donationApprove({
          paymentKey,
          orderId,
          amount: amountNumber,
        });

        if (typeof AxiosApi.donationSuccessInfo === "function") {
          const infoResponse = await AxiosApi.donationSuccessInfo(orderId);
          setPaymentInfo(getResponseData(infoResponse));
        }

        if (typeof fetchCurrentUser === "function") {
          await fetchCurrentUser();
        }

        setStatus("success");
        setMessage("페스타픽과 함께 더 활기찬 축제 문화를 만들어주셔서 감사합니다.");
      } catch (error) {
        setStatus("error");
        setMessage(
          getApiErrorMessage(error, "결제 승인 처리 중 오류가 발생했습니다."),
        );
      }
    };

    confirmDonation();
  }, [amount, fetchCurrentUser, orderId, paymentKey]);

  const goHome = () => {
    navigate("/");
  };

  const goDonation = () => {
    navigate("/donation");
  };

  const isSuccess = status === "success";
  const isLoading = status === "loading";

  return (
    <SuccessPage>
      <BackgroundLayer aria-hidden="true">
        <Glow />
        <Glow $tone="secondary" />
        <ConfettiLayer>
          {confettiPieces.map((piece) => (
            <Confetti
              key={`${piece.left}-${piece.delay}`}
              $left={piece.left}
              $color={piece.color}
              $delay={piece.delay}
              $duration={piece.duration}
              $xOffset={piece.xOffset}
              $rotation={piece.rotation}
              $scale={piece.scale}
            />
          ))}
        </ConfettiLayer>
      </BackgroundLayer>

      <ContentWrap>
        <SuccessCard aria-labelledby="donation-success-title">
          <CheckWrap aria-hidden="true">
            <CheckInner>
              <CheckCircle2 />
            </CheckInner>
          </CheckWrap>

          <Title id="donation-success-title">
            {isLoading
              ? "후원 승인 확인 중입니다"
              : isSuccess
                ? "후원이 완료되었습니다!"
                : "후원 승인 확인이 필요합니다"}
          </Title>
          <Message>{message}</Message>

          <BenefitNotice role="status">
            <Gem />
            <BenefitText>
              {isSuccess
                ? `이제 프리미엄 등급 혜택(광고 제거)이 적용됩니다.${
                    paymentInfo?.orderId ? ` 주문번호: ${paymentInfo.orderId}` : ""
                  }`
                : isLoading
                  ? "잠시만 기다려주세요."
                  : "승인이 완료되지 않았다면 후원 페이지에서 다시 시도해주세요."}
            </BenefitText>
          </BenefitNotice>

          <ActionButton type="button" onClick={isSuccess ? goHome : goDonation}>
            {isSuccess ? "메인으로 돌아가기" : "후원 페이지로 돌아가기"}
          </ActionButton>
        </SuccessCard>
      </ContentWrap>
    </SuccessPage>
  );
}

export default DonationSuccess;
