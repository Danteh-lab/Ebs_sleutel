import React, { useState, useEffect } from 'react';
import { Users, Key, Activity, LogOut, Settings, Search } from 'lucide-react';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import KeyManagement from './components/KeyManagement';
import TransactionOverview from './components/TransactionOverview';
import EmployeeDetail from './components/EmployeeDetail';
import { useAuth } from './hooks/useAuth';
import { useDatabase } from './hooks/useDatabase';

function App() {
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const {
    employees,
    keys,
    transactions,
    loading: dbLoading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addKey,
    updateKey,
    deleteKey,
    issueKey,
    returnKey,
  } = useDatabase();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const handleSignIn = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) throw error;
  };

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    const { error } = await signUp(email, password, fullName);
    if (error) throw error;
  };

  const handleLogout = async () => {
    await signOut();
    setActiveTab('dashboard');
  };

  const handleAddEmployee = async (employee: any) => {
    try {
      await addEmployee(employee);
    } catch (error) {
      console.error('Error adding employee:', error);
    }
  };

  const handleUpdateEmployee = async (id: string, employee: any) => {
    try {
      await updateEmployee(id, employee);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    try {
      await deleteEmployee(id);
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleAddKey = async (key: any) => {
    try {
      await addKey(key);
    } catch (error) {
      console.error('Error adding key:', error);
    }
  };

  const handleUpdateKey = async (id: string, key: any) => {
    try {
      await updateKey(id, key);
    } catch (error) {
      console.error('Error updating key:', error);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await deleteKey(id);
    } catch (error) {
      console.error('Error deleting key:', error);
    }
  };

  const handleIssueKey = async (keyId: string, employeeId: string, notes?: string) => {
    try {
      if (user) {
        await issueKey(keyId, employeeId, user.email || user.id, notes);
      }
    } catch (error) {
      console.error('Error issuing key:', error);
    }
  };

  const handleReturnKey = async (keyId: string, notes?: string) => {
    try {
      if (user) {
        await returnKey(keyId, user.email || user.id, notes);
      }
    } catch (error) {
      console.error('Error returning key:', error);
    }
  };

  const handleViewEmployeeHistory = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setActiveTab('employee-detail');
  };

  const handleBackToEmployees = () => {
    setSelectedEmployeeId(null);
    setActiveTab('employees');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthForm onSignIn={handleSignIn} onSignUp={handleSignUp} />;
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
                <p className="text-sm text-gray-500">
                  Welkom, {user.user_metadata?.full_name || user.email}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500">
                {user.email}
              </div>
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
            {dbLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Gegevens laden...</p>
              </div>
            ) : (
              <>
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
                    onAddEmployee={handleAddEmployee}
                    onUpdateEmployee={handleUpdateEmployee}
                    onDeleteEmployee={handleDeleteEmployee}
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
                    onAddKey={handleAddKey}
                    onUpdateKey={handleUpdateKey}
                    onDeleteKey={handleDeleteKey}
                    onIssueKey={handleIssueKey}
                    onReturnKey={handleReturnKey}
                  />
                )}
                {activeTab === 'transactions' && (
                  <TransactionOverview
                    transactions={transactions}
                    employees={employees}
                    keys={keys}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;