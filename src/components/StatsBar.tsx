import { tasks } from "../store";

export function StatsBar() {
  const count = (p?: string) => p
    ? tasks().filter(t => t.priority === p).length
    : tasks().length;

  return (
    <div class="stats-bar">
      <div class="stat">
        <div class="stat-value">{count()}</div>
        <div class="stat-label">Total</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="color: var(--high)">{count("High")}</div>
        <div class="stat-label">High</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="color: var(--medium)">{count("Medium")}</div>
        <div class="stat-label">Medium</div>
      </div>
      <div class="stat">
        <div class="stat-value" style="color: var(--low)">{count("Low")}</div>
        <div class="stat-label">Low</div>
      </div>
    </div>
  );
}