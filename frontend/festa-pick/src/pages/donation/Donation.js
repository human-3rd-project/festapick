import React from "react";
import {
  BadgeCheck,
  Heart,
  HeartHandshake,
  Stars,
  Users,
} from "lucide-react";
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

function Donation() {
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
              <DonateButton type="button" aria-label="축제 후원하기 10000원">
                <DonateButtonText>축제 후원하기 (10,000원)</DonateButtonText>
                <Heart />
              </DonateButton>

              <Stats aria-label="후원 현황">
                <StatItem>
                  <StatValue>12k+</StatValue>
                  <StatLabel>Donors</StatLabel>
                </StatItem>
                <StatDivider />
                <StatItem>
                  <StatValue>450+</StatValue>
                  <StatLabel>Events Funded</StatLabel>
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
