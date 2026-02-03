/**
 * Metrics query model.
 * No execution, no persistence.
 */

import { Metric } from "./metrics";

export type MetricQuery = {
  name: string;
};

export function queryMetric(
  metrics: Metric[],
  query: MetricQuery
): Metric | null {
  return metrics.find((m) => m.name === query.name) || null;
}
