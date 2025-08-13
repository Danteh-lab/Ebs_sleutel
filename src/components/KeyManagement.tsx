import React, { useState } from 'react';
import { Plus, Search, Key, User, ArrowRight, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { KeyItem, Employee } from '../types';

interface KeyManagementProps {
  keys: KeyItem[];
  employees: Employee[];
  onAddKey: (key: Omit<KeyItem, 'id' | 'status'>) => void;
  onUpdateKey: (id: string, key: Omit<KeyItem, 'id'>) => void;
  onDeleteKey: (id: string) => void;
  onIssueKey: (keyId: string, employeeId: string, notes?: string) => void;
  onReturnKey: (keyId: string, notes?: string) => void;
}

const KeyManagement: React.FC<KeyManagementProps> = ({
  keys,
  employees,
  onAddKey,
  onUpdateKey,
  onDeleteKey,
  onIssueKey,
  onReturnKey,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'issued'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingKey, setEditingKey] = useState<KeyItem | null>(null);
  const [showIssueModal, setShowIssueModal] = useState<KeyItem | null>(null);
  const [showReturnModal, setShowReturnModal] = useState<KeyItem | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [transactionNotes, setTransactionNotes] = useState('');
  const [formData, setFormData] = useState({
    keyNumber: '',
    type: 'A' as 'A' | 'B' | 'C',
    length: 'kort' as 'kort' | 'lang',
    opmerking: '',
  });

  const filteredKeys = keys.filter(key => {
    const matchesSearch = key.keyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         key.opmerking?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKey) {
      onUpdateKey(editingKey.id, { ...formData, status: editingKey.status, assignedTo: editingKey.assignedTo });
      setEditingKey(null);
    } else {
      onAddKey(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      keyNumber: '',
      type: 'A',
      length: 'kort',
      opmerking: '',
    });
    setShowAddForm(false);
  };

  const handleEdit = (key: KeyItem) => {
    setEditingKey(key);
    setFormData({
      keyNumber: key.keyNumber,
      type: key.type,
      length: key.length,
      opmerking: key.opmerking || '',
    });
    setShowAddForm(true);
  };

  const handleIssue = (key: KeyItem) => {
    setShowIssueModal(key);
    setSelectedEmployee('');
    setTransactionNotes('');
  };

  const handleReturn = (key: KeyItem) => {
    setShowReturnModal(key);
    setTransactionNotes('');
  };

  const confirmIssue = () => {
    if (showIssueModal && selectedEmployee) {
      onIssueKey(showIssueModal.id, selectedEmployee, transactionNotes || undefined);
      setShowIssueModal(null);
      setSelectedEmployee('');
      setTransactionNotes('');
    }
  };

  const confirmReturn = () => {
    if (showReturnModal) {
      onReturnKey(showReturnModal.id, transactionNotes || undefined);
      setShowReturnModal(null);
      setTransactionNotes('');
    }
  };

  const getKeyStatusColor = (status: string) => {
    return status === 'available' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-orange-100 text-orange-800';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'A': return 'bg-blue-100 text-blue-800';
      case 'B': return 'bg-purple-100 text-purple-800';
      case 'C': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sleutel Beheer</h1>
          <p className="mt-2 text-gray-600">Beheer sleutels en hun status</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-orange-600 text-white rounded-lg hover:from-green-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105 shadow-md"
        >
          <Plus className="h-4 w-4" />
          <span>Nieuwe Sleutel</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Zoek sleutels op nummer of opmerking..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'available' | 'issued')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">Alle statussen</option>
            <option value="available">Beschikbaar</option>
            <option value="issued">Uitgegeven</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-slideDown">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingKey ? 'Sleutel Bewerken' : 'Nieuwe Sleutel'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sleutelnummer</label>
              <input
                type="text"
                required
                value={formData.keyNumber}
                onChange={(e) => setFormData({ ...formData, keyNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="A001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'A' | 'B' | 'C' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lengte</label>
              <select
                value={formData.length}
                onChange={(e) => setFormData({ ...formData, length: e.target.value as 'kort' | 'lang' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="kort">Kort</option>
                <option value="lang">Lang</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opmerking</label>
              <input
                type="text"
                value={formData.opmerking}
                onChange={(e) => setFormData({ ...formData, opmerking: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Beschrijving..."
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setEditingKey(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-orange-600 text-white rounded-lg hover:from-green-700 hover:to-orange-700 transition-all duration-200"
              >
                {editingKey ? 'Bijwerken' : 'Toevoegen'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Key List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Sleutels ({filteredKeys.length})
          </h2>
        </div>
        
        {filteredKeys.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredKeys.map((key, index) => {
              const assignedEmployee = key.assignedTo ? employees.find(emp => emp.id === key.assignedTo) : null;
              
              return (
                <div
                  key={key.id}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 animate-slideUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-r from-green-500 to-orange-500 rounded-full p-3">
                        <Key className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{key.keyNumber}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(key.type)}`}>
                            Type {key.type}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {key.length}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getKeyStatusColor(key.status)}`}>
                            {key.status === 'available' ? 'Beschikbaar' : 'Uitgegeven'}
                          </span>
                        </div>
                        {key.opmerking && (
                          <p className="text-sm text-gray-600 mb-1">{key.opmerking}</p>
                        )}
                        {assignedEmployee && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <User className="h-4 w-4" />
                            <span>Uitgegeven aan: {assignedEmployee.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {key.status === 'available' ? (
                        <button
                          onClick={() => handleIssue(key)}
                          className="flex items-center space-x-1 px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-all duration-200"
                        >
                          <ArrowRight className="h-4 w-4" />
                          <span>Uitgeven</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReturn(key)}
                          className="flex items-center space-x-1 px-3 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 rounded-lg transition-all duration-200"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          <span>Inleveren</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(key)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteKey(key.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Key className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' ? 'Geen sleutels gevonden' : 'Geen sleutels toegevoegd'}
            </p>
          </div>
        )}
      </div>

      {/* Issue Key Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slideUp">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sleutel Uitgeven: {showIssueModal.keyNumber}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medewerker</label>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecteer medewerker</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.employeeNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notities (optioneel)</label>
                <textarea
                  value={transactionNotes}
                  onChange={(e) => setTransactionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Extra informatie..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowIssueModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Annuleren
              </button>
              <button
                onClick={confirmIssue}
                disabled={!selectedEmployee}
                className="px-6 py-2 bg-gradient-to-r from-green-600 to-orange-600 text-white rounded-lg hover:from-green-700 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Uitgeven
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Key Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-lg max-w-md w-full p-6 animate-slideUp">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Sleutel Inleveren: {showReturnModal.keyNumber}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notities (optioneel)</label>
                <textarea
                  value={transactionNotes}
                  onChange={(e) => setTransactionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Reden voor inlevering..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReturnModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Annuleren
              </button>
              <button
                onClick={confirmReturn}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-200"
              >
                Inleveren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeyManagement;