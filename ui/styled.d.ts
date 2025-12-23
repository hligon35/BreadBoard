import "styled-components";
import type { AppTheme } from "@app/theme/tokens";

declare module "styled-components" {
  export interface DefaultTheme extends AppTheme {
    a11y?: {
      largeText: boolean;
      highContrast: boolean;
    };
  }
}
