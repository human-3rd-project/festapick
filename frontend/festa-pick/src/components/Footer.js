import React from "react";
import { Globe2, Share2 } from "lucide-react";
import {
  BrandName,
  Copyright,
  FooterBar,
  FooterInner,
  FooterLink,
  FooterMenu,
  FooterRight,
  IconButton,
  IconGroup,
} from "./FooterCss";

const footerLinks = [
  "서비스 소개",
  "이용약관",
  "개인정보처리방침",
  "고객센터",
  "문의하기",
];

function Footer() {
  return (
    <FooterBar>
      <FooterInner>
        <FooterMenu aria-label="Footer menu">
          {footerLinks.map((link) => (
            <FooterLink key={link} href="/">
              {link}
            </FooterLink>
          ))}
        </FooterMenu>

        <FooterRight>
          <IconGroup aria-label="Footer links">
            <IconButton href="/" aria-label="공식 웹사이트">
              <Globe2 size={24} aria-hidden="true" />
            </IconButton>
            <IconButton href="/" aria-label="공유하기">
              <Share2 size={24} aria-hidden="true" />
            </IconButton>
          </IconGroup>
          <Copyright>
            © 2026 FestaPick. Celebrating kinetic energy and
            <br />
            local culture.
          </Copyright>
        </FooterRight>

        <BrandName href="/">FestaPick</BrandName>
      </FooterInner>
    </FooterBar>
  );
}

export default Footer;
