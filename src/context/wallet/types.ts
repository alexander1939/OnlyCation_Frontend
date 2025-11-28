export interface WalletCreateRequest {}

export interface WalletCreateData {
  wallet_id: string;
  stripe_account_id: string;
  stripe_status: string;
  stripe_setup_url?: string | null;
}

export interface WalletBalanceData {
  account_status: 'pending' | 'active';
  stripe_account_id: string;
  available_balance: number;
  pending_balance: number;
  stripe_dashboard_url?: string;
  stripe_setup_url?: string;
  currency: string;
}

export interface WalletCreateResponse {
  success: boolean;
  message: string;
  data: WalletCreateData;
}

export interface WalletBalanceResponse {
  success: boolean;
  message: string;
  data: WalletBalanceData;
}

export interface WalletState {
  loading: boolean;
  error: string | null;
  success: boolean;
  balance: WalletBalanceData | null;
  lastUpdated: Date | null;
  creating: boolean;
  lastResponse?: WalletCreateResponse;
}

export interface WalletContextType extends WalletState {
  fetchWalletBalance: () => Promise<void>;
  resetStatus: () => void;
  createWallet: (payload: WalletCreateRequest) => Promise<{ success: boolean; data?: WalletCreateResponse; message: string }>;
}
