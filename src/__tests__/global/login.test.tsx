// Mock the login function
jest.mock("@/lib/actions/login", () => ({
  login: jest.fn().mockResolvedValue({}),
}));
import { LoginForm } from "@/app/(auth)/login/_components/loginForm";
import { render, screen } from "@testing-library/react";

describe("login form test", () => {
  it("renders a login from", () => {
    render(<LoginForm />);

    const email = screen.getByPlaceholderText("email");

    expect(email).toBeInTheDocument();
  });
});
