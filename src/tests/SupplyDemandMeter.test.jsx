import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SupplyDemandMeter from "../components/SupplyDemandMeter.jsx";

vi.mock("../hooks/useWebSocket", () => ({ default: vi.fn() }));
vi.mock("../api", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: { supply_demand: [{ crop: "Tomato", supply: 80, demand: 100 }] },
      })
    ),
  },
}));

describe("SupplyDemandMeter", () => {
  it("renders supply and demand ratio", async () => {
    render(<SupplyDemandMeter />);
    await waitFor(() => expect(screen.getByText("Tomato")).toBeInTheDocument());
    expect(screen.getByText("80 / 100 kg")).toBeInTheDocument();
  });
});
