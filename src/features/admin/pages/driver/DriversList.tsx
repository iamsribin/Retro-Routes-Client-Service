import { useState, useEffect, useRef } from "react";
import { axiosAdmin } from "@/shared/services/axios/adminAxios";
import ApiEndpoints from "@/constants/api-end-pointes";
import UserList from '../../components/user/UserList';
import { cn } from "@/shared/lib/utils"; 
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import AdminLayout from "../../components/admin/AdminLayout";

const Drivers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'block' | 'pending'>('active');
  const [verifiedDrivers, setverifiedDrivers] = useState<any[]>([]);
  const [blockedDrivers, setBlockedDrivers] = useState<any[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<any[]>([]);
  const dispatch = useDispatch();
  
  const abortControllerRef = useRef<AbortController | null>(null);

const fetchActiveUsers = async () => {
  const controller = new AbortController();
  try {
    const { data } = await axiosAdmin(dispatch).get(ApiEndpoints.ADMIN_VERIFIED_DRIVERS, {
      signal: controller.signal
    });
    setverifiedDrivers(data);
  } catch (error: any) {
    if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
      toast.error(error.message || 'Failed to fetch active drivers');
    }
  }
};

const fetchPendingDrivers = async () => {
  const controller = new AbortController();
  try {
    const { data } = await axiosAdmin(dispatch).get(ApiEndpoints.ADMIN_PENDING_DRIVERS, {
      signal: controller.signal
    });
    setPendingDrivers(data);
  } catch (error: any) {
    if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
      toast.error(error.message || 'Failed to fetch pending drivers');
    }
  }
};

const fetchBlockedDrivers = async () => {
  const controller = new AbortController();
  try {
    const { data } = await axiosAdmin(dispatch).get(ApiEndpoints.ADMIN_BLOCKED_DRIVERS, {
      signal: controller.signal
    });
    setBlockedDrivers(data);
  } catch (error: any) {
    if (error.name !== 'AbortError' && error.name !== 'CanceledError') {
      toast.error(error.message || 'Failed to fetch blocked drivers');
    }
  }
};


  useEffect(() => {
    if (activeTab === 'active') {
      fetchActiveUsers();
    } else if(activeTab === 'pending'){
      fetchPendingDrivers();
    } else {
      fetchBlockedDrivers();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [activeTab]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
              Active Drivers
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={cn(
                "px-4 py-2 text-sm font-medium ",
                activeTab === 'pending'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
              )}
            >
              Pending Drivers
            </button>

            <button
              onClick={() => setActiveTab('block')}
              className={cn(
                "px-4 py-2 text-sm font-medium border rounded-r-lg",
                activeTab === 'block'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'
              )}
            >
              Blocked Drivers
            </button>
          </div>
        </div>

        {activeTab === 'active' && (
          <UserList users={verifiedDrivers} type="driver" isBlocked={activeTab} />
        )}
        {activeTab === 'block' && (
          <UserList users={blockedDrivers} type="driver" isBlocked={activeTab} />
        )}
        {activeTab === 'pending' && (
          <UserList 
          users={pendingDrivers} 
          type="driver" 
          isBlocked={activeTab}
        />
        )}
      </div>
    </AdminLayout>
  );
};

export default Drivers;