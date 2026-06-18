import React, { useEffect, useMemo, useRef, useState } from "react";
import { Info, RefreshCcw, TriangleAlert } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AxiosApi from "../../api/AxiosApi";
import {
  BackgroundLayer,
  ContentWrap,
  Description,
  ErrorBox,
  ErrorLabel,
  ErrorLabelText,
  ErrorReason,
  FailCard,
  FailPage,
  GlowOrb,
  IconWrap,
  PoweredBy,
  RetryButton,
  Title,
  WarningBadge,
} from "./DonationFailCss";

const getResponseData = (response) =>
  response?.data?.data ?? response?.data ?? response;

function DonationFail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasSavedRef = useRef(false);
  const orderId = searchParams.get("orderId");
  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const initialReason = useMemo(
    () => message || code || "결제 과정 중 오류가 발생했습니다.",
    [code, message],
  );
  const [errorReason, setErrorReason] = useState(initialReason);
  const [description, setDescription] = useState(
    orderId
      ? "결제 실패 정보를 확인하고 있습니다."
      : "결제가 취소되었거나 결제창에서 주문번호가 전달되지 않았습니다.",
  );

  useEffect(() => {
    if (hasSavedRef.current) {
      return;
    }

    hasSavedRef.current = true;

    if (!orderId) {
      setErrorReason(initialReason);
      return;
    }

    const saveFailure = async () => {
      try {
        await AxiosApi.donationFail(orderId, initialReason);

        if (typeof AxiosApi.donationFailureInfo === "function") {
          const failureResponse = await AxiosApi.donationFailureInfo(orderId);
          const failureInfo = getResponseData(failureResponse);
          setErrorReason(failureInfo?.failReason || initialReason);
        }

        setDescription("결제가 완료되지 않아 실패 정보가 저장되었습니다.");
      } catch (error) {
        setErrorReason(
          error?.response?.data?.message ||
            error?.message ||
            "결제 실패 정보를 저장하지 못했습니다.",
        );
        setDescription("결제 실패 정보를 확인하는 중 문제가 발생했습니다.");
      }
    };

    saveFailure();
  }, [initialReason, orderId]);

  const retryDonation = () => {
    navigate("/donation");
  };

  return (
    <FailPage>
      <BackgroundLayer aria-hidden="true">
        <GlowOrb />
        <GlowOrb $tone="secondary" />
        <GlowOrb $tone="tertiary" />
      </BackgroundLayer>

      <ContentWrap>
        <FailCard aria-labelledby="donation-fail-title">
          <IconWrap>
            <WarningBadge aria-hidden="true">
              <TriangleAlert />
            </WarningBadge>
          </IconWrap>

          <Title id="donation-fail-title">결제에 실패했습니다</Title>
          <Description>{description}</Description>

          <ErrorBox>
            <ErrorLabel>
              <Info />
              <ErrorLabelText>오류 상세 사유</ErrorLabelText>
            </ErrorLabel>
            <ErrorReason>
              {orderId ? `${errorReason} (주문번호: ${orderId})` : errorReason}
            </ErrorReason>
          </ErrorBox>

          <RetryButton type="button" onClick={retryDonation}>
            <RefreshCcw />
            다시 시도하기
          </RetryButton>
        </FailCard>

        <PoweredBy>Powered by FestaPick Sponsorship</PoweredBy>
      </ContentWrap>
    </FailPage>
  );
}

export default DonationFail;
