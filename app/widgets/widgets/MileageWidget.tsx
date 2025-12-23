import React from "react";

export function MileageWidget({
  Text,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
}) {
  return (
    <>
      <Text>Week mileage: 42.6 mi (mock)</Text>
      <Text>Billable time: 18.5 hrs (mock)</Text>
      <Text>Rate efficiency: 73% (mock)</Text>
    </>
  );
}
