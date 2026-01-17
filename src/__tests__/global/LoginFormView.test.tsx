import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LoginFormView } from "@/app/(auth)/login/_components/LoginFormView";

describe("LoginFormView", () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onGoogleLogin: vi.fn(),
    loading: false,
    error: null,
  };

  //Success state
  it("should trigger onSubmit on valid data", () => {
    // Arrange
    render(<LoginFormView {...defaultProps} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /^login$/i });

    // Act
    fireEvent.change(emailInput, { target: { value: "chef@chef.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    // Assert
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  //Loading state
  it("prevents multiple submissions when loading", () => {
    // Arrange
    render(<LoginFormView {...defaultProps} loading={true} />);

    // Assert
    const button = screen.getByRole("button", { name: /^login$/i });
    expect(button).toBeDisabled();
  });

  //Error Handling
  it("displays error message", () => {
    // Arrange
    const errorMessage = "Error message";
    render(<LoginFormView {...defaultProps} error={errorMessage} />);

    // Assert
    const errorDisplay = screen.getByText(errorMessage);
    expect(errorDisplay).toBeInTheDocument();
  });

  // Google login
  it("calls onGoogleLogin when the Google button is clicked", () => {
    render(<LoginFormView {...defaultProps} />);

    const googleButton = screen.getByRole("button", {
      name: /login with google/i,
    });
    fireEvent.click(googleButton);

    expect(defaultProps.onGoogleLogin).toHaveBeenCalledTimes(1);
  });
});
