import { For, Show, createMemo, createEffect } from "solid-js";
import { tasks, currentFilter } from "../store";
import { TaskCard } from "./TaskCard";

interface Props {
  onOpenDetail: (index: number) => void;
}



export function TaskList(props: Props) {

  const filtered = createMemo(() =>
    tasks()
      .map((t, i) => ({ task: t, index: i }))
      .filter(({ task: t }) => {
        const f = currentFilter();
        if (f === "all") return true;
        if (["High", "Medium", "Low"].includes(f)) return t.priority === f;
        return t.category === f;
      })
  );

  return (
    <div class="task-list">
      <Show
        when={filtered().length > 0}
        fallback={
          <div class="empty">
            <div class="empty-icon">◻</div>
            <div class="empty-text">No tasks here</div>
            <div class="empty-sub">Add one with the button above</div>
          </div>
        }
      >
        <For each={filtered()}>
          {({ task, index }) => (
            <TaskCard
              task={task}
              index={index}
              onOpen={props.onOpenDetail}
            />
          )}
        </For>
      </Show>
    </div>
  );
}