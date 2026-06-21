import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

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
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
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

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
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
        </ResponsiveContainer>
      </div>
    </div>
  );
}