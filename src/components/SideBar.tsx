import { For, createMemo } from "solid-js";
import { tasks, currentFilter, setCurrentFilter } from "../store";

export function Sidebar() {
  const categories = createMemo(() =>
    [...new Set(tasks().map(t => t.category))].filter(Boolean)
  );

  const count = (p?: string) => p
    ? tasks().filter(t => t.priority === p).length
    : tasks().length;

  return (
    <aside>
      <SidebarItem filter="all" active={currentFilter() === "all"} count={count()}>
        All tasks
      </SidebarItem>

      <div class="sidebar-label">Priority</div>
      <SidebarItem filter="High" active={currentFilter() === "High"} count={count("High")}>
        High
      </SidebarItem>
      <SidebarItem filter="Medium" active={currentFilter() === "Medium"} count={count("Medium")}>
        Medium
      </SidebarItem>
      <SidebarItem filter="Low" active={currentFilter() === "Low"} count={count("Low")}>
        Low
      </SidebarItem>

      <div class="sidebar-label">Categories</div>
      <For each={categories()}>
        {(cat) => (
          <SidebarItem
            filter={cat}
            active={currentFilter() === cat}
            count={tasks().filter(t => t.category === cat).length}
          >
            {cat}
          </SidebarItem>
        )}
      </For>

      <div style="margin-top: auto; font-size: 11px; color: var(--text-muted); letter-spacing: 0.05em;">
        ver. 0.1.0
      </div>
    </aside>
  );
}

function SidebarItem(props: {
  filter: string;
  active: boolean;
  count: number;
  children: any;
}) {
  return (
    <div
      class={`cat-item ${props.active ? "active" : ""}`}
      onClick={() => setCurrentFilter(props.filter)}
    >
      <span class="cat-item-label">{props.children}</span>
      <span class="cat-count">{props.count}</span>
    </div>
  );
}