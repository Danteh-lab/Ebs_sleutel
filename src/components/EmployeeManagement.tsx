import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, User, Calendar, Briefcase } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeManagementProps {
  employees: Employee[];
  onAddEmployee: (employee: Omit<Employee, 'id' | 'yearsOfService'>) => void;
  onUpdateEmployee: (id: string, employee: Omit<Employee, 'id' | 'yearsOfService'>) => void;
  onDeleteEmployee: (id: string) => void;
  onViewHistory: (employeeId: string) => void;
}

const EmployeeManagement: React.FC<EmployeeManagementProps> = ({
  employees,
  onAddEmployee,
  onUpdateEmployee,
  onDeleteEmployee,
  onViewHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    employeeNumber: '',
    type: 'CAO' as 'CAO' | 'MBV',
    startDate: '',
  });

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      onUpdateEmployee(editingEmployee.id, formData);
      setEditingEmployee(null);
    } else {
      onAddEmployee(formData);
    }
    setFormData({
      name: '',
      employeeNumber: '',
      type: 'CAO',
      startDate: '',
    });
    setShowAddForm(false);
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name,
      employeeNumber: employee.employeeNumber,
      type: employee.type,
      startDate: employee.startDate,
    });
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingEmployee(null);
    setFormData({
      name: '',
      employeeNumber: '',
      type: 'CAO',
      startDate: '',
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medewerker Beheer</h1>
          <p className="mt-2 text-gray-600">Beheer uw medewerkers en hun gegevens</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-orange-600 text-white rounded-lg hover:from-green-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Nieuwe Medewerker</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Zoek medewerkers op naam of personeelsnummer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-slideDown">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingEmployee ? 'Medewerker Bewerken' : 'Nieuwe Medewerker'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Naam</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Voer naam in"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Personeelsnummer</label>
              <input
                type="text"
                required
                value={formData.employeeNumber}
                onChange={(e) => setFormData({ ...formData, employeeNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="EMP001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'CAO' | 'MBV' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="CAO">CAO</option>
                <option value="MBV">MBV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Startdatum</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-orange-600 text-white rounded-lg hover:from-green-700 hover:to-orange-700 transition-all duration-200"
              >
                {editingEmployee ? 'Bijwerken' : 'Toevoegen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Employee List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Medewerkers ({filteredEmployees.length})
          </h2>
        </div>
        
        {filteredEmployees.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredEmployees.map((employee, index) => (
              <div
                key={employee.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200 animate-slideUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-green-500 to-orange-500 rounded-full p-3">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{employee.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {employee.employeeNumber}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.type === 'CAO' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {employee.type}
                        </span>
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {employee.yearsOfService} jaar dienst
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewHistory(employee.id)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      title="Bekijk geschiedenis"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(employee)}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                      title="Bewerken"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteEmployee(employee.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      title="Verwijderen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm ? 'Geen medewerkers gevonden' : 'Geen medewerkers toegevoegd'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeManagement;