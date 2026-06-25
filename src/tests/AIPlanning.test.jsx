import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RecommendationCard from "../components/RecommendationCard.jsx";

describe("RecommendationCard", () => {
  it("renders explainable AI recommendation details", () => {
    render(
      <RecommendationCard
        recommendation={{
          crop: "Tomato",
          recommendation_type: "crop_recommendation",
          confidence: 0.91,
          expected_profit: 50000,
          reasons: ["High demand", "Suitable soil", "High expected profit"],
        }}
      />
    );

    expect(screen.getByText("Tomato")).toBeInTheDocument();
    expect(screen.getByText("91% confidence")).toBeInTheDocument();
    expect(screen.getByText("High demand")).toBeInTheDocument();
  });
});
