import { tasks, currentFilter } from "../store";

const FILTER_TITLES: Record<string, string> = {
  all: "All tasks",
  High: "High priority",
  Medium: "Medium priority",
  Low: "Low priority",
};

interface Props {
  onAdd: () => void;
}

export function StatsBar(props: Props) {
  const count = (p?: string) => p
    ? tasks().filter(t => t.priority === p).length
    : tasks().length;

  const viewTitle = () => FILTER_TITLES[currentFilter()] ?? currentFilter();

  return (
    <div class="stats-bar">
      <h1 class="main-title">{viewTitle()}</h1>
      <div class="stats-counts">
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
      <button class="btn btn-primary" onClick={props.onAdd}>+ New task</button>
    </div>
  );
}