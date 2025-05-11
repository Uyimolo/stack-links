"use client";
import React from "react";
import { H3, Paragraph } from "../global/Text";
import { useAppState } from "@/store/useAppStore";
import { cn } from "@/lib/cn";
import { Plus, MoreVertical } from "lucide-react";
import DropdownSearch from "./Searchbar";
import { Button } from "../global/Button";
import TopCollectionsByLinks from "./TopCollectionsByLinks";
import Empty from "../global/Empty";
import { useDashBoardMetrics } from "@/hooks/useDashboardHooks";
import Loading from "../global/Loading";
const DashboardPage = () => {
  const { showSidebar } = useAppState();
  const { overView, topCollectionsByLinks, recentLinks, loading } =
    useDashBoardMetrics();

  return (
    <div className="p-4 min-h-screen space-y-4">
      <div className="flex gap-4 items-center">
        <DropdownSearch />{" "}
        <Button>
          <Plus />{" "}
          <span className="hidden  lg:block text-nowrap">Add Collection</span>
        </Button>
      </div>
      {/* overviews header */}

      <div
        className={cn(
          "grid grid-cols-2  gap-4 lg:grid-cols-4 items-center",
          showSidebar ? "md:grid-cols-2" : "md:grid-cols-4",
        )}
      >
        {overView.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex flex-col bg-white border border-grey-7 shadow gap-2 w-full rounded-xl borde p-2 md:p-4"
            >
              <div
                className={`flex p-2 md:p-3 rounded-sm text-white items-center  ${item.bgColor} gap-2`}
              >
                <Icon className="w-5" />
                <Paragraph
                  className={`md:text-md md:font-medium text-[13px] sm:text-sm`}
                >
                  {item.title}
                </Paragraph>
              </div>

              <Paragraph className="px-2 text-xs md:text-sm">
                {item.value}
              </Paragraph>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* recent links */}
        <div className="bg-white border border-grey-7 shadow-md rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <H3 className="text-lg font-semibold">Recent Links</H3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              <span className="hidde lg:block">Add Link</span>
            </Button>
          </div>
          {loading && <Loading className="h-73  w-full" />}

          {!loading && recentLinks?.length === 0 && (
            <Empty text="No links yet! Click on the button above to add a new link" />
          )}

          {!loading && recentLinks && (
            <div className="space-y-2">
              {recentLinks.map((link) => {
                return (
                  <div
                    className="flex last:border-none items-cente justify-between border-b pb-2 border-grey-4"
                    key={link.id}
                  >
                    <div className="w-full max-w-[90%]">
                      <Paragraph className="text-[13px] w-full font-medium capitalize truncate">
                        {link.title}
                      </Paragraph>

                      <Paragraph className="text-xs truncate text-text-secondary">
                        {link.url}
                      </Paragraph>
                      <Paragraph className="text-xs truncate text-text-secondary">
                        {link.description}
                      </Paragraph>
                    </div>

                    <MoreVertical className="text-text-secondary min-w-5 max-w-5 cursor-pointer" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* top collections */}
        <TopCollectionsByLinks
          topCollectionsByLinks={topCollectionsByLinks || []}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
