import React from "react";

export function CashFlowWidget({
  Text,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
}) {
  return (
    <>
      <Text>Next 30d income: $9,200 (mock)</Text>
      <Text>Next 30d expenses: $2,100 (mock)</Text>
      <Text>Projected net: $7,100 (mock)</Text>
    </>
  );
}
