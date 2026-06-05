import React, { useEffect, useState } from "react";
import { PartyPopper, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  AdBadge,
  AdvertiseCard,
  AdvertisePosition,
  CloseButton,
  ContentArea,
  CopyGroup,
  CtaButton,
  Description,
  Title,
  VisualArea,
  VisualMark,
} from "./AdvertiseCss";

const hiddenPathPrefixes = [
  "/login",
  "/signup",
  "/register",
  "/find-id",
  "/find-password",
  "/find-account",
  "/find-id-password",
];

function Advertise({ onDetailClick }) {
  const [isVisible, setIsVisible] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsVisible(true);
  }, [pathname]);

  const isAuthPage = hiddenPathPrefixes.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isVisible || isAuthPage) {
    return null;
  }

  const handleDetailClick = () => {
    if (onDetailClick) {
      onDetailClick();
    }
  };

  return (
    <AdvertisePosition aria-label="광고">
      <AdvertiseCard>
        <CloseButton
          type="button"
          aria-label="광고 닫기"
          onClick={() => setIsVisible(false)}
        >
          <X aria-hidden="true" />
        </CloseButton>

        <AdBadge>AD</AdBadge>

        <VisualArea aria-hidden="true">
          <VisualMark>
            <PartyPopper />
          </VisualMark>
        </VisualArea>

        <ContentArea>
          <CopyGroup>
            <Title>Summer Beat Festival</Title>
            <Description>
              한여름 밤의 짜릿한 열기! 국내 최대 규모의 일렉트로닉 뮤직
              페스티벌이 돌아옵니다.
            </Description>
          </CopyGroup>

          <CtaButton type="button" onClick={handleDetailClick}>
            자세히 보기
          </CtaButton>
        </ContentArea>
      </AdvertiseCard>
    </AdvertisePosition>
  );
}

export default Advertise;
