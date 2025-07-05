export interface MoveAlphaParams {
  originHotkey: string; // origin hotkey
  destinationHotkey: string; // destination hotkey
  originNetuid: number; // origin subnet
  destinationNetuid: number; // destination subnet
  amount: string; // amount in Alpha
  maxSlippageTolerance?: number; // default: 0.5%
  disableSlippageProtection?: boolean; // default: false
}

export interface MoveParams {
  originHotkey: string;
  destinationHotkey: string;
  originNetuid: number;
  destinationNetuid: number;
  amount: string; // Amount in Alpha
  maxSlippageTolerance?: number; // Maximum slippage percentage (default: 0.5%)
  disableSlippageProtection?: boolean; // Disable slippage protection entirely (default: false)
}

export interface MoveResult {
  success: boolean;
  txHash?: string;
  error?: string;
  originStakeBefore?: string;
  originStakeAfter?: string;
  destinationStakeBefore?: string;
  destinationStakeAfter?: string;
}