import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Employee, KeyItem, Transaction } from '../types';

export const useDatabase = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [keys, setKeys] = useState<KeyItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (employeesError) throw employeesError;

      // Fetch keys
      const { data: keysData, error: keysError } = await supabase
        .from('keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (keysError) throw keysError;

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (transactionsError) throw transactionsError;

      // Transform data to match frontend types
      setEmployees(employeesData?.map(emp => ({
        id: emp.id,
        name: emp.name,
        employeeNumber: emp.employee_number,
        type: emp.type,
        startDate: emp.start_date,
        yearsOfService: emp.years_of_service,
      })) || []);

      setKeys(keysData?.map(key => ({
        id: key.id,
        keyNumber: key.key_number,
        type: key.type,
        length: key.length,
        status: key.status,
        assignedTo: key.assigned_to,
        opmerking: key.opmerking,
      })) || []);

      setTransactions(transactionsData?.map(trans => ({
        id: trans.id,
        employeeId: trans.employee_id,
        keyId: trans.key_id,
        action: trans.action,
        timestamp: new Date(trans.timestamp),
        notes: trans.notes,
        handledBy: trans.handled_by,
      })) || []);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Employee operations
  const addEmployee = async (employee: Omit<Employee, 'id' | 'yearsOfService'>) => {
    const yearsOfService = new Date().getFullYear() - new Date(employee.startDate).getFullYear();
    
    const { data, error } = await supabase
      .from('employees')
      .insert({
        name: employee.name,
        employee_number: employee.employeeNumber,
        type: employee.type,
        start_date: employee.startDate,
        years_of_service: yearsOfService,
      })
      .select()
      .single();

    if (error) throw error;
    
    const newEmployee: Employee = {
      id: data.id,
      name: data.name,
      employeeNumber: data.employee_number,
      type: data.type,
      startDate: data.start_date,
      yearsOfService: data.years_of_service,
    };

    setEmployees(prev => [newEmployee, ...prev]);
    return newEmployee;
  };

  const updateEmployee = async (id: string, employee: Omit<Employee, 'id' | 'yearsOfService'>) => {
    const yearsOfService = new Date().getFullYear() - new Date(employee.startDate).getFullYear();
    
    const { data, error } = await supabase
      .from('employees')
      .update({
        name: employee.name,
        employee_number: employee.employeeNumber,
        type: employee.type,
        start_date: employee.startDate,
        years_of_service: yearsOfService,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const updatedEmployee: Employee = {
      id: data.id,
      name: data.name,
      employeeNumber: data.employee_number,
      type: data.type,
      startDate: data.start_date,
      yearsOfService: data.years_of_service,
    };

    setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
    return updatedEmployee;
  };

  const deleteEmployee = async (id: string) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Return all keys assigned to this employee
    await supabase
      .from('keys')
      .update({ status: 'available', assigned_to: null })
      .eq('assigned_to', id);

    setEmployees(prev => prev.filter(emp => emp.id !== id));
    setKeys(prev => prev.map(key => 
      key.assignedTo === id 
        ? { ...key, status: 'available', assignedTo: undefined }
        : key
    ));
  };

  // Key operations
  const addKey = async (key: Omit<KeyItem, 'id' | 'status'>) => {
    const { data, error } = await supabase
      .from('keys')
      .insert({
        key_number: key.keyNumber,
        type: key.type,
        length: key.length,
        status: 'available',
        opmerking: key.opmerking,
      })
      .select()
      .single();

    if (error) throw error;

    const newKey: KeyItem = {
      id: data.id,
      keyNumber: data.key_number,
      type: data.type,
      length: data.length,
      status: data.status,
      assignedTo: data.assigned_to,
      opmerking: data.opmerking,
    };

    setKeys(prev => [newKey, ...prev]);
    return newKey;
  };

  const updateKey = async (id: string, key: Omit<KeyItem, 'id'>) => {
    const { data, error } = await supabase
      .from('keys')
      .update({
        key_number: key.keyNumber,
        type: key.type,
        length: key.length,
        status: key.status,
        assigned_to: key.assignedTo,
        opmerking: key.opmerking,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const updatedKey: KeyItem = {
      id: data.id,
      keyNumber: data.key_number,
      type: data.type,
      length: data.length,
      status: data.status,
      assignedTo: data.assigned_to,
      opmerking: data.opmerking,
    };

    setKeys(prev => prev.map(k => k.id === id ? updatedKey : k));
    return updatedKey;
  };

  const deleteKey = async (id: string) => {
    const { error } = await supabase
      .from('keys')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setKeys(prev => prev.filter(key => key.id !== id));
  };

  // Transaction operations
  const issueKey = async (keyId: string, employeeId: string, handledBy: string, notes?: string) => {
    // Update key status
    await supabase
      .from('keys')
      .update({ status: 'issued', assigned_to: employeeId })
      .eq('id', keyId);

    // Create transaction
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        employee_id: employeeId,
        key_id: keyId,
        action: 'issue',
        timestamp: new Date().toISOString(),
        notes,
        handled_by: handledBy,
      })
      .select()
      .single();

    if (error) throw error;

    // Update local state
    setKeys(prev => prev.map(key => 
      key.id === keyId 
        ? { ...key, status: 'issued', assignedTo: employeeId }
        : key
    ));

    const newTransaction: Transaction = {
      id: data.id,
      employeeId: data.employee_id,
      keyId: data.key_id,
      action: data.action,
      timestamp: new Date(data.timestamp),
      notes: data.notes,
      handledBy: data.handled_by,
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  const returnKey = async (keyId: string, handledBy: string, notes?: string) => {
    const key = keys.find(k => k.id === keyId);
    if (!key || !key.assignedTo) return;

    // Update key status
    await supabase
      .from('keys')
      .update({ status: 'available', assigned_to: null })
      .eq('id', keyId);

    // Create transaction
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        employee_id: key.assignedTo,
        key_id: keyId,
        action: 'return',
        timestamp: new Date().toISOString(),
        notes,
        handled_by: handledBy,
      })
      .select()
      .single();

    if (error) throw error;

    // Update local state
    setKeys(prev => prev.map(k => 
      k.id === keyId 
        ? { ...k, status: 'available', assignedTo: undefined }
        : k
    ));

    const newTransaction: Transaction = {
      id: data.id,
      employeeId: data.employee_id,
      keyId: data.key_id,
      action: data.action,
      timestamp: new Date(data.timestamp),
      notes: data.notes,
      handledBy: data.handled_by,
    };

    setTransactions(prev => [newTransaction, ...prev]);
    return newTransaction;
  };

  return {
    employees,
    keys,
    transactions,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addKey,
    updateKey,
    deleteKey,
    issueKey,
    returnKey,
    refetch: fetchData,
  };
};