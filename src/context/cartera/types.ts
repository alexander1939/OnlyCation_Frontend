export interface WalletCreateRequest {}

export interface WalletCreateData {
  wallet_id: string;
  stripe_account_id: string;
  stripe_status: string;
  stripe_setup_url?: string | null;
}

export interface WalletCreateResponse {
  success: boolean;
  message: string;
  data: WalletCreateData;
}

export interface UseAgendaState {
  loading: boolean;
  error: string | null;
  success: boolean;
}
