import { useState, useEffect, useRef } from "react";
import UserList from '../../components/user/UserList';
import { cn } from "@/shared/lib/utils"; 
import { useDispatch } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { Res_getDriversListByAccountStatus } from "../type";
import { fetchAdminDrivers } from "@/shared/services/api/adminDriverApi";

const Drivers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'block' | 'pending'>('active');
  const [verifiedDrivers, setverifiedDrivers] = useState<Res_getDriversListByAccountStatus[]>([]);
  const [blockedDrivers, setBlockedDrivers] = useState<Res_getDriversListByAccountStatus[]>([]);
  const [pendingDrivers, setPendingDrivers] = useState<Res_getDriversListByAccountStatus[]>([]);
  const dispatch = useDispatch();
  
  const abortControllerRef = useRef<AbortController | null>(null);

const fetchActiveUsers = async () => {
  const controller = new AbortController();
  abortControllerRef.current = controller;

  try {
    const data = await fetchAdminDrivers.getActiveDrivers(dispatch, controller.signal);
    setverifiedDrivers(data);
  } catch (error) {
    console.error("Error fetching active drivers", error);
  }
};

const fetchPendingDrivers = async () => {
  const controller = new AbortController();
  abortControllerRef.current = controller;

  try {
    const data = await fetchAdminDrivers.getPendingDrivers(dispatch, controller.signal);
    setPendingDrivers(data);
  } catch (error) {
    console.error("Error fetching pending drivers", error);
  }
};

const fetchBlockedDrivers = async () => {
  const controller = new AbortController();
  abortControllerRef.current = controller;

  try {
    const data = await fetchAdminDrivers.getBlockedDrivers(dispatch, controller.signal);
    setBlockedDrivers(data);
  } catch (error) {
    console.error("Error fetching blocked drivers", error);
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