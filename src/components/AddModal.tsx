import { createSignal, createEffect } from "solid-js";
import { currentFilter, addTask } from "../store";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddModal(props: Props) {
  let titleRef!: HTMLInputElement;
  let categoryRef!: HTMLInputElement;
  let priorityRef!: HTMLSelectElement;
  let deadlineRef!: HTMLInputElement;

  // Подставляем категорию если фильтр — это категория
  createEffect(() => {
    if (props.open) {
      const f = currentFilter();
      const isCategory = !["all", "High", "Medium", "Low"].includes(f);
      if (isCategory && categoryRef) categoryRef.value = f;
    }
  });

  const highlightInvalid = (el: HTMLInputElement) => {
    el.style.borderColor = "var(--danger)";
    el.focus();
    el.addEventListener("input", () => { el.style.borderColor = ""; }, { once: true });
  };

  const handleSave = async () => {
    let invalid = false;
    if (!titleRef.value.trim())    { highlightInvalid(titleRef);    invalid = true; }
    if (!categoryRef.value.trim()) { highlightInvalid(categoryRef); invalid = true; }
    if (invalid) return;

    await addTask(
      titleRef.value.trim(),
      categoryRef.value.trim(),
      priorityRef.value,
      deadlineRef.value || null
    );

    titleRef.value = "";
    categoryRef.value = "";
    deadlineRef.value = "";
    props.onClose();
  };

  return (
    <div
      class={`modal-overlay ${props.open ? "open" : ""}`}
      onClick={(e) => { if (e.target === e.currentTarget) props.onClose(); }}
    >
      <div class="modal">
        <div class="modal-title">New task</div>

        <div class="form-group">
          <label>Title</label>
          <input ref={titleRef} type="text" placeholder="What needs to be done?" />
        </div>
        <div class="form-group">
          <label>Category</label>
          <input ref={categoryRef} type="text" placeholder="e.g. Work, Personal..." />
        </div>
        <div class="form-group">
          <label>Priority</label>
          <select ref={priorityRef}>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div class="form-group">
          <label>Deadline (optional)</label>
          <input ref={deadlineRef} type="date" />
        </div>

        <div class="modal-actions">
          <button class="btn btn-ghost" onClick={props.onClose}>Cancel</button>
          <button class="btn btn-primary" onClick={handleSave}>Add task</button>
        </div>
      </div>
    </div>
  );
}