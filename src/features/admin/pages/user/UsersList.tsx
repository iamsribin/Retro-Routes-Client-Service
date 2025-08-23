import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import UserList from '../../components/user/UserList';
import { axiosAdmin } from '@/shared/services/axios/adminAxios';
import { toast } from 'sonner';
import { cn } from '@/shared/lib/utils';
import { useDispatch } from 'react-redux';
import ApiEndpoints from '@/constants/api-end-pointes';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

const Users: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'block'>('active');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 6
  });
  const [currentSearch, setCurrentSearch] = useState('');

  const dispatch = useDispatch();

  const fetchUsers = useCallback(async (search: string = '', page: number = 1) => {
    setLoading(true);
    try {
      const endpoint = activeTab === 'active' 
        ? ApiEndpoints.ADMIN_ACTIVE_USERS 
        : ApiEndpoints.ADMIN_BLOCKED_USERS;

      const params = new URLSearchParams({
        page: page.toString(),
        status: activeTab =="active" ? "Good" : "Block",
        limit: pagination.itemsPerPage.toString(),
        ...(search && { search })
      });

      const { data } = await axiosAdmin(dispatch).get(`${endpoint}?${params}`);
      
      console.log(`${activeTab.toUpperCase()}_USERS`, data);
      
      setUsers(data.users || data.Users || []);
      setPagination(prev => ({
        ...prev,
        currentPage: data.pagination?.currentPage || page,
        totalPages: data.pagination?.totalPages || 1,
        totalItems: data.pagination?.totalItems || data.users?.length || 0
      }));
      
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error((error as Error).message || `Failed to fetch ${activeTab} users`);
      setUsers([]);
      setPagination(prev => ({
        ...prev,
        currentPage: 1,
        totalPages: 1,
        totalItems: 0
      }));
    } finally {
      setLoading(false);
    }
  }, [activeTab, pagination.itemsPerPage, dispatch]);

  // Handle search and pagination changes
  const handleSearchAndPagination = useCallback((search: string, page: number) => {
    setCurrentSearch(search);
    fetchUsers(search, page);
  }, [fetchUsers]);

  // Reset search and pagination when tab changes
  useEffect(() => {
    setCurrentSearch('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchUsers('', 1);
  }, [activeTab, fetchUsers]);

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">User Management</h1>

        <div className="mb-6">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setActiveTab('active')}
              disabled={loading}
              className={cn(
                "px-4 py-2 text-sm font-medium border rounded-l-lg transition-colors",
                activeTab === 'active'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100',
                loading && 'opacity-50 cursor-not-allowed'
              )}
            >
              Active Users
              {activeTab === 'active' && pagination.totalItems > 0 && (
                <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                  {pagination.totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('block')}
              disabled={loading}
              className={cn(
                "px-4 py-2 text-sm font-medium border rounded-r-lg transition-colors",
                activeTab === 'block'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100',
                loading && 'opacity-50 cursor-not-allowed'
              )}
            >
              Blocked Users
              {activeTab === 'block' && pagination.totalItems > 0 && (
                <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs">
                  {pagination.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        <UserList 
          users={users}
          type="user"
          isBlocked={activeTab}
          onSearchChange={handleSearchAndPagination}
          pagination={pagination}
          loading={loading}
        />
      </div>
    </AdminLayout>
  );
};

export default Users;