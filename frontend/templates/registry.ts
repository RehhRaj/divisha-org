import { education } from "./education/variants";
import { restaurant } from "./restaurant/variants";
import { salon } from "./salon/variants";
import { society } from "./society/variants";
import { tour } from "./tour/variants";
import type { Family } from "./types";

export const families = new Map<string, Family>(
  Object.entries({ tour, restaurant, society, education, salon }),
);
