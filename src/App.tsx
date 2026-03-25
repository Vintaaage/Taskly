import { createSignal, onMount } from "solid-js";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { loadTasks, currentFilter } from "./store";
import { Sidebar } from "./components/SideBar";
import { StatsBar } from "./components/StatsBar";
import { TaskList } from "./components/TaskList";
import { AddModal } from "./components/AddModal";
import { DetailModal } from "./components/DetailModal";

const FILTER_TITLES: Record<string, string> = {
  all: "All tasks",
  High: "High priority",
  Medium: "Medium priority",
  Low: "Low priority",
};

export function App() {
  const [addOpen, setAddOpen] = createSignal(false);
  const [detailOpen, setDetailOpen] = createSignal(false);

  const viewTitle = () => FILTER_TITLES[currentFilter()] ?? currentFilter();

  onMount(async () => {
    await loadTasks();

    // Горячие клавиши
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { setAddOpen(false); setDetailOpen(false); }
    });

    document.addEventListener("contextmenu", (e) => e.preventDefault());

    // Управление окном
    const win = getCurrentWindow();
    document.getElementById("btn-minimize")!.addEventListener("click", () => win.minimize());
    document.getElementById("btn-maximize")!.addEventListener("click", () => win.toggleMaximize());
    document.getElementById("btn-close")!.addEventListener("click", () => win.close());
  });

  const openDetail = (index: number) => {
    import("./store").then(({ setCurrentTaskIndex }) => setCurrentTaskIndex(index));
    setDetailOpen(true);
  };

  return (
    <div class="app">
      <header data-tauri-drag-region>
        <div class="logo" data-tauri-drag-region>
          <span class="logo-text" data-tauri-drag-region>Taskly</span>
          <span class="logo-dot" />
        </div>
        <div class="window-controls">
          <button class="wc-btn" id="btn-minimize">—</button>
          <button class="wc-btn" id="btn-maximize">□</button>
          <button class="wc-btn wc-close" id="btn-close">✕</button>
        </div>
      </header>

      <Sidebar />

      <main>
        <div class="main-header">
          <h1 class="main-title">{viewTitle()}</h1>
          <button class="btn btn-primary" onClick={() => setAddOpen(true)}>
            + New task
          </button>
        </div>

        <StatsBar />
        <TaskList onOpenDetail={openDetail} />
      </main>

      <AddModal open={addOpen()} onClose={() => setAddOpen(false)} />
      <DetailModal open={detailOpen()} onClose={() => setDetailOpen(false)} />
    </div>
  );
}