import React from 'react';
import { ArrowLeft, User, Key, Calendar, Activity, ArrowRight, ArrowLeftIcon } from 'lucide-react';
import { Employee, Transaction, KeyItem } from '../types';

interface EmployeeDetailProps {
  employee: Employee;
  transactions: Transaction[];
  keys: KeyItem[];
  onBack: () => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  employee,
  transactions,
  keys,
  onBack,
}) => {
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const stats = {
    totalTransactions: transactions.length,
    keysIssued: transactions.filter(t => t.action === 'issue').length,
    keysReturned: transactions.filter(t => t.action === 'return').length,
    currentKeys: keys.filter(k => k.assignedTo === employee.id).length,
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header with Back Button */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Terug naar Medewerkers</span>
        </button>
      </div>

      {/* Employee Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-6">
          <div className="bg-gradient-to-r from-green-500 to-orange-500 rounded-full p-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{employee.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {employee.employeeNumber}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                employee.type === 'CAO' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {employee.type}
              </span>
              <span className="inline-flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                {employee.yearsOfService} jaar dienst
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Totaal Transacties', value: stats.totalTransactions, icon: Activity, color: 'from-green-500 to-green-600' },
          { title: 'Sleutels Ontvangen', value: stats.keysIssued, icon: ArrowRight, color: 'from-blue-500 to-blue-600' },
          { title: 'Sleutels Ingeleverd', value: stats.keysReturned, icon: ArrowLeftIcon, color: 'from-orange-500 to-orange-600' },
          { title: 'Huidige Sleutels', value: stats.currentKeys, icon: Key, color: 'from-purple-500 to-purple-600' },
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

      {/* Current Keys */}
      {stats.currentKeys > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Huidige Sleutels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {keys
              .filter(key => key.assignedTo === employee.id)
              .map(key => (
                <div key={key.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-green-500 to-orange-500 rounded-full p-2">
                      <Key className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{key.keyNumber}</p>
                      <p className="text-sm text-gray-500">Type {key.type} - {key.length}</p>
                      {key.opmerking && (
                        <p className="text-xs text-gray-400 mt-1">{key.opmerking}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Transactie Geschiedenis</h2>
        
        {sortedTransactions.length > 0 ? (
          <div className="space-y-4">
            {sortedTransactions.map((transaction, index) => {
              const key = keys.find(k => k.id === transaction.keyId);
              
              return (
                <div
                  key={transaction.id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 animate-slideUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`p-3 rounded-full ${
                    transaction.action === 'issue' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {transaction.action === 'issue' ? (
                      <ArrowRight className="h-5 w-5" />
                    ) : (
                      <ArrowLeftIcon className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        {transaction.action === 'issue' ? 'Sleutel Ontvangen' : 'Sleutel Ingeleverd'}
                      </h3>
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
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center space-x-1">
                        <Key className="h-4 w-4" />
                        <span><strong>Sleutel:</strong> {key?.keyNumber || 'Onbekend'}</span>
                      </div>
                      {key && (
                        <span className="text-gray-500">Type {key.type} - {key.length}</span>
                      )}
                    </div>
                    
                    {transaction.notes && (
                      <div className="mt-2 p-3 bg-white rounded border border-gray-200">
                        <p className="text-sm text-gray-700">
                          <strong>Notities:</strong> {transaction.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Geen transacties gevonden voor deze medewerker</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetail;