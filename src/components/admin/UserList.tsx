import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Shield, ShieldOff, MoreHorizontal, Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  vehicle?: string;
  joiningDate: Date;
  userImage?: string;
  mobile: string;
}

interface UserListProps {
  users: User[];
  type: 'user' | 'driver';
  isBlocked: 'active' | 'blocked' |'pending' ;
}

const UserList: React.FC<UserListProps> = ({ users, type, isBlocked }) => {
  return (
    <div>
      {/* Mobile view - card based layout */}
      <div className="md:hidden space-y-4">
        {users.length === 0 ? (
          <p className="text-center py-6">
            No {isBlocked ==='blocked' ? 'blocked' : isBlocked ==='active'? 'active':'pending'} {type}s found.
          </p>
        ) : (
          users.map((user) => (
            <Card key={user._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {user.userImage ? (
                        <img 
                          src={user.userImage}
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
                        <p className="text-sm text-muted-foreground">{user.email}</p>
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
                      <p className={`font-medium ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                        {user.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Join Date</p>
                      <p>{new Date(user.joiningDate).toLocaleDateString()}</p>
                    </div>
                    {type === 'driver' && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Vehicle</p>
                        <p>{user.vehicle || 'N/A'}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button 
                      variant={isBlocked ==='blocked' ? "default" : "destructive"} 
                      size="sm"
                      className={`flex-1 ${isBlocked =="blocked" ? 
                        'bg-emerald-600 hover:bg-emerald-700' : 
                        'bg-red-600 hover:bg-red-700'} 
                        text-white transition-colors duration-200`}
                    >
                      {isBlocked==='blocked' ? (
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
              {type === 'driver' && <TableHead>Vehicle</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={type === 'driver' ? 7 : 6} className="text-center">
                No {isBlocked ==='blocked' ? 'blocked' : isBlocked ==='active'? 'active':'pending'} {type}s found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.userImage ? (
                        <img 
                          src={user.userImage}
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
                  <TableCell>{new Date(user.joiningDate).toLocaleDateString()}</TableCell>
                  {type === 'driver' && <TableCell>{user.vehicle || 'N/A'}</TableCell>}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="mr-1 h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        variant={isBlocked==="blocked" ? "default" : "destructive"}
                        size="sm"
                        className={`${isBlocked==="blocked" ? 
                          'bg-emerald-600 hover:bg-emerald-700' : 
                          'bg-red-600 hover:bg-red-700'} 
                          text-white transition-colors duration-200`}
                      >
                        {isBlocked==="blocked" ? (
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
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UserList;