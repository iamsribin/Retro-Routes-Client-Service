import { TabsContent } from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { 
  Wallet, 
  TrendingUp, 
  Star, 
  Mail, 
  List, 
  MessageSquare,
  IndianRupee,
  Calendar,
  User
} from "lucide-react";
import { DriverAccountTabProps } from "./type";

const DriverAccountTab = ({ 
  driver, 
  onNavigateToTransactions, 
  onNavigateToFeedback, 
  onSendCommissionMail 
}: DriverAccountTabProps) => {
  // Helper function to format currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "₹0.00";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Helper function to format number
  const formatNumber = (num: number | undefined) => {
    if (num === undefined || num === null) return 0;
    return num.toLocaleString('en-IN');
  };

  // Helper function to calculate total earnings
  const getTotalEarnings = () => {
    if (!driver?.rideDetails?.totalEarnings || !Array.isArray(driver.rideDetails.totalEarnings)) {
      return 0;
    }
    return driver.rideDetails.totalEarnings.reduce((total, earning) => {
      return total + (earning?.amount || 0);
    }, 0);
  };

  // Check if commission is greater than 5000
  const shouldShowCommissionAlert = (commission: number | undefined) => {
    return commission && commission > 5000;
  };

  // Get wallet balance
  const walletBalance = driver?.wallet?.balance || 0;
  const adminCommission = driver?.adminCommission || 0;
  const totalRatings = driver?.totalRatings || 0;
  const totalEarnings = getTotalEarnings();
  const completedRides = driver?.rideDetails?.completedRides || 0;
  const cancelledRides = driver?.rideDetails?.cancelledRides || 0;
  const transactionCount = driver?.wallet?.transactions?.length || 0;
  const feedbackCount = driver?.feedbacks?.length || 0;

  return (
    <TabsContent value="account" className="p-4 md:p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                {driver?.name || "Driver Name"}
              </h3>
              <p className="text-sm text-gray-600">
                Joined: {driver?.joiningDate 
                  ? new Date(driver.joiningDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })
                  : "N/A"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
          {/* Wallet Balance Card */}
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-2 rounded-full">
                <Wallet className="h-5 w-5 text-green-600" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToTransactions?.(driver?._id)}
                disabled={transactionCount === 0}
                className="text-xs px-2 py-1"
              >
                <List className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Wallet Balance</h4>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {formatCurrency(walletBalance)}
              </p>
              <p className="text-xs text-gray-500">
                {transactionCount} transaction{transactionCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Admin Commission Card */}
          <div className={`bg-white p-4 md:p-6 rounded-xl border shadow-sm ${
            shouldShowCommissionAlert(adminCommission) 
              ? 'border-orange-300 bg-orange-50' 
              : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-full ${
                shouldShowCommissionAlert(adminCommission)
                  ? 'bg-orange-100'
                  : 'bg-blue-100'
              }`}>
                <TrendingUp className={`h-5 w-5 ${
                  shouldShowCommissionAlert(adminCommission)
                    ? 'text-orange-600'
                    : 'text-blue-600'
                }`} />
              </div>
              {shouldShowCommissionAlert(adminCommission) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSendCommissionMail?.(driver?._id, adminCommission)}
                  className="text-xs px-2 py-1 border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  <Mail className="h-3 w-3 mr-1" />
                  Mail
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Admin Commission</h4>
              <p className={`text-xl md:text-2xl font-bold ${
                shouldShowCommissionAlert(adminCommission)
                  ? 'text-orange-700'
                  : 'text-gray-900'
              }`}>
                {formatCurrency(adminCommission)}
              </p>
              {shouldShowCommissionAlert(adminCommission) && (
                <p className="text-xs text-orange-600 font-medium">
                  ⚠️ High commission amount
                </p>
              )}
            </div>
          </div>

          {/* Total Ratings Card */}
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateToFeedback?.(driver?._id)}
                disabled={feedbackCount === 0}
                className="text-xs px-2 py-1"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                View
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Total Ratings</h4>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {formatNumber(totalRatings)}
              </p>
              <p className="text-xs text-gray-500">
                {feedbackCount} feedback{feedbackCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Total Earnings Card */}
          <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <IndianRupee className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Earnings</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-600">Lifetime Earnings</h4>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {formatCurrency(totalEarnings)}
              </p>
              <p className="text-xs text-gray-500">
                From {completedRides} completed ride{completedRides !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Ride Statistics */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-gray-600" />
            Ride Statistics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-600">{formatNumber(completedRides)}</p>
              <p className="text-sm text-green-700">Completed</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-2xl font-bold text-red-600">{formatNumber(cancelledRides)}</p>
              <p className="text-sm text-red-700">Cancelled</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">
                {completedRides + cancelledRides > 0 
                  ? Math.round((completedRides / (completedRides + cancelledRides)) * 100)
                  : 0
                }%
              </p>
              <p className="text-sm text-blue-700">Success Rate</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-2xl font-bold text-purple-600">
                {totalRatings > 0 && completedRides > 0 
                  ? (totalRatings / completedRides).toFixed(1)
                  : '0.0'
                }
              </p>
              <p className="text-sm text-purple-700">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h4>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                driver?.accountStatus === 'Good' ? 'bg-green-500' :
                driver?.accountStatus === 'Warning' ? 'bg-yellow-500' :
                driver?.accountStatus === 'Blocked' ? 'bg-red-500' :
                driver?.accountStatus === 'Pending' ? 'bg-blue-500' :
                driver?.accountStatus === 'Incomplete' ? 'bg-gray-500' :
                'bg-gray-400'
              }`}></div>
              <span className={`font-medium ${
                driver?.accountStatus === 'Good' ? 'text-green-700' :
                driver?.accountStatus === 'Warning' ? 'text-yellow-700' :
                driver?.accountStatus === 'Blocked' ? 'text-red-700' :
                driver?.accountStatus === 'Pending' ? 'text-blue-700' :
                driver?.accountStatus === 'Incomplete' ? 'text-gray-700' :
                'text-gray-600'
              }`}>
                {driver?.accountStatus || 'Unknown'}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  driver?.isAvailable ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span>{driver?.isAvailable ? 'Available' : 'Offline'}</span>
              </div>
              <span>•</span>
              <span>ID: {driver?._id || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default DriverAccountTab;