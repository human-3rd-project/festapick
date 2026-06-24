import React from "react";
import { Globe2, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
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
  { label: "서비스 소개", path: "/" },
  { label: "축제 탐색", path: "/search" },
  { label: "후원", path: "/donation" },
  { label: "캘린더", path: "/festival-calendar" },
  { label: "AI 추천", path: "/ai" },
];

function Footer() {
  return (
    <FooterBar>
      <FooterInner>
        <FooterMenu aria-label="Footer menu">
          {footerLinks.map(({ label, path }) => (
            <FooterLink key={path} as={Link} to={path}>
              {label}
            </FooterLink>
          ))}
        </FooterMenu>

        <FooterRight>
          <IconGroup aria-label="Footer links">
            <IconButton as={Link} to="/" aria-label="공식 웹사이트">
              <Globe2 size={24} aria-hidden="true" />
            </IconButton>
            <IconButton as={Link} to="/" aria-label="공유하기">
              <Share2 size={24} aria-hidden="true" />
            </IconButton>
          </IconGroup>
          <Copyright>
            © 2026 FestaPick. Celebrating kinetic energy and
            <br />
            local culture.
          </Copyright>
        </FooterRight>

        <BrandName as={Link} to="/">FestaPick</BrandName>
      </FooterInner>
    </FooterBar>
  );
}

export default Footer;
