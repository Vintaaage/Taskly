import { tasks, currentTaskIndex, updateTask } from "../store";

interface Props {
  description: string;
  done: boolean;
  stepIndex: number;
}

export function StepItem(props: Props) {
  const toggle = async () => {
    const idx = currentTaskIndex()!;
    const updated = structuredClone(tasks()[idx]);
    updated.steps[props.stepIndex].done = !props.done;
    await updateTask(idx, updated);
  };

  return (
    <div class="step-item">
      <input
        type="checkbox"
        class="step-checkbox"
        checked={props.done}
        onChange={toggle}
      />
      <span class={props.done ? "step-done" : ""}>{props.description}</span>
    </div>
  );
}