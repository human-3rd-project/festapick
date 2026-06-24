import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Header from "./Header";
import AxiosApi from "../api/AxiosApi";
import { useAuth } from "../context/AuthContext";

const mockNavigate = jest.fn();

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
      NavLink: MockLink,
      useLocation: () => ({ pathname: "/" }),
      useNavigate: () => mockNavigate,
    };
  },
  { virtual: true },
);

jest.mock("../api/AxiosApi", () => ({
  getUnreadAlarmsCount: jest.fn(),
  getAlarms: jest.fn(),
  markAlarmAsRead: jest.fn(),
  logout: jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

const renderHeader = () =>
  render(<Header />);

describe("Header notification panel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    useAuth.mockReturnValue({
      isLoggedIn: true,
      isAuthLoading: false,
      user: { nickname: "테스트회원", role: "USER" },
      logout: jest.fn(),
    });
    AxiosApi.getUnreadAlarmsCount.mockResolvedValue({ data: { data: 0 } });
    AxiosApi.getAlarms.mockResolvedValue({ data: { data: { content: [] } } });
    AxiosApi.markAlarmAsRead.mockResolvedValue({ data: { success: true } });
  });

  test("알림 패널 문구를 한글로 보여준다", async () => {
    renderHeader();

    fireEvent.click(screen.getByLabelText("알림 열기"));

    expect(await screen.findByText("알림")).toBeInTheDocument();
    expect(screen.getByText("모두 읽음")).toBeInTheDocument();
    expect(screen.getByText("새 알림이 없습니다.")).toBeInTheDocument();
    expect(screen.queryByText("Notification")).not.toBeInTheDocument();
    expect(screen.queryByText("Mark all as read")).not.toBeInTheDocument();
  });

  test("모두 읽음을 누르면 보이는 알림을 읽음 처리한다", async () => {
    AxiosApi.getUnreadAlarmsCount.mockResolvedValue({ data: { data: 2 } });
    AxiosApi.getAlarms.mockResolvedValue({
      data: {
        data: {
          content: [
            {
              notificationId: 1,
              title: "첫 번째 알림",
              readStatus: false,
              createdAt: "2026-06-19T10:00:00",
            },
            {
              notificationId: 2,
              title: "두 번째 알림",
              readStatus: false,
              createdAt: "2026-06-19T11:00:00",
            },
          ],
        },
      },
    });

    renderHeader();

    fireEvent.click(screen.getByLabelText("알림 열기"));

    expect(await screen.findByText("첫 번째 알림")).toBeInTheDocument();
    expect(screen.getByText("두 번째 알림")).toBeInTheDocument();

    fireEvent.click(screen.getByText("모두 읽음"));

    await waitFor(() => {
      expect(AxiosApi.markAlarmAsRead).toHaveBeenCalledTimes(2);
    });
    expect(AxiosApi.markAlarmAsRead).toHaveBeenCalledWith(1);
    expect(AxiosApi.markAlarmAsRead).toHaveBeenCalledWith(2);
  });

  test("개별 읽음 버튼을 누르면 해당 알림만 읽음 처리한다", async () => {
    AxiosApi.getUnreadAlarmsCount.mockResolvedValue({ data: { data: 1 } });
    AxiosApi.getAlarms.mockResolvedValue({
      data: {
        data: {
          content: [
            {
              notificationId: 1,
              title: "첫 번째 알림",
              readStatus: false,
              createdAt: "2026-06-19T10:00:00",
              targetUrl: "/detail/1",
            },
          ],
        },
      },
    });

    renderHeader();

    fireEvent.click(screen.getByLabelText("알림 열기"));

    expect(await screen.findByText("첫 번째 알림")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("첫 번째 알림 읽음 처리"));

    await waitFor(() => {
      expect(AxiosApi.markAlarmAsRead).toHaveBeenCalledWith(1);
    });
    await waitFor(() => {
      expect(screen.queryByText("첫 번째 알림")).not.toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test("알림 본문 클릭은 읽음 처리하지 않고 이동만 수행한다", async () => {
    AxiosApi.getUnreadAlarmsCount.mockResolvedValue({ data: { data: 1 } });
    AxiosApi.getAlarms.mockResolvedValue({
      data: {
        data: {
          content: [
            {
              notificationId: 1,
              title: "첫 번째 알림",
              readStatus: false,
              createdAt: "2026-06-19T10:00:00",
              targetUrl: "/detail/1",
            },
          ],
        },
      },
    });

    renderHeader();

    fireEvent.click(screen.getByLabelText("알림 열기"));

    expect(await screen.findByText("첫 번째 알림")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("첫 번째 알림 알림 열기"));

    expect(AxiosApi.markAlarmAsRead).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/detail/1");
  });
});
