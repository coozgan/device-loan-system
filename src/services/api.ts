import { Device } from '../types/device';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const fetchDevices = async (): Promise<Device[]> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors', // Explicitly set CORS mode
      credentials: 'omit', // Don't send credentials for cross-origin requests
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    
    // Provide more specific error information
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. This may be due to network issues or CORS policy restrictions.');
    }
    
    throw error;
  }
};

export const borrowDevice = async (deviceId: string, name: string, email: string, reason: string, customReason?: string): Promise<void> => {
  try {
    const finalReason = reason === 'others' ? customReason || '' : reason;
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({
        AssetID: deviceId,
        DeviceType: "", // This will be filled by the backend based on AssetID
        Email: email,
        Name: name,
        Reason: finalReason
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error borrowing device:', error);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. This may be due to network issues or CORS policy restrictions.');
    }
    
    throw error;
  }
};

export const returnDevice = async (deviceId: string): Promise<void> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify({
        AssetID: deviceId,
        DeviceType: "",
        Email: "",
        Name: "",
        Reason: ""
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error returning device:', error);
    
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. This may be due to network issues or CORS policy restrictions.');
    }
    
    throw error;
  }
};

export const getAvailableDevices = (devices: Device[]): Device[] => {
  return devices.filter(device => !device.Email && !device.Name);
};

export const getBorrowedDevices = (devices: Device[]): Device[] => {
  return devices.filter(device => device.Email && device.Name);
};

export const getBorrowedDevicesByUser = (devices: Device[], name: string, email: string): Device[] => {
  return devices.filter(device => 
    device.Name.toLowerCase() === name.toLowerCase() && 
    device.Email.toLowerCase() === email.toLowerCase()
  );
};