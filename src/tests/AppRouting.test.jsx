import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import App from "../App.jsx";

vi.mock("../api", () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe("App routing", () => {
  it("redirects anonymous users to the login page", async () => {
    render(
      <MemoryRouter initialEntries={["/admin/dashboard"]}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole("heading", { name: /Welcome Back/i })).toBeInTheDocument());
  });
});
