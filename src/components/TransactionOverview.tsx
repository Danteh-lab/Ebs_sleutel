import React, { useState } from 'react';
import { Search, Filter, Calendar, Activity, User, Key, ArrowRight, ArrowLeft, Settings } from 'lucide-react';
import { Transaction, Employee, KeyItem } from '../types';

interface TransactionOverviewProps {
  transactions: Transaction[];
  employees: Employee[];
  keys: KeyItem[];
}

const TransactionOverview: React.FC<TransactionOverviewProps> = ({
  transactions,
  employees,
  keys,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<'all' | 'issue' | 'return'>('all');
  const [dateFilter, setDateFilter] = useState('all');

  const getDateRange = (filter: string) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (filter) {
      case 'today':
        return { start: startOfDay, end: new Date() };
      case 'week':
        const startOfWeek = new Date(startOfDay);
        startOfWeek.setDate(startOfDay.getDate() - 7);
        return { start: startOfWeek, end: new Date() };
      case 'month':
        const startOfMonth = new Date(startOfDay);
        startOfMonth.setDate(startOfDay.getDate() - 30);
        return { start: startOfMonth, end: new Date() };
      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    // Search filter
    const employee = employees.find(emp => emp.id === transaction.employeeId);
    const key = keys.find(k => k.id === transaction.keyId);
    const matchesSearch = 
      employee?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      key?.keyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(searchTerm.toLowerCase());

    // Action filter
    const matchesAction = actionFilter === 'all' || transaction.action === actionFilter;

    // Date filter
    const dateRange = getDateRange(dateFilter);
    const matchesDate = !dateRange || 
      (new Date(transaction.timestamp) >= dateRange.start && new Date(transaction.timestamp) <= dateRange.end);

    return matchesSearch && matchesAction && matchesDate;
  });

  const stats = {
    total: transactions.length,
    today: transactions.filter(t => 
      new Date(t.timestamp).toDateString() === new Date().toDateString()
    ).length,
    issued: transactions.filter(t => t.action === 'issue').length,
    returned: transactions.filter(t => t.action === 'return').length,
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactie Overzicht</h1>
          <p className="mt-2 text-gray-600">Bekijk en beheer alle sleutel transacties</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Totaal Transacties', value: stats.total, icon: Activity, color: 'from-green-500 to-green-600' },
          { title: 'Vandaag', value: stats.today, icon: Calendar, color: 'from-blue-500 to-blue-600' },
          { title: 'Uitgegeven', value: stats.issued, icon: ArrowRight, color: 'from-orange-500 to-orange-600' },
          { title: 'Ingeleverd', value: stats.returned, icon: ArrowLeft, color: 'from-purple-500 to-purple-600' },
        ].map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 animate-slideUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`bg-gradient-to-r ${stat.color} rounded-full p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Zoek op medewerker, sleutel of notities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value as 'all' | 'issue' | 'return')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Alle acties</option>
            <option value="issue">Uitgegeven</option>
            <option value="return">Ingeleverd</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Alle datums</option>
            <option value="today">Vandaag</option>
            <option value="week">Afgelopen week</option>
            <option value="month">Afgelopen maand</option>
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Transacties ({filteredTransactions.length})
          </h2>
        </div>
        
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction, index) => {
              const employee = employees.find(emp => emp.id === transaction.employeeId);
              const key = keys.find(k => k.id === transaction.keyId);
              
              return (
                <div
                  key={transaction.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 animate-slideUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${
                        transaction.action === 'issue' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {transaction.action === 'issue' ? (
                          <ArrowRight className="h-6 w-6" />
                        ) : (
                          <ArrowLeft className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {transaction.action === 'issue' ? 'Sleutel Uitgegeven' : 'Sleutel Ingeleverd'}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.action === 'issue' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {transaction.action === 'issue' ? 'Uitgegeven' : 'Ingeleverd'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span><strong>Medewerker:</strong> {employee?.name || 'Onbekend'} ({employee?.employeeNumber})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Key className="h-4 w-4" />
                            <span><strong>Sleutel:</strong> {key?.keyNumber || 'Onbekend'} (Type {key?.type})</span>
                          </div>
                          {transaction.handledBy && (
                            <div className="flex items-center space-x-2 md:col-span-2">
                              <Settings className="h-4 w-4" />
                              <span><strong>Afgehandeld door:</strong> {transaction.handledBy}</span>
                            </div>
                          )}
                        </div>
                        
                        {transaction.notes && (
                          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <strong>Notities:</strong> {transaction.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {new Date(transaction.timestamp).toLocaleDateString('nl-NL')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(transaction.timestamp).toLocaleTimeString('nl-NL', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || actionFilter !== 'all' || dateFilter !== 'all' 
                ? 'Geen transacties gevonden met de huidige filters' 
                : 'Nog geen transacties'
              }
            </p>
            {(searchTerm || actionFilter !== 'all' || dateFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setActionFilter('all');
                  setDateFilter('all');
                }}
                className="mt-2 text-sm text-green-600 hover:text-green-800"
              >
                Filters wissen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary Section */}
      {filteredTransactions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Samenvatting</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {filteredTransactions.filter(t => t.action === 'issue').length}
              </div>
              <div className="text-sm text-gray-600">Sleutels Uitgegeven</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {filteredTransactions.filter(t => t.action === 'return').length}
              </div>
              <div className="text-sm text-gray-600">Sleutels Ingeleverd</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {[...new Set(filteredTransactions.map(t => t.employeeId))].length}
              </div>
              <div className="text-sm text-gray-600">Unieke Medewerkers</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionOverview;