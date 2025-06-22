import React, { useState, useEffect } from 'react';
import { Package, User, Mail, MessageCircle, Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { Device, BorrowFormData } from '../types/device';
import { fetchDevices, borrowDevice, getAvailableDevices } from '../services/api';
import { getEmailError, getRequiredFieldError } from '../utils/validation';

export const BorrowForm: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<BorrowFormData>({
    name: '',
    email: '',
    reason: '',
    customReason: '',
    deviceType: '',
    deviceName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const reasons = [
    { value: 'Forgot at home', label: 'Forgot at home' },
    { value: 'Lost device', label: 'Lost device' },
    { value: 'others', label: 'Others' }
  ];

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

  const availableDevices = getAvailableDevices(devices);
  const deviceTypes = [...new Set(availableDevices.map(device => device.DeviceType))];
  const filteredDevices = formData.deviceType 
    ? availableDevices.filter(device => device.DeviceType === formData.deviceType)
    : [];

  const handleInputChange = (field: keyof BorrowFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'deviceType' ? { deviceName: '' } : {})
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const nameError = getRequiredFieldError(formData.name, 'Name');
    if (nameError) newErrors.name = nameError;

    const emailError = getEmailError(formData.email);
    if (emailError) newErrors.email = emailError;

    const reasonError = getRequiredFieldError(formData.reason, 'Reason');
    if (reasonError) newErrors.reason = reasonError;

    if (formData.reason === 'others') {
      const customReasonError = getRequiredFieldError(formData.customReason || '', 'Custom reason');
      if (customReasonError) newErrors.customReason = customReasonError;
    }

    const deviceTypeError = getRequiredFieldError(formData.deviceType, 'Device type');
    if (deviceTypeError) newErrors.deviceType = deviceTypeError;

    const deviceNameError = getRequiredFieldError(formData.deviceName, 'Device name');
    if (deviceNameError) newErrors.deviceName = deviceNameError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await borrowDevice(formData.deviceName, formData.name, formData.email, formData.reason, formData.customReason);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        reason: '',
        customReason: '',
        deviceType: '',
        deviceName: ''
      });
      await loadDevices(); // Refresh device list
    } catch (error) {
      console.error('Failed to borrow device:', error);
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Device Borrowed Successfully!</h3>
        <p className="text-gray-600 mb-6">Your request has been processed. Please take care of the device.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="bg-[#CE483F] text-white px-6 py-2 rounded-lg hover:bg-[#b83e36] transition-colors"
        >
          Borrow Another Device
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#CE483F]" />
        <span className="ml-2 text-gray-600">Loading devices...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <User className="w-4 h-4 mr-2" />
          Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#CE483F] focus:border-transparent transition-colors ${
            errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Juan Dela Cruz"
        />
        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Mail className="w-4 h-4 mr-2" />
          Email Address *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#CE483F] focus:border-transparent transition-colors ${
            errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="juandelacruz30@ics.edu.sg"
        />
        {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <MessageCircle className="w-4 h-4 mr-2" />
          Reason for Borrowing *
        </label>
        <select
          value={formData.reason}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#CE483F] focus:border-transparent transition-colors ${
            errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="">Select a reason</option>
          {reasons.map(reason => (
            <option key={reason.value} value={reason.value}>
              {reason.label}
            </option>
          ))}
        </select>
        {errors.reason && <p className="text-red-600 text-sm mt-1">{errors.reason}</p>}
      </div>

      {formData.reason === 'others' && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Please specify *
          </label>
          <input
            type="text"
            value={formData.customReason || ''}
            onChange={(e) => handleInputChange('customReason', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#CE483F] focus:border-transparent transition-colors ${
              errors.customReason ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Please describe your reason"
          />
          {errors.customReason && <p className="text-red-600 text-sm mt-1">{errors.customReason}</p>}
        </div>
      )}

      <div>
        <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
          <Smartphone className="w-4 h-4 mr-2" />
          Type of Device *
        </label>
        <select
          value={formData.deviceType}
          onChange={(e) => handleInputChange('deviceType', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#CE483F] focus:border-transparent transition-colors ${
            errors.deviceType ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="">Select device type</option>
          {deviceTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        {errors.deviceType && <p className="text-red-600 text-sm mt-1">{errors.deviceType}</p>}
      </div>

      {formData.deviceType && (
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
            <Package className="w-4 h-4 mr-2" />
            Select Device Name *
          </label>
          <select
            value={formData.deviceName}
            onChange={(e) => handleInputChange('deviceName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#CE483F] focus:border-transparent transition-colors ${
              errors.deviceName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          >
            <option value="">Select a device</option>
            {filteredDevices.map(device => (
              <option key={device.AssetID} value={device.AssetID}>
                {device.AssetID}
              </option>
            ))}
          </select>
          {errors.deviceName && <p className="text-red-600 text-sm mt-1">{errors.deviceName}</p>}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#CE483F] text-white py-3 px-4 rounded-lg hover:bg-[#b83e36] focus:ring-2 focus:ring-[#CE483F] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Processing...
          </>
        ) : (
          'Borrow Device'
        )}
      </button>
    </form>
  );
};