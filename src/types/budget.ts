// ===== Global State Type Definitions =====

export interface OperatingCost {
  id: string;
  category: string;
  budgetedMonthly: number;
  actualMonthly: number;
}

export interface DirectCost {
  id: string;
  item: string;
  costPerPurchase: number;
  unitsPerPurchase: number;
  amountUsedPerProduct: number;
}

export interface CollateralCost {
  id: string;
  item: string;
  costPerPurchase: number;
  unitsPerPurchase: number;
  amountUsedPerProduct: number;
}

export interface ProductionService {
  id: string;
  service: string;
  costPerUnit: number;
  amountUsed: number;
}

export interface MarketingCost {
  id: string;
  channel: string;
  budgetPerBatch: number;
  amountPerBatch: number;
}

export interface BusinessAssumptions {
  ticketPrice: number;
  potentialClients: number;
  conversionRate: number;
}
