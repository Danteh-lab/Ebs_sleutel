import React, { useState, useEffect } from 'react';
import { Users, Key, Activity, LogOut, Settings, Search } from 'lucide-react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import KeyManagement from './components/KeyManagement';
import TransactionOverview from './components/TransactionOverview';
import EmployeeDetail from './components/EmployeeDetail';
import { Employee, KeyItem, Transaction } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Jan Janssen',
      employeeNumber: 'EMP001',
      type: 'CAO',
      startDate: '2020-01-15',
      yearsOfService: 4,
    },
    {
      id: '2',
      name: 'Maria van den Berg',
      employeeNumber: 'EMP002',
      type: 'MBV',
      startDate: '2019-06-10',
      yearsOfService: 5,
    },
    {
      id: '3',
      name: 'Pieter de Vries',
      employeeNumber: 'EMP003',
      type: 'CAO',
      startDate: '2022-03-20',
      yearsOfService: 2,
    },
  ]);

  const [keys, setKeys] = useState<KeyItem[]>([
    {
      id: '1',
      keyNumber: 'A001',
      type: 'A',
      length: 'kort',
      status: 'available',
      opmerking: 'Hoofdingang',
    },
    {
      id: '2',
      keyNumber: 'B001',
      type: 'B',
      length: 'lang',
      status: 'issued',
      assignedTo: '1',
      opmerking: 'Kantoor verdieping 2',
    },
    {
      id: '3',
      keyNumber: 'C001',
      type: 'C',
      length: 'kort',
      status: 'available',
      opmerking: 'Magazijn',
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      employeeId: '1',
      keyId: '2',
      action: 'issue',
      timestamp: new Date('2024-01-15T09:30:00'),
      notes: 'Nieuwe medewerker onboarding',
    },
    {
      id: '2',
      employeeId: '2',
      keyId: '1',
      action: 'return',
      timestamp: new Date('2024-01-14T16:45:00'),
      notes: 'Einde dienst',
    },
  ]);

  useEffect(() => {
    // Calculate years of service on component mount and periodically
    const updateYearsOfService = () => {
      setEmployees(prevEmployees =>
        prevEmployees.map(employee => ({
          ...employee,
          yearsOfService: new Date().getFullYear() - new Date(employee.startDate).getFullYear(),
        }))
      );
    };
    updateYearsOfService();
  }, []);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setActiveTab('dashboard');
  };

  const addEmployee = (employee: Omit<Employee, 'id' | 'yearsOfService'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: Date.now().toString(),
      yearsOfService: new Date().getFullYear() - new Date(employee.startDate).getFullYear(),
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, updatedEmployee: Omit<Employee, 'id' | 'yearsOfService'>) => {
    setEmployees(employees.map(emp => 
      emp.id === id 
        ? {
            ...updatedEmployee,
            id,
            yearsOfService: new Date().getFullYear() - new Date(updatedEmployee.startDate).getFullYear(),
          }
        : emp
    ));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    // Also return all keys assigned to this employee
    setKeys(keys.map(key => 
      key.assignedTo === id 
        ? { ...key, status: 'available', assignedTo: undefined }
        : key
    ));
  };

  const addKey = (key: Omit<KeyItem, 'id' | 'status'>) => {
    const newKey: KeyItem = {
      ...key,
      id: Date.now().toString(),
      status: 'available',
    };
    setKeys([...keys, newKey]);
  };

  const updateKey = (id: string, updatedKey: Omit<KeyItem, 'id'>) => {
    setKeys(keys.map(key => key.id === id ? { ...updatedKey, id } : key));
  };

  const deleteKey = (id: string) => {
    setKeys(keys.filter(key => key.id !== id));
  };

  const issueKey = (keyId: string, employeeId: string, notes?: string) => {
    setKeys(keys.map(key => 
      key.id === keyId 
        ? { ...key, status: 'issued', assignedTo: employeeId }
        : key
    ));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      employeeId,
      keyId,
      action: 'issue',
      timestamp: new Date(),
      notes,
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const handleViewEmployeeHistory = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setActiveTab('employee-detail');
  };

  const handleBackToEmployees = () => {
    setSelectedEmployeeId(null);
    setActiveTab('employees');
  };

  const returnKey = (keyId: string, notes?: string) => {
    const key = keys.find(k => k.id === keyId);
    if (key && key.assignedTo) {
      setKeys(keys.map(k => 
        k.id === keyId 
          ? { ...k, status: 'available', assignedTo: undefined }
          : k
      ));

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        employeeId: key.assignedTo,
        keyId,
        action: 'return',
        timestamp: new Date(),
        notes,
      };
      setTransactions([newTransaction, ...transactions]);
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Key className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">EBS Key Management</h1>
                <p className="text-sm text-gray-500">Welkom, {currentUser}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Uitloggen</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-8 px-4">
            <ul className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Activity },
                { id: 'employees', label: 'Medewerkers', icon: Users },
                { id: 'keys', label: 'Sleutelbeheer', icon: Key },
                { id: 'transactions', label: 'Transacties', icon: Search },
              ].map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === id
                        ? 'bg-gradient-to-r from-green-500 to-orange-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard 
                employees={employees} 
                keys={keys} 
                transactions={transactions} 
                onAddKey={() => setActiveTab('keys')}
                onIssueKey={() => setActiveTab('keys')}
              />
            )}
            {activeTab === 'employees' && (
              <EmployeeManagement
                employees={employees}
                onAddEmployee={addEmployee}
                onUpdateEmployee={updateEmployee}
                onDeleteEmployee={deleteEmployee}
                onViewHistory={handleViewEmployeeHistory}
              />
            )}
            {activeTab === 'employee-detail' && selectedEmployeeId && (
              <EmployeeDetail
                employee={employees.find(emp => emp.id === selectedEmployeeId)!}
                transactions={transactions.filter(t => t.employeeId === selectedEmployeeId)}
                keys={keys}
                onBack={handleBackToEmployees}
              />
            )}
            {activeTab === 'keys' && (
              <KeyManagement
                keys={keys}
                employees={employees}
                onAddKey={addKey}
                onUpdateKey={updateKey}
                onDeleteKey={deleteKey}
                onIssueKey={issueKey}
                onReturnKey={returnKey}
              />
            )}
            {activeTab === 'transactions' && (
              <TransactionOverview
                transactions={transactions}
                employees={employees}
                keys={keys}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;