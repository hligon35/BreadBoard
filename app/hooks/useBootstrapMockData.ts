import { useEffect } from "react";
import { useMoneyStore } from "@app/context/stores/useMoneyStore";
import { useWorkStore } from "@app/context/stores/useWorkStore";
import { useClientsStore } from "@app/context/stores/useClientsStore";
import { useComplianceStore } from "@app/context/stores/useComplianceStore";
import { useInsightsStore } from "@app/context/stores/useInsightsStore";

export function useBootstrapMockData() {
  const refreshMoney = useMoneyStore((s) => s.refresh);
  const refreshWork = useWorkStore((s) => s.refresh);
  const refreshClients = useClientsStore((s) => s.refresh);
  const refreshCompliance = useComplianceStore((s) => s.refresh);
  const refreshInsights = useInsightsStore((s) => s.refresh);

  useEffect(() => {
    refreshMoney();
    refreshWork();
    refreshClients();
    refreshCompliance();
    refreshInsights();
  }, [refreshMoney, refreshWork, refreshClients, refreshCompliance, refreshInsights]);
}
