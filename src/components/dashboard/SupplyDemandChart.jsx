import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { useEffect, useRef, useState } from "react";

const data = [
  {
    crop: "Tomato",
    supply: 120,
    demand: 90,
  },
  {
    crop: "Potato",
    supply: 80,
    demand: 100,
  },
  {
    crop: "Onion",
    supply: 150,
    demand: 130,
  },
  {
    crop: "Rice",
    supply: 200,
    demand: 170,
  },
];

export default function SupplyDemandChart() {
  const chartFrameRef = useRef(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const element = chartFrameRef.current;
    if (!element) return undefined;

    const updateWidth = () => {
      setChartWidth(Math.max(320, Math.floor(element.clientWidth)));
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-w-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold">
            Supply vs Demand 📊
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Compare crop availability against market demand.
          </p>
        </div>
      </div>

      <div ref={chartFrameRef} className="h-80 min-h-64 min-w-0 overflow-x-auto">
        {chartWidth > 0 && (
          <BarChart data={data} width={chartWidth} height={300}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />

            <XAxis
              dataKey="crop"
              tick={{
                fill: "#94a3b8",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#94a3b8",
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
              }}
            />

            <Legend />

            <Bar
              dataKey="supply"
              name="Supply"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
            />

            <Bar
              dataKey="demand"
              name="Demand"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        )}
      </div>
    </div>
  );
}
