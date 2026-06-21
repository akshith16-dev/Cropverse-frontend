import {
  UserPlus,
  Sprout,
  ShoppingCart,
  IndianRupee,
  Package,
} from "lucide-react";

const activities = [
  {
    icon: UserPlus,
    title: "Farmer Registered",
    description: "A new farmer joined Cropverse.",
    time: "2 mins ago",
  },
  {
    icon: Sprout,
    title: "Crop Assigned",
    description: "Tomato assigned to a farmer.",
    time: "10 mins ago",
  },
  {
    icon: ShoppingCart,
    title: "Order Placed",
    description: "Shop placed a new order.",
    time: "20 mins ago",
  },
  {
    icon: IndianRupee,
    title: "Price Updated",
    description: "Market price updated by admin.",
    time: "1 hour ago",
  },
  {
    icon: Package,
    title: "Demand Request",
    description: "New crop demand submitted.",
    time: "2 hours ago",
  },
];

export default function ActivityFeed() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
      <h2 className="text-xl font-bold mb-5">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;

          return (
            <div
              key={index}
              className="
                flex items-start gap-4
                p-4
                rounded-xl
                bg-white/5
                hover:bg-white/10
                transition
              "
            >
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Icon
                  size={18}
                  className="text-emerald-400"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-medium">
                  {activity.title}
                </h3>

                <p className="text-sm text-slate-400 mt-1">
                  {activity.description}
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}