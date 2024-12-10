export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  role: string;
}

export interface ServiceProviderInfo {
  companyName: string;
  address?: string;
  registrationNumber?: string;
  serviceType?: 'Car Hire' | 'Security Service' | 'Car Dealership' | 'Parts Store';
  securityCredentials?: {
    organization: string;
    badgeNumber: string;
    firearmsLicense: string;
  };
  vehicleFleet?: string[];
}

export interface LocalUser {
  id: string;
  email: string;
  username: string;
  role: string;
  phoneNumber: string;
  isVerified: boolean;
  isProfileComplete: boolean;
  googleId?: string;
  serviceProviderInfo?: ServiceProviderInfo;
}
