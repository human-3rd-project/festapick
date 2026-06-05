import React from "react";
import { Info, RefreshCcw, TriangleAlert } from "lucide-react";
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

function DonationFail() {
  const retryDonation = () => {
    window.history.back();
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
          <Description>
            결제 과정 중 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </Description>

          <ErrorBox>
            <ErrorLabel>
              <Info />
              <ErrorLabelText>오류 상세 사유</ErrorLabelText>
            </ErrorLabel>
            <ErrorReason>잔액 부족 또는 카드 정보 오류</ErrorReason>
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
