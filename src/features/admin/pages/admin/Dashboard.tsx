import React from 'react';
import AdminLayout from '@/features/admin/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Users, Truck, Gift, BarChart3 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const statsCards = [
    { title: 'Total Users', value: '3,456', icon: <Users className="h-8 w-8 text-emerald" /> },
    { title: 'Total Drivers', value: '842', icon: <Truck className="h-8 w-8 text-wasabi" /> },
    { title: 'Active Offers', value: '24', icon: <Gift className="h-8 w-8 text-egyptian" /> },
    { title: 'Total Rides', value: '12,456', icon: <BarChart3 className="h-8 w-8 text-noir" /> },
  ];

  return (
    <AdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-10">
          {statsCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recent activity to display.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No performance data to display.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;