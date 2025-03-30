import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserList from '@/components/admin/UserList';
import { axiosAdmin } from '@/services/axios/adminAxios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames

const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'blocked'>('active');
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchActiveUsers = async () => {
    try {
      const { data } = await axiosAdmin().get('/getActiveUserData');
      setActiveUsers(data);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to fetch active users');
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const { data } = await axiosAdmin().get('/blockedUserData');
      setBlockedUsers(data);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to fetch blocked users');
    }
  };

  useEffect(() => {
    if (activeTab === 'active') {
      fetchActiveUsers();
    } else {
      fetchBlockedUsers();
    }
  }, [activeTab]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">User Management</h1>

        <div className="mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                "px-4 py-2 text-sm font-medium border rounded-l-lg",
                activeTab === 'active'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
              )}
            >
              Active Users
            </button>
            <button
              onClick={() => setActiveTab('blocked')}
              className={cn(
                "px-4 py-2 text-sm font-medium border rounded-r-lg",
                activeTab === 'blocked'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
              )}
            >
              Blocked Users
            </button>
          </div>
        </div>

        {activeTab === 'active' && (
          <UserList users={activeUsers} type="user" isBlocked={activeTab} />
        )}
        {activeTab === 'blocked' && (
          <UserList users={blockedUsers} type="user" isBlocked={activeTab} />
        )}
      </div>
    </AdminLayout>
  );
};

export default Users;