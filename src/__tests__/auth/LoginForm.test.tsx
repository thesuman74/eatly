import { LoginForm } from "@/app/(auth)/login/_components/loginForm";
import { login } from "@/lib/actions/login";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const signInWithOAuthMock = vi.fn();

vi.mock("@/lib/actions/login", () => ({
  login: vi.fn(),
}));

vi.mock("@/lib/supabase/client", () => ({
  createBrowserSupabaseClient: vi.fn(() => ({
    auth: {
      signInWithOAuth: signInWithOAuthMock,
    },
  })),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  /* ---------------------------- Success Scenarios --------------------------- */
  it("calls the login server action with form data when submitted", async () => {
    (login as any).mockResolvedValue({ error: null });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "chef@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(login).toHaveBeenCalledTimes(1);
    });

    const submittedData = (login as any).mock.calls[0][0];
    expect(submittedData.get("email")).toBe("chef@example.com");
    expect(submittedData.get("password")).toBe("password123");
  });

  it("calls Google OAuth login when Google button is clicked", async () => {
    render(<LoginForm />);

    fireEvent.click(screen.getByRole("button", { name: /login with google/i }));

    await waitFor(() => {
      expect(signInWithOAuthMock).toHaveBeenCalledTimes(1);
    });
  });

  /* ---------------------------- Error State --------------------------- */
  it("updates error state and stops loading when login fails", async () => {
    const serverErrorMessage = "Invalid credentials";
    (login as any).mockResolvedValue({ error: serverErrorMessage });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "chef@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });

    const submitButton = screen.getByRole("button", { name: /^login$/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(serverErrorMessage)).toBeInTheDocument();
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("resets error state when a new submission begins", async () => {
    render(<LoginForm />);
    (login as any).mockResolvedValueOnce({ error: "First Error" });

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    const errorMsg = await screen.findByText("First Error");
    expect(errorMsg).toBeInTheDocument();

    (login as any).mockResolvedValueOnce({ error: null });
    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    expect(screen.queryByText("First Error")).not.toBeInTheDocument();
  });
});
