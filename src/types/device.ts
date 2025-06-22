export interface Device {
  AssetID: string;
  DeviceType: string;
  Email: string;
  Name: string;
  Borrowed: string;
}

export interface BorrowFormData {
  name: string;
  email: string;
  reason: string;
  customReason?: string;
  deviceType: string;
  deviceName: string;
}

export interface ReturnFormData {
  name: string;
  email: string;
  deviceName: string;
}