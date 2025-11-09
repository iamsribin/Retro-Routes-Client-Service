import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table';
import { Button } from '@/shared/components/ui/button';
import { Shield, ShieldOff, MoreHorizontal, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useNavigate } from 'react-router-dom';
import AppRoutes from '@/constants/app-routes';

interface UserListProps {
  users: any[];
  type: 'user' | 'driver';
  isBlocked: 'active' | 'block' | 'pending';
  loading?: boolean;
  onBlockToggle?: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({
  users,
  type,
  isBlocked,
  loading = false,
  onBlockToggle,
}) => {
  const navigate = useNavigate();

  const getEmptyMessage = () => {
    const status = isBlocked === 'block' ? 'blocked' : isBlocked === 'active' ? 'active' : 'pending';
    return `No ${status} ${type}s found.`;
  };

  const handleViewDetailsBtnClick =(id:string) => {
  let path = "";

  if (type === "user") {
    path = AppRoutes.ADMIN_USER_DETAILS.replace(":id", id);
  } else if (type === "driver" && isBlocked === "pending") {
    path = `/admin/PendingDriverDetails/${id}`;
  } else {
    path = AppRoutes.ADMIN_DRIVER_DETAILS.replace(":id",id);
  }
console.log({path});

  navigate(path);
}

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-2 text-blue-600" />
        <span className="text-lg">Loading {type}s...</span>
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">{getEmptyMessage()}</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile view - card based layout */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm text-gray-500 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Mobile</p>
                    <p>{user.mobile}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <p
                      className={`font-medium ${
                        user.accountStatus === 'Good' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {user.accountStatus}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Join Date</p>
                    <p>{user.joiningDate}</p>
                  </div>
                  {type === 'driver' && user.vehicle && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Vehicle</p>
                      <p>{user.vehicle}</p>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={()=>handleViewDetailsBtnClick(user.id)}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    View
                  </Button>
                  {onBlockToggle && (
                    <Button
                      variant={isBlocked === 'block' ? 'default' : 'destructive'}
                      size="sm"
                      className={`flex-1 ${
                        isBlocked === 'block'
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white transition-colors duration-200`}
                      onClick={() => onBlockToggle(user.id)}
                    >
                      {isBlocked === 'block' ? (
                        <>
                          <ShieldOff className="mr-1 h-4 w-4" />
                          Unblock
                        </>
                      ) : (
                        <>
                          <Shield className="mr-1 h-4 w-4" />
                          Block
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
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
              {type === 'driver' && <TableHead>Vehicle</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-sm text-gray-500 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.mobile}</TableCell>
                <TableCell>{new Date(user.joiningDate).toLocaleDateString()}</TableCell>
                {type === 'driver' && <TableCell>{user.vehicle || 'N/A'}</TableCell>}
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.accountStatus === 'Good'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {user.accountStatus}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={()=>handleViewDetailsBtnClick(user.id)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    {onBlockToggle && (
                      <Button
                        variant={isBlocked === 'block' ? 'default' : 'destructive'}
                        size="sm"
                        className={
                          isBlocked === 'block'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : ''
                        }
                        onClick={() => onBlockToggle(user.id)}
                      >
                        {isBlocked === 'block' ? (
                          <>
                            <ShieldOff className="mr-1 h-4 w-4" />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Shield className="mr-1 h-4 w-4" />
                            Block
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default UserList;