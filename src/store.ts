import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import type { Task } from "./types";

export const [tasks, setTasks] = createSignal<Task[]>([]);
export const [currentFilter, setCurrentFilter] = createSignal("all");
export const [currentTaskIndex, setCurrentTaskIndex] = createSignal<number | null>(null);

export async function loadTasks() {
  setTasks(await invoke<Task[]>("get_tasks"));
}

export async function addTask(title: string, category: string, priority: string, deadline: string | null) {
  await invoke("add_task", { title, category, priority, deadline });
  await loadTasks();
}

export async function removeTask(index: number) {
  await invoke("remove_task", { index });
  await loadTasks();
}

export async function updateTask(index: number, task: Task) {
  await invoke("update_task", { index, task });
  await loadTasks();
}