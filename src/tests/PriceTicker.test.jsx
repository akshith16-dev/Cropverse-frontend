import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PriceTicker from "../components/PriceTicker.jsx";

vi.mock("../hooks/useWebSocket", () => ({ default: vi.fn() }));
vi.mock("../api", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: [{ id: 1, market_name: "Guntur", price_per_kg: 42 }],
      })
    ),
  },
}));

describe("PriceTicker", () => {
  it("renders latest market prices", async () => {
    render(<PriceTicker />);
    await waitFor(() => expect(screen.getByText(/Guntur/)).toBeInTheDocument());
    expect(screen.getByText(/₹42\/kg/)).toBeInTheDocument();
  });
});
