import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Shield, ShieldOff, MoreHorizontal, Eye } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Input } from "@/shared/components/ui/input";
import { UserListProps } from "./type";

const UserList: React.FC<UserListProps> = ({ users, type, isBlocked }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="flex justify-end">
        <Input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); 
          }}
          className="max-w-sm"
        />
      </div>

      {/* Mobile view - card based layout */}
      <div className="md:hidden space-y-4">
        {paginatedUsers.length === 0 ? (
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
          paginatedUsers.map((user) => (
            <Card key={user._id} className="overflow-hidden">
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
                      <p>{user._id}</p>
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
                            ? `/admin/userDetails/${user._id}`
                            : type === "driver" && isBlocked === "pending"
                            ? `/admin/PendingDriverDetails/${user._id}`
                            : `/admin/driverDetails/${user._id}`
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
            {paginatedUsers.length === 0 ? (
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
              paginatedUsers.map((user) => (
                <TableRow key={user._id}>
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
                              ? `/admin/userDetails/${user._id}`
                              : type === "driver" && isBlocked === "pending"
                              ? `/admin/PendingDriverDetails/${user._id}`
                              : `/admin/driverDetails/${user._id}`
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
      {filteredUsers.length > usersPerPage && (
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
            {Math.min(currentPage * usersPerPage, filteredUsers.length)} of{" "}
            {filteredUsers.length} {type}s
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
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