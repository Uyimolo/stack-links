"use client";

import { TopCollectionsByLinksType } from "@/types/types";
import React, { useState } from "react";
import { H3, Paragraph } from "../global/Text";
import { BarChart as BarChartIcon, List, MoreVertical } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import Empty from "../global/Empty";

const TopCollectionsByLinks = ({
  topCollectionsByLinks,
}: {
  topCollectionsByLinks: TopCollectionsByLinksType[];
}) => {
  const [viewMode, setViewMode] = useState<"chart" | "list">("chart");

  const filteredCollections = topCollectionsByLinks?.filter(
    (collection) => collection.linksCount > 0,
  );

  const COLORS = [
    "#0f766e",
    "#115e59",
    "#134e4a",
    "#0e7490",
    "#155e75",
    "#164e63",
    "#0369a1",
    "#075985",
    "#1e40af",
    "#1e3a8a",
  ];

  return (
    <div className="space-y-4 rounded-xl p-4 border border-grey-7 bg-white shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <H3 className="text-lg font-semibold">Top Collections</H3>
        {topCollectionsByLinks.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode("chart")}
              className={`hover:scale-110 transition duration-300 ${
                viewMode === "chart" && "text-primary"
              }`}
            >
              <BarChartIcon />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`hover:scale-110 transition duration-300 ${
                viewMode === "list" && "text-primary"
              }`}
            >
              <List />
            </button>
          </div>
        )}
      </div>

      {topCollectionsByLinks.length === 0 && (
        <Empty text="Click on the add collection button above to add a collection" />
      )}

      {topCollectionsByLinks.length > 0 && (
        <div>
          {viewMode === "chart" ? (
            <ResponsiveContainer
              className="overflow-hidden"
              width="100%"
              height={300}
            >
              <BarChart data={filteredCollections} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={100}
                  className="line-clamp-2"
                />
                <Tooltip
                  contentStyle={{ fontSize: "12px", borderRadius: "6px" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Bar dataKey="linksCount" radius={[0, 8, 8, 0]}>
                  {filteredCollections.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="space-y-2">
              {filteredCollections.map((collection) => (
                <div
                  className="flex gap-4 items-start justify-between last:border-none border-b pb-2 border-grey-7 w-full"
                  key={collection.id}
                >
                  <div className="flex gap-2 items-center">
                    <div>
                      <Paragraph className="text-[13px] capitalize font-medium line-clamp-1">
                        {collection.name}
                      </Paragraph>
                      <Paragraph className="text-xs line-clamp-1 text-text-secondary">
                        {collection.description || "No description yet!"}
                      </Paragraph>
                      <Paragraph className="text-xs line-clamp-1 px-2 bg-teal/80 w-fit rounded text-white">
                        {collection.linksCount}{" "}
                        {collection.linksCount > 1 ? "links" : "link"}
                      </Paragraph>
                    </div>
                  </div>
                  <MoreVertical className="text-text-secondary h-5 min-w-5 max-w-5 cursor-pointer" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TopCollectionsByLinks;
