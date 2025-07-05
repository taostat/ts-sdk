import { StakingSlippageInfo } from "../../helpers/network/get-slippage";

export interface UnstakeParams {
  hotkey: string;
  netuid: number;
  amount: string; // Amount in Alpha (for subnets) or TAO (for root)
  maxSlippageTolerance?: number; // Maximum slippage percentage (default: 0.5%)
  allowPartialUnstaking?: boolean; // Allow partial unstaking if full amount would exceed slippage (default: false)
  disableSlippageProtection?: boolean; // Disable slippage protection entirely (default: false)
}

export interface UnstakeResult {
  success: boolean;
  txHash?: string;
  slippageInfo?: StakingSlippageInfo;
  error?: string;
}

export interface UnstakeFromRootParams {
  hotkey: string;
  amount: string;
  fromAddress?: string;
  unstakeAll?: boolean;
  safeUnstaking?: boolean; // default: true
  slippageTolerance?: number; // default: 0.05 (5%)
  allowPartialUnstake?: boolean; // default: false
}

export interface UnstakeAlphaParams {
  hotkey: string;
  subnet: number; // netuid (not 0)
  amount: string;
  fromAddress?: string;
  unstakeAll?: boolean;
  safeUnstaking?: boolean; // default: true
  slippageTolerance?: number; // default: 0.05 (5%)
  allowPartialUnstake?: boolean; // default: false
}

export interface UnstakeEstimate {
  // transactionFee: string; // Blockchain transaction fee in TAO
  // slippageCost?: string; // Slippage cost in TAO (only for subnet unstaking)
  totalCost: string; // Total cost including fee and slippage
  expectedReceived: string; // Expected amount received after slippage
  // slippagePercentage?: number; // Slippage percentage (only for subnet unstaking)
}
