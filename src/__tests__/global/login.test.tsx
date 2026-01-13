import { LoginFormView } from "@/app/(auth)/login/_components/LoginFormView";

import { render, screen } from "@testing-library/react";

// Mock remains the same
jest.mock("lucide-react", () => ({
  ChefHat: () => <div data-testid="chef-hat-icon" />,
}));

describe("LoginFormView", () => {
  const mockProps = {
    onSubmit: jest.fn((e) => e.preventDefault()),
    onGoogleLogin: jest.fn(),
    loading: false,
    error: null,
  };

  it("renders the email input correctly", () => {
    render(<LoginFormView {...mockProps} />);

    // This looks for the <Label> that is linked to your email <Input>
    const emailInput = screen.getByLabelText(/email/i);

    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("type", "email");
  });
});
