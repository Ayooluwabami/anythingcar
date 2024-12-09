import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, CreditCard, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface PaymentStats {
  totalRevenue: number;
  successRate: number;
  averageAmount: number;
  failedTransactions: number;
  recentPayments: Array<{
    date: string;
    amount: number;
    status: string;
  }>;
  paymentMethods: {
    card: number;
    paystack: number;
    flutterwave: number;
  };
}

export function PaymentAnalytics() {
  const [stats, setStats] = useState<PaymentStats>({
    totalRevenue: 0,
    successRate: 0,
    averageAmount: 0,
    failedTransactions: 0,
    recentPayments: [],
    paymentMethods: {
      card: 0,
      paystack: 0,
      flutterwave: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentStats();
  }, []);

  const fetchPaymentStats = async () => {
    try {
      const response = await axios.get('/api/admin/payment-stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching payment stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<DollarSign className="h-8 w-8 text-green-600" />}
          title="Total Revenue"
          value={`₦${stats.totalRevenue.toLocaleString()}`}
          trend="+15%"
        />
        <StatCard
          icon={<TrendingUp className="h-8 w-8 text-blue-600" />}
          title="Success Rate"
          value={`${stats.successRate}%`}
          trend="+5%"
        />
        <StatCard
          icon={<CreditCard className="h-8 w-8 text-purple-600" />}
          title="Average Amount"
          value={`₦${stats.averageAmount.toLocaleString()}`}
          trend="+8%"
        />
        <StatCard
          icon={<AlertCircle className="h-8 w-8 text-red-600" />}
          title="Failed Transactions"
          value={stats.failedTransactions.toString()}
          trend="-2%"
          trendDown
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Payment Trends</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.recentPayments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="amount" fill="#3b82f6" name="Amount (₦)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Payment Methods Distribution</h2>
          <div className="space-y-4">
            {Object.entries(stats.paymentMethods).map(([method, count]) => (
              <div key={method} className="flex items-center justify-between">
                <span className="capitalize">{method}</span>
                <div className="flex items-center">
                  <div className="w-48 h-2 bg-gray-200 rounded-full mr-3">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${(count / Object.values(stats.paymentMethods).reduce((a, b) => a + b, 0)) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {stats.recentPayments.slice(0, 5).map((payment, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">₦{payment.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{payment.date}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    payment.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend, trendDown }: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendDown?: boolean;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        {icon}
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={trendDown ? 'text-red-600' : 'text-green-600'}>
          {trend}
        </span>
        <span className="text-gray-600 ml-2">vs last month</span>
      </div>
    </div>
  );
}