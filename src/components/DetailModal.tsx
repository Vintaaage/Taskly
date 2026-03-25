import { For, Show, createSignal } from "solid-js";
import { tasks, currentTaskIndex, setCurrentTaskIndex, removeTask, updateTask } from "../store";
import { StepItem } from "./StepItem";
import { formatDisplay } from "./DatePicker";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DetailModal(props: Props) {
  const [stepInput, setStepInput] = createSignal("");

  const task = () => {
    const i = currentTaskIndex();
    return i !== null ? tasks()[i] : null;
  };

  const addStep = async () => {
    const desc = stepInput().trim();
    const idx = currentTaskIndex();
    if (!desc || idx === null) return;

    const updated = structuredClone(tasks()[idx]);
    updated.steps.push({ description: desc, done: false });
    await updateTask(idx, updated);
    setStepInput("");
  };

  const handleDelete = async () => {
    const idx = currentTaskIndex();
    if (idx === null) return;
    await removeTask(idx);
    setCurrentTaskIndex(null);
    props.onClose();
  };

  return (
    <div
      class={`detail-overlay ${props.open ? "open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) props.onClose(); }}
    >
      <Show when={task()}>
        {(t) => (
          <div class="detail-panel">
            <div class="detail-header">
              <div class="detail-title">{t().title}</div>
              <button class="close-btn" onClick={props.onClose}>✕</button>
            </div>

            <div class="task-meta" style="margin-bottom: 20px; gap: 8px; display: flex; flex-wrap: wrap;">
              <span class={`tag tag-priority-${t().priority}`}>{t().priority}</span>
              <Show when={t().category}>
                <span class="tag tag-category">{t().category}</span>
              </Show>
              <Show when={t().deadline}>
                <span class="task-deadline"><i class="fa-solid fa-clock"></i> {formatDisplay(t().deadline ?? "")}</span>
              </Show>
            </div>

            <div class="detail-section">
              <div class="detail-section-title">Steps</div>
              <div class="steps-list">
                <For each={t().steps}>
                  {(step, i) => (
                    <StepItem
                      description={step.description}
                      done={step.done}
                      stepIndex={i()}
                    />
                  )}
                </For>
              </div>
              <div class="add-step-row">
                <input
                  type="text"
                  class="input"
                  placeholder="Add a step..."
                  value={stepInput()}
                  onInput={(e) => setStepInput(e.currentTarget.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addStep(); } }}
                />
                <button class="btn btn-primary" onClick={addStep}>Add</button>
              </div>
            </div>

            <div class="detail-footer">
              <button class="btn btn-danger" onClick={handleDelete}>Mark as done</button>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
}