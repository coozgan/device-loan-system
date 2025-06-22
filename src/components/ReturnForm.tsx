import React, { useState, useEffect } from 'react';
import { User, Mail, Package, CheckCircle, Loader2 } from 'lucide-react';
import { Device, ReturnFormData } from '../types/device';
import { fetchDevices, returnDevice, getBorrowedDevices } from '../services/api';

export const ReturnForm: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<ReturnFormData>({
    name: '',
    email: '',
    deviceName: ''
  });

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const data = await fetchDevices();
      setDevices(data);
    } catch (error) {
      console.error('Failed to load devices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show all borrowed devices once both name and email are filled
  const borrowedDevices = formData.name && formData.email 
    ? getBorrowedDevices(devices)
    : [];

  const handleInputChange = (field: keyof ReturnFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'name' || field === 'email' ? { deviceName: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.deviceName) return;

    setSubmitting(true);
    try {
      await returnDevice(formData.deviceName);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        deviceName: ''
      });
      await loadDevices(); // Refresh device list
    } catch (error) {
      console.error('Failed to return device:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Device Returned Successfully!</h3>
        <p className="text-gray-600 mb-6">Thank you for returning the device in good condition.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-[#1C4081] text-white px-6 py-2 rounded-lg hover:bg-[#163666] transition-colors"
        >
          Return Another Device
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#1C4081]" />
        <span className="ml-2 text-gray-600">Loading devices...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 mr-2" />
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C4081] focus:border-transparent transition-colors"
          placeholder="Juan Dela Cruz"
        />
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 mr-2" />
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C4081] focus:border-transparent transition-colors"
          placeholder="juandelacruz30@ics.edu.sg"
        />
      </div>

      {formData.name && formData.email && (
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 mr-2" />
            Device Name to Return
          </label>
          <select
            value={formData.deviceName}
            onChange={(e) => handleInputChange('deviceName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1C4081] focus:border-transparent transition-colors"
          >
            <option value="">Select a device to return</option>
            {borrowedDevices.map(device => (
              <option key={device.AssetID} value={device.AssetID}>
                {device.AssetID} ({device.DeviceType}) - Borrowed by: {device.Name}
              </option>
            ))}
          </select>
          {borrowedDevices.length === 0 && (
            <p className="text-yellow-600 text-sm mt-1">
              No borrowed devices found in the system.
            </p>
          )}
        </div>
      )}

      {(!formData.name || !formData.email) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            Please enter both your name and email to see available devices for return.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !formData.deviceName}
        className="w-full bg-[#1C4081] text-white py-3 px-4 rounded-lg hover:bg-[#163666] focus:ring-2 focus:ring-[#1C4081] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          'Return Device'
        )}
      </button>
    </form>
  );
};