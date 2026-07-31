import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AxiosApi from "../../api/AxiosApi";
import { useAuth } from "../../context/AuthContext";
import AiRecommendPage from "./AiRecommendPage";

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

jest.mock("../../api/AxiosApi", () => ({
  sendQuestion: jest.fn(),
}));

jest.mock("../../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const renderPage = () =>
  render(<AiRecommendPage />);

describe("AiRecommendPage nearby recommendation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    AxiosApi.sendQuestion.mockResolvedValue({
      data: {
        data: {
          message: "관심지역 기준으로 추천드릴게요.",
          festivals: [],
        },
      },
    });
  });

  test("관심지역이 있으면 내 주변 질문에 지역 코드를 함께 보낸다", async () => {
    useAuth.mockReturnValue({
      user: {
        ldongRegnCd: "11",
        ldongSignguCd: "110",
        regionName: "서울특별시 종로구",
      },
    });

    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "내 주변 축제 추천" }));

    await waitFor(() => {
      expect(AxiosApi.sendQuestion).toHaveBeenCalledWith(
        "내 주변 축제 추천",
        expect.objectContaining({
          ldongRegnCd: "11",
          ldongSignguCd: "110",
          regionName: "서울특별시 종로구",
        }),
      );
    });
  });

  test("관심지역이 없으면 API를 호출하지 않고 안내 메시지를 보여준다", async () => {
    useAuth.mockReturnValue({ user: null });

    renderPage();

    fireEvent.click(screen.getByRole("button", { name: "내 주변 축제 추천" }));

    expect(AxiosApi.sendQuestion).not.toHaveBeenCalled();
    expect(
      await screen.findByText("관심 지역을 설정하면 주변 축제를 추천받을 수 있어요."),
    ).toBeInTheDocument();
  });
});
