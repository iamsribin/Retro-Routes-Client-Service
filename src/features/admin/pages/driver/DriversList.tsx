import React, { useState, useEffect, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import UserList from "../../components/user/UserList";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { useDispatch } from "react-redux";
import ApiEndpoints from "@/constants/api-end-pointes";
import { fetchData } from "@/shared/services/api/api-service";
import { ResponseCom } from "@/shared/types/commonTypes";

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const Drivers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "block" | "pending">(
    "active"
  );
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6,
  });
  const [currentSearch, setCurrentSearch] = useState("");

  const dispatch = useDispatch();

  const fetchDrivers = useCallback(
    async (search: string = "", page: number = 1) => {
      setLoading(true);
      try {
        let status;

        // Determine endpoint and status based on active tab
        switch (activeTab) {
          case "active":
            status = "Good";
            break;
          case "block":
            status = "Blocked";
            break;
          case "pending":
            status = "Pending";
            break;
          default:
            status = "Good";
        }

        const params = new URLSearchParams({
          page: page.toString(),
          status: status,
          limit: pagination.itemsPerPage.toString(),
          ...(search && { search }),
        });

        const data = await fetchData<ResponseCom["data"]>(
          `${ApiEndpoints.ADMIN_GET_DRIVERS}?${params}`,
          "Admin"
        );

        console.log(`${activeTab.toUpperCase()}_DRIVERS`, data);

        setDrivers(data.drivers || []);
        setPagination((prev) => ({
          ...prev,
          currentPage: data.pagination?.currentPage || page,
          totalPages: data.pagination?.totalPages || 1,
          totalItems: data.pagination?.totalItems || data.drivers?.length || 0,
        }));
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error(
          (error as Error).message || `Failed to fetch ${activeTab} drivers`
        );
        setDrivers([]);
        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
        }));
      } finally {
        setLoading(false);
      }
    },
    [activeTab, pagination.itemsPerPage, dispatch]
  );

  // Handle search and pagination changes
  const handleSearchAndPagination = useCallback(
    (search: string, page: number) => {
      setCurrentSearch(search);
      fetchDrivers(search, page);
    },
    [fetchDrivers]
  );

  // Reset search and pagination when tab changes
  useEffect(() => {
    setCurrentSearch("");
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchDrivers("", 1);
  }, [activeTab, fetchDrivers]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
          Driver Management
        </h1>

        <div className="mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setActiveTab("active")}
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
              onClick={() => setActiveTab("pending")}
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
              onClick={() => setActiveTab("block")}
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

        <UserList
          users={drivers}
          type="driver"
          isBlocked={activeTab}
          onSearchChange={handleSearchAndPagination}
          pagination={pagination}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default Drivers;
