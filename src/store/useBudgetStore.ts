import { create } from "zustand";
import type {
  OperatingCost,
  DirectCost,
  CollateralCost,
  ProductionService,
  MarketingCost,
  BusinessAssumptions,
} from "@/types/budget";

// ===== Store State Shape =====
interface BudgetState {
  // --- Data Arrays ---
  operatingCosts: OperatingCost[];
  directCosts: DirectCost[];
  collateralCosts: CollateralCost[];
  productionServices: ProductionService[];
  marketingCosts: MarketingCost[];

  // --- Sales Model ---
  businessAssumptions: BusinessAssumptions;

  // --- Operating Costs Actions ---
  addOperatingCost: (cost: OperatingCost) => void;
  updateOperatingCost: (id: string, cost: Partial<OperatingCost>) => void;
  removeOperatingCost: (id: string) => void;

  // --- Direct Costs Actions ---
  addDirectCost: (cost: DirectCost) => void;
  updateDirectCost: (id: string, cost: Partial<DirectCost>) => void;
  removeDirectCost: (id: string) => void;

  // --- Collateral Costs Actions ---
  addCollateralCost: (cost: CollateralCost) => void;
  updateCollateralCost: (id: string, cost: Partial<CollateralCost>) => void;
  removeCollateralCost: (id: string) => void;

  // --- Production Services Actions ---
  addProductionService: (service: ProductionService) => void;
  updateProductionService: (
    id: string,
    service: Partial<ProductionService>
  ) => void;
  removeProductionService: (id: string) => void;

  // --- Marketing Costs Actions ---
  addMarketingCost: (cost: MarketingCost) => void;
  updateMarketingCost: (id: string, cost: Partial<MarketingCost>) => void;
  removeMarketingCost: (id: string) => void;

  // --- Business Assumptions Actions ---
  setBusinessAssumptions: (assumptions: Partial<BusinessAssumptions>) => void;
}

// ===== Store Implementation =====
export const useBudgetStore = create<BudgetState>((set) => ({
  // --- Default State ---
  operatingCosts: [],
  directCosts: [],
  collateralCosts: [],
  productionServices: [],
  marketingCosts: [],
  businessAssumptions: {
    ticketPrice: 0,
    potentialClients: 0,
    conversionRate: 0,
  },

  // --- Operating Costs ---
  addOperatingCost: (cost) =>
    set((state) => ({
      operatingCosts: [...state.operatingCosts, cost],
    })),
  updateOperatingCost: (id, updates) =>
    set((state) => ({
      operatingCosts: state.operatingCosts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  removeOperatingCost: (id) =>
    set((state) => ({
      operatingCosts: state.operatingCosts.filter((c) => c.id !== id),
    })),

  // --- Direct Costs ---
  addDirectCost: (cost) =>
    set((state) => ({
      directCosts: [...state.directCosts, cost],
    })),
  updateDirectCost: (id, updates) =>
    set((state) => ({
      directCosts: state.directCosts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  removeDirectCost: (id) =>
    set((state) => ({
      directCosts: state.directCosts.filter((c) => c.id !== id),
    })),

  // --- Collateral Costs ---
  addCollateralCost: (cost) =>
    set((state) => ({
      collateralCosts: [...state.collateralCosts, cost],
    })),
  updateCollateralCost: (id, updates) =>
    set((state) => ({
      collateralCosts: state.collateralCosts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  removeCollateralCost: (id) =>
    set((state) => ({
      collateralCosts: state.collateralCosts.filter((c) => c.id !== id),
    })),

  // --- Production Services ---
  addProductionService: (service) =>
    set((state) => ({
      productionServices: [...state.productionServices, service],
    })),
  updateProductionService: (id, updates) =>
    set((state) => ({
      productionServices: state.productionServices.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    })),
  removeProductionService: (id) =>
    set((state) => ({
      productionServices: state.productionServices.filter((s) => s.id !== id),
    })),

  // --- Marketing Costs ---
  addMarketingCost: (cost) =>
    set((state) => ({
      marketingCosts: [...state.marketingCosts, cost],
    })),
  updateMarketingCost: (id, updates) =>
    set((state) => ({
      marketingCosts: state.marketingCosts.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),
  removeMarketingCost: (id) =>
    set((state) => ({
      marketingCosts: state.marketingCosts.filter((c) => c.id !== id),
    })),

  // --- Business Assumptions ---
  setBusinessAssumptions: (assumptions) =>
    set((state) => ({
      businessAssumptions: { ...state.businessAssumptions, ...assumptions },
    })),
}));
