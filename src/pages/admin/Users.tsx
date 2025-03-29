
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserList from '@/components/admin/UserList';
import { axiosAdmin } from '@/services/axios/adminAxios';
import { useNavigate } from 'react-router-dom';

const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [usersData, setusersData] = useState([]);

  const navigate=useNavigate()

  const getData = async () => {
      try {
          const { data } = await axiosAdmin().get(`${params}`);
          setusersData(data);
          console.log(data);
          
      } catch (error) {
          toast.error((error as Error).message)
          console.log(error);
      }
  };

  // Mock data
//   const activeUsers = [
//     { id: '1', name: 'John Doe', email: 'john@example.com', status: 'active', joinDate: '2023-01-15' },
//     { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'active', joinDate: '2023-02-10' },
//     { id: '3', name: 'Alice Johnson', email: 'alice@example.com', status: 'active', joinDate: '2023-03-05' },
//   ];
  
//   const blockedUsers = [
//     { id: '4', name: 'Bob Wilson', email: 'bob@example.com', status: 'blocked', joinDate: '2023-01-20' },
//     { id: '5', name: 'Carol Adams', email: 'carol@example.com', status: 'blocked', joinDate: '2023-02-25' },
//   ];




  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">User Management</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 w-full md:w-auto">
            <TabsTrigger value="active" className="flex-1 md:flex-none">Active Users</TabsTrigger>
            <TabsTrigger value="blocked" className="flex-1 md:flex-none">Blocked Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <UserList users={activeUsers} type="user" isBlocked={false} />
          </TabsContent>
          
          <TabsContent value="blocked">
            <UserList users={blockedUsers} type="user" isBlocked={true} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Users;