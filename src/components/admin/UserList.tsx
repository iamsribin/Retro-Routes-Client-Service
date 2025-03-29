
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
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Shield, ShieldOff, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  joinDate: string;
  vehicle?: string;
}

interface UserListProps {
  users: User[];
  type: 'user' | 'driver';
  isBlocked: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, type, isBlocked }) => {
  return (
    <div>
      {/* Mobile view - card based layout */}
      <div className="md:hidden space-y-4">
        {users.length === 0 ? (
          <p className="text-center py-6">
            No {isBlocked ? 'blocked' : 'active'} {type}s found.
          </p>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
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
                      <p className="text-muted-foreground">Join Date</p>
                      <p>{user.joinDate}</p>
                    </div>
                    {type === 'driver' && (
                      <div className="col-span-2">
                        <p className="text-muted-foreground">Vehicle</p>
                        <p>{user.vehicle || 'N/A'}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      variant={isBlocked ? "emerald" : "destructive"} 
                      size="sm"
                      className="w-full"
                    >
                      {isBlocked ? (
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Join Date</TableHead>
              {type === 'driver' && <TableHead>Vehicle</TableHead>}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={type === 'driver' ? 6 : 5} className="text-center">
                  No {isBlocked ? 'blocked' : 'active'} {type}s found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  {type === 'driver' && <TableCell>{user.vehicle || 'N/A'}</TableCell>}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={isBlocked ? "emerald" : "destructive"} 
                        size="sm"
                      >
                        {isBlocked ? (
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

      {users.length > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default UserList;