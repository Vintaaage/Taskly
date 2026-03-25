import { Task } from "../types";
import { removeTask } from "../store";
import { formatDisplay } from "./DatePicker";

interface Props {
  task: Task;
  index: number;
  onOpen: (index: number) => void;
}

export function TaskCard(props: Props) {
  const doneSteps = () => props.task.steps.filter(s => s.done).length;
  const totalSteps = () => props.task.steps.length;

  return (
    <div class="task-card" onClick={() => props.onOpen(props.index)}>
      <div class="task-info">
        <div class="task-title">{props.task.title}</div>
        <div class="task-meta">
          <span class={`tag tag-priority-${props.task.priority}`}>
            {props.task.priority}
          </span>
          {props.task.category && (
            <span class="tag tag-category">{props.task.category}</span>
          )}
          {props.task.deadline && (
            <span class="task-deadline"><i class="fa-solid fa-clock"></i> {formatDisplay(props.task.deadline)}</span>
          )}
          {totalSteps() > 0 && (
            <span class="task-deadline">{doneSteps()}/{totalSteps()} steps</span>
          )}
        </div>
      </div>
      <div class="task-actions">
        <button
          class="btn btn-ghost"
          onClick={(e) => { e.stopPropagation(); props.onOpen(props.index); }}
        >
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button
          class="btn btn-danger"
          onClick={(e) => { e.stopPropagation(); removeTask(props.index); }}
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  );
}