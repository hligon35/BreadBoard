import React from "react";

export function AISuggestionsWidget({
  Text,
}: {
  Text: React.ComponentType<{ children: React.ReactNode }>;
}) {
  return (
    <>
      <Text>• Follow up with Northwind</Text>
      <Text>• Allocate 25% to tax reserve</Text>
      <Text>• Schedule portfolio refresh</Text>
    </>
  );
}
