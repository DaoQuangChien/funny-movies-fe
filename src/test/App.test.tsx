/* eslint-disable testing-library/no-wait-for-side-effects */
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AuthContext, INIT_STATE } from "../store";
import { MemoryRouter } from "react-router-dom";
import App from "../App";
import { eAction, iMovie, iState } from "../types";
import request from "../services/request";

jest.mock("axios");
jest.mock("../services/request", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
  defaults: {
    baseURL: "http://localhost:4000/api",
  },
}));
describe("Test Home page", () => {
  const mockData = (data: iMovie[] = []) => {
    const getRequestListener = jest.spyOn(request, "get");
    getRequestListener.mockImplementation((url) => {
      switch (url) {
        case "/movies":
          return Promise.resolve({ data });
        default:
          return Promise.resolve({ data: [] });
      }
    });
  };
  beforeAll(() => {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
  });

  afterAll(() => {
    jest.resetModules();
  });

  test("Render Home page with empty list and not logged in", async () => {
    mockData();
    await waitFor(() => {
      render(
        <AuthContext.Provider value={[INIT_STATE, jest.fn()]}>
          <MemoryRouter initialEntries={["/"]}>
            <App />
          </MemoryRouter>
        </AuthContext.Provider>
      );
    });
    const emailInput = screen.queryByTestId("email-input");
    const passwordInput = screen.queryByTestId("password-input");
    const loginBtn = screen.queryByTestId("login-btn");
    const registerBtn = screen.queryByTestId("register-btn");

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginBtn).toBeInTheDocument();
    expect(registerBtn).toBeInTheDocument();
    await waitFor(() => {
      const movieItems = screen.queryAllByTestId("movie-item");
      expect(movieItems.length).toBe(0);
    });
  });

  test("Render Home page with list of movies", async () => {
    mockData([
      {
        _id: "1",
        title: "Test",
        movieUrlId: "Test",
        description: "Test",
        user: {
          _id: "1",
          email: "test@test.com",
        },
        upVotes: [
          {
            _id: "1",
            email: "test@test.com",
          },
        ],
        downVotes: [],
        createdAt: "24-07-2023",
        updatedAt: "24-07-2023",
      },
    ]);
    await waitFor(() => {
      render(
        <AuthContext.Provider value={[INIT_STATE, jest.fn()]}>
          <MemoryRouter initialEntries={["/"]}>
            <App />
          </MemoryRouter>
        </AuthContext.Provider>
      );
    });
    await waitFor(() => {
      const movieItems = screen.queryAllByTestId("movie-item");
      expect(movieItems.length).toBe(1);
    });
  });

  test("Render Home page logged in", async () => {
    mockData();
    const state: iState = {
      userData: {
        email: "test@test.com",
        accessToken: "abc",
        id: "1",
      },
      isSignIn: true,
    };
    await waitFor(() => {
      render(
        <AuthContext.Provider value={[state, jest.fn()]}>
          <MemoryRouter initialEntries={["/"]}>
            <App />
          </MemoryRouter>
        </AuthContext.Provider>
      );
    });
    const emailInput = screen.queryByTestId("email-input");
    const passwordInput = screen.queryByTestId("password-input");
    const loginBtn = screen.queryByTestId("login-btn");
    const registerBtn = screen.queryByTestId("register-btn");
    const welcomeElement = await screen.findByTestId("welcome-text");
    const shareMovieBtn = screen.queryByTestId("share-movie-btn");
    const logoutBtn = screen.queryByTestId("logout-btn");

    expect(emailInput).not.toBeInTheDocument();
    expect(passwordInput).not.toBeInTheDocument();
    expect(loginBtn).not.toBeInTheDocument();
    expect(registerBtn).not.toBeInTheDocument();
    expect(welcomeElement?.textContent).toBe("Welcome test@test.com");
    expect(shareMovieBtn).toBeInTheDocument();
    expect(logoutBtn).toBeInTheDocument();
  });

  test("Logout action", async () => {
    mockData();
    const state: iState = {
      userData: {
        email: "test@test.com",
        accessToken: "abc",
        id: "1",
      },
      isSignIn: true,
    };
    const dispatch = jest.fn();
    await waitFor(() => {
      render(
        <AuthContext.Provider value={[state, dispatch]}>
          <MemoryRouter initialEntries={["/"]}>
            <App />
          </MemoryRouter>
        </AuthContext.Provider>
      );
    });
    const emailInput = screen.queryByTestId("email-input");
    const passwordInput = screen.queryByTestId("password-input");
    const loginBtn = screen.queryByTestId("login-btn");
    const registerBtn = screen.queryByTestId("register-btn");
    const welcomeElement = screen.queryByTestId("welcome-text");
    const shareMovieBtn = screen.queryByTestId("share-movie-btn");
    const logoutBtn = screen.queryByTestId("logout-btn");

    expect(emailInput).not.toBeInTheDocument();
    expect(passwordInput).not.toBeInTheDocument();
    expect(loginBtn).not.toBeInTheDocument();
    expect(registerBtn).not.toBeInTheDocument();
    expect(welcomeElement?.textContent).toBe("Welcome test@test.com");
    expect(shareMovieBtn).toBeInTheDocument();
    expect(logoutBtn).toBeInTheDocument();

    await waitFor(() => {
      fireEvent.click(logoutBtn!);
      expect(dispatch).toBeCalledWith({
        type: eAction.SIGN_OUT,
      });
    });
  });
});
