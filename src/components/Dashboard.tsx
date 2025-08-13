import React from 'react';
import { Users, Key, Activity, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Employee, KeyItem, Transaction } from '../types';

interface DashboardProps {
  employees: Employee[];
  keys: KeyItem[];
  transactions: Transaction[];
  onAddKey?: () => void;
  onIssueKey?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ employees, keys, transactions, onAddKey, onIssueKey }) => {
  const availableKeys = keys.filter(key => key.status === 'available').length;
  const issuedKeys = keys.filter(key => key.status === 'issued').length;
  const recentTransactions = transactions.slice(0, 5);
  const todayTransactions = transactions.filter(t => 
    new Date(t.timestamp).toDateString() === new Date().toDateString()
  ).length;

  const stats = [
    {
      title: 'Totaal Medewerkers',
      value: employees.length,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Beschikbare Sleutels',
      value: availableKeys,
      icon: Key,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Uitgegeven Sleutels',
      value: issuedKeys,
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: "Transacties Vandaag",
      value: todayTransactions,
      icon: Activity,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Overzicht van uw sleutelbeheer systeem</p>
        </div>
        <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>{new Date().toLocaleDateString('nl-NL', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} rounded-full p-3`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
            <div className="mt-4">
              <div className={`h-2 bg-gradient-to-r ${stat.color} rounded-full opacity-20`}></div>
              <div 
                className={`h-2 bg-gradient-to-r ${stat.color} rounded-full -mt-2 transition-all duration-1000`}
                style={{ width: `${Math.min((stat.value / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recente Transacties</h2>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => {
                const employee = employees.find(emp => emp.id === transaction.employeeId);
                const key = keys.find(k => k.id === transaction.keyId);
                
                return (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.action === 'issue' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        <Key className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {employee?.name} - {key?.keyNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.action === 'issue' ? 'Uitgegeven' : 'Ingeleverd'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleTimeString('nl-NL', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Geen recente transacties</p>
              </div>
            )}
          </div>
        </div>

        {/* Key Status Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Sleutel Status</h2>
            <Key className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-6">
            {/* Key Type Distribution */}
            {['A', 'B', 'C'].map(type => {
              const typeKeys = keys.filter(key => key.type === type);
              const availableTypeKeys = typeKeys.filter(key => key.status === 'available');
              const percentage = typeKeys.length > 0 ? (availableTypeKeys.length / typeKeys.length) * 100 : 0;
              
              return (
                <div key={type}>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Type {type} Sleutels</span>
                    <span className="text-sm text-gray-500">
                      {availableTypeKeys.length} / {typeKeys.length} beschikbaar
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            {/* Quick Actions */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Snelle Acties</h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={onAddKey}
                  className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors duration-200 text-sm font-medium"
                >
                  Nieuwe Sleutel
                </button>
                <button 
                  onClick={onIssueKey}
                  className="p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors duration-200 text-sm font-medium"
                >
                  Sleutel Uitgeven
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Medewerker Overzicht</h2>
          <Users className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {employees.filter(emp => emp.type === 'CAO').length}
            </div>
            <div className="text-sm text-gray-600">CAO Medewerkers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {employees.filter(emp => emp.type === 'MBV').length}
            </div>
            <div className="text-sm text-gray-600">MBV Medewerkers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {Math.round(employees.reduce((acc, emp) => acc + emp.yearsOfService, 0) / employees.length) || 0}
            </div>
            <div className="text-sm text-gray-600">Gem. Dienstjaren</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;