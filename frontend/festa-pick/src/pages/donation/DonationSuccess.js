import React from "react";
import { CheckCircle2, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

function DonationSuccess() {
  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

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

          <Title id="donation-success-title">후원이 완료되었습니다!</Title>
          <Message>
            페스타픽과 함께 더 활기찬 축제 문화를 만들어주셔서 감사합니다.
          </Message>

          <BenefitNotice>
            <Gem />
            <BenefitText>
              이제 프리미엄 등급 혜택(광고 제거)이 적용됩니다.
            </BenefitText>
          </BenefitNotice>

          <ActionButton type="button" onClick={goHome}>
            메인으로 돌아가기
          </ActionButton>
        </SuccessCard>
      </ContentWrap>
    </SuccessPage>
  );
}

export default DonationSuccess;
