import { Query } from "mongoose";
import { Subscription } from "../subscription/subscription.model";
import { User } from "../user/user.model";

const getTotalRevenue = async (query: any) => {
  const startDate = new Date(query.start);
  const endDate = new Date(query.end);
  const revenueData = await Subscription.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        revenue: { $sum: "$price" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
    {
      $project: {
        _id: 0,
        month: {
          $concat: [
            {
              $arrayElemAt: [
                [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                { $subtract: ["$_id.month", 1] },
              ],
            },
            " ",
            { $toString: "$_id.year" },
          ],
        },
        revenue: 1,
      },
    },
  ]);

  // 2️⃣ Generate all months in range
  const allMonths: string[] = [];
  let current = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (current <= end) {
    const monthStr = `${
      [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][current.getMonth()]
    } ${current.getFullYear()}`;
    allMonths.push(monthStr);
    current.setMonth(current.getMonth() + 1);
  }

  // 3️⃣ Merge aggregation result with all months, fill 0 for missing
  const revenueMap = revenueData.reduce((acc, item) => {
    acc[item.month] = item.revenue;
    return acc;
  }, {} as Record<string, number>);

  const finalData = allMonths.map((month) => ({
    month,
    revenue: revenueMap[month] || 0,
  }));

  return finalData;
};

// Ethnicity Distribution

const getEthnicityDistribution = async () => {
  const options = [
    "Black / Africa Decent",
    "East Asia",
    "Hispanic/Latino",
    "Middle Eastern",
    "Native American",
    "Pacific Islander",
    "South Asian",
    "Southeast Asian",
    "White Caucasion",
    "Other",
    "Open to All",
    "Pisces",
  ];

  const rawData = await User.aggregate([
    {
      $match: { ethnicity: { $in: options } }, // Optional: only known options
    },
    {
      $group: {
        _id: "$ethnicity",
        count: { $sum: 1 },
      },
    },
  ]);

  // Initialize formatted object
  const formatted: Record<string, number> = {};
  options.forEach((opt) => (formatted[opt] = 0));
  formatted["Unknown"] = 0;

  rawData.forEach((item) => {
    if (options.includes(item._id)) formatted[item._id] = item.count;
    else formatted["Unknown"] += item.count;
  });

  return formatted;
};

// Gender Distribution

const getGenderDistribution = async () => {
  const options = ["MAN", "WOMEN", "NON-BINARY", "TRANS MAN", "TRANS WOMAN"];

  const rawData = await User.aggregate([
    {
      $match: { gender: { $in: options } }, // optional filter
    },
    {
      $group: {
        _id: "$gender",
        count: { $sum: 1 },
      },
    },
  ]);

  // Total users
  const totalUsers = await User.countDocuments();

  // Initialize formatted object
  const formatted: Record<string, { total: number; percentage: string }> = {};
  options.forEach((opt) => (formatted[opt] = { total: 0, percentage: "0%" }));
  formatted["Unknown"] = { total: 0, percentage: "0%" };

  rawData.forEach((item) => {
    if (options.includes(item._id)) {
      formatted[item._id].total = item.count;
      formatted[item._id].percentage =
        ((item.count / totalUsers) * 100).toFixed(2) + "%";
    } else {
      formatted["Unknown"].total += item.count;
    }
  });

  // If Unknown exists, calculate percentage
  if (formatted["Unknown"].total > 0) {
    formatted["Unknown"].percentage =
      ((formatted["Unknown"].total / totalUsers) * 100).toFixed(2) + "%";
  }

  return formatted;
};

const getMonthlySignups = async () => {
  const monthlySignups = await User.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        totalUsers: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  const formatted = monthlySignups.map((item) => ({
    year: item._id.year,
    month: item._id.month,
    totalUsers: item.totalUsers,
  }));

  return formatted;
};

export const DashboardService = {
  getTotalRevenue,
  getEthnicityDistribution,
  getGenderDistribution,
  getMonthlySignups,
};
