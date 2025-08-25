import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Shield, ShieldOff, MoreHorizontal, Eye, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/ui/input";
import { UserListProps } from "./type";
import { useDebounce } from "@/shared/hooks/useDebounce";

interface ExtendedUserListProps extends UserListProps {
  onSearchChange: (search: string, page: number) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  loading?: boolean;
}

const UserList: React.FC<ExtendedUserListProps> = ({ 
  users, 
  type, 
  isBlocked, 
  onSearchChange,
  pagination,
  loading = false
}) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Debounce search term with 500ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    onSearchChange(debouncedSearchTerm, 1); 
  }, [debouncedSearchTerm, onSearchChange]);

  const handlePageChange = useCallback((page: number) => {
    onSearchChange(debouncedSearchTerm, page);
  }, [debouncedSearchTerm, onSearchChange]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const { currentPage, totalPages } = pagination;
    
    // Show max 5 page buttons
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust start if we're near the end
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(i)}
          disabled={loading}
        >
          {i}
        </Button>
      );
    }

    return buttons;
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex justify-end">
        <div className="relative max-w-sm">
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            disabled={loading}
            className="pr-10"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading users...</span>
        </div>
      )}

      {/* Mobile view - card based layout */}
      <div className="md:hidden space-y-4">
        {!loading && users.length === 0 ? (
          <p className="text-center py-6">
            No{" "}
            {isBlocked === "block"
              ? "blocked"
              : isBlocked === "active"
              ? "active"
              : "pending"}{" "}
            {type}s found.
          </p>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {user.driverImage ? (
                        <img
                          src={user.driverImage}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm text-gray-500">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">ID</p>
                      <p>{user.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p
                        className={`font-medium ${
                          user.accountStatus === "Good"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {user.accountStatus}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Join Date</p>
                      <p>{new Date(user.joiningDate).toLocaleDateString()}</p>
                    </div>
                    {type === "driver" && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Vehicle</p>
                        <p>{user.vehicle || "N/A"}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        navigate(
                          type === "user"
                            ? `/admin/userDetails/${user.id}`
                            : type === "driver" && isBlocked === "pending"
                            ? `/admin/PendingDriverDetails/${user.id}`
                            : `/admin/driverDetails/${user.id}`
                        )
                      }
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant={
                        isBlocked === "block" ? "default" : "destructive"
                      }
                      size="sm"
                      className={`flex-1 ${
                        isBlocked === "block"
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-red-600 hover:bg-red-700"
                      } text-white transition-colors duration-200`}
                    >
                      {isBlocked === "block" ? (
                        <>
                          <ShieldOff className="mr-1 h-4 w-4 bg-black text-red-500" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Shield className="mr-1 h-4 w-4" />
                          Block
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Desktop view - table based layout */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Join Date</TableHead>
              {type === "driver" && <TableHead>Vehicle</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!loading && users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={type === "driver" ? 7 : 6}
                  className="text-center"
                >
                  No{" "}
                  {isBlocked === "block"
                    ? "blocked"
                    : isBlocked === "active"
                    ? "active"
                    : "pending"}{" "}
                  {type}s found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.driverImage ? (
                        <img
                          src={user.driverImage}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm text-gray-500">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.mobile}</TableCell>
                  <TableCell>
                    {new Date(user.joiningDate).toLocaleDateString()}
                  </TableCell>
                  {type === "driver" && (
                    <TableCell>{user.vehicle}</TableCell>
                  )}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(
                            type === "user"
                              ? `/admin/userDetails/${user.id}`
                              : type === "driver" && isBlocked === "pending"
                              ? `/admin/PendingDriverDetails/${user.id}`
                              : `/admin/driverDetails/${user.id}`
                          )
                        }
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
            {pagination.totalItems} {type}s
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
            >
              Previous
            </Button>
            {renderPaginationButtons()}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || loading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;