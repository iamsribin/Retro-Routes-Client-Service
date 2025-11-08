import React, { useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import UserList from "../../components/user/UserList";
import { cn } from "@/shared/lib/utils";
import { fetchData } from "@/shared/services/api/api-service";
import { usePaginatedSearch } from "@/shared/hooks/usePaginatedSearch";
import { AdminApiEndpoints } from "@/constants/admin-api-end-pointes";
import { SearchInput } from "@/shared/components/SearchInput";
import { Pagination } from "@/shared/components/Pagination";

const Drivers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "block" | "pending">(
    "active"
  );

  const fetchUsers = useCallback(
    async ({ page, limit, search, signal }: any) => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        status: activeTab === "active" ? "Good" : activeTab === "pending" ?"Pending":"Block",
        ...(search ? { search } : {}),
      });

      const data = await fetchData<{
        users: any[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      }>(`${AdminApiEndpoints.DRIVERS}?${params}`, signal);
      const res = data?.data;
      return {
        data: res?.users || [],
        pagination: res?.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0,
          itemsPerPage: limit,
        },
      };
    },
    [activeTab]
  );

  const {
    data: drivers,
    loading,
    pagination,
    searchTerm,
    setSearchTerm,
    setPage,
    refresh,
  } = usePaginatedSearch({
    fetchFn: fetchUsers,
    itemsPerPage: 6,
    debounceMs: 500,
  });

  const handleTabChange = (tab: "active" | "block" | "pending") => {
    setActiveTab(tab);
    setSearchTerm("");
  };
  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          Driver Management
        </h1>

        <div className="mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => handleTabChange("active")}
              disabled={loading}
              className={cn(
                "px-4 py-2 text-sm font-medium border rounded-l-lg transition-colors",
                activeTab === "active"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              Active Drivers
              {activeTab === "active" && pagination.totalItems > 0 && (
                <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                  {pagination.totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabChange("pending")}
              disabled={loading}
              className={cn(
                "px-4 py-2 text-sm font-medium border-t border-b transition-colors",
                activeTab === "pending"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              Pending Drivers
              {activeTab === "pending" && pagination.totalItems > 0 && (
                <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                  {pagination.totalItems}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabChange("block")}
              disabled={loading}
              className={cn(
                "px-4 py-2 text-sm font-medium border rounded-r-lg transition-colors",
                activeTab === "block"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-900 border-gray-200 hover:bg-gray-100",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              Blocked Drivers
              {activeTab === "block" && pagination.totalItems > 0 && (
                <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                  {pagination.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="mb-6 flex justify-end">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by name or email..."
            loading={loading}
            className="max-w-sm"
          />
        </div>
        <UserList
          users={drivers}
          type="driver"
          isBlocked={activeTab}
          loading={loading}
        />
        <Pagination
          pagination={pagination}
          onPageChange={setPage}
          loading={loading}
          itemName="users"
        />
      </div>
    </AdminLayout>
  );
};

export default Drivers;
