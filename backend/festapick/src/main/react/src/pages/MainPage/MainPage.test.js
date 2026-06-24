import {
  getCarouselCardScrollDistance,
  getCarouselScrollLeft,
} from "./MainPage";

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    const MockLink = React.forwardRef(({ to, children, ...props }, ref) => (
      <a ref={ref} href={typeof to === "string" ? to : "#"} {...props}>
        {children}
      </a>
    ));
    MockLink.displayName = "MockLink";

    return {
      Link: MockLink,
    };
  },
  { virtual: true },
);

jest.mock("../../api/AxiosApi", () => ({}));
jest.mock("../../context/AuthContext", () => ({
  useAuth: () => ({ user: null, isLoggedIn: false }),
}));

describe("MainPage festival carousel scrolling", () => {
  test("카드 1장 너비와 gap만큼 이동 거리를 계산한다", () => {
    const carousel = document.createElement("div");
    const card = document.createElement("a");

    carousel.style.columnGap = "24px";
    Object.defineProperty(carousel, "clientWidth", { value: 960 });
    card.getBoundingClientRect = () => ({ width: 292 });
    carousel.appendChild(card);

    expect(getCarouselCardScrollDistance(carousel)).toBe(316);
    expect(getCarouselScrollLeft(carousel, "next")).toBe(316);
    expect(getCarouselScrollLeft(carousel, "prev")).toBe(-316);
  });

  test("카드가 없으면 기존 컨테이너 너비를 fallback으로 사용한다", () => {
    const carousel = document.createElement("div");

    Object.defineProperty(carousel, "clientWidth", { value: 960 });

    expect(getCarouselCardScrollDistance(carousel)).toBe(960);
    expect(getCarouselScrollLeft(carousel, "next")).toBe(960);
  });
});
