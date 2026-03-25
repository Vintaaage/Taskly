use serde::{Serialize, Deserialize};
use std::fs;
use std::sync::Mutex;
use tauri::State;

#[derive(Serialize, Deserialize, Debug, Clone)]
enum Priority {
    Low,
    Medium,
    High,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Step {
    description: String,
    done: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
struct Task {
    title: String,
    priority: Priority,
    deadline: Option<String>, 
    steps: Vec<Step>,
    category: String,
}


struct AppState {
    tasks: Mutex<Vec<Task>>,
}

fn get_tasks_path() -> std::path::PathBuf {
    let mut path = dirs::data_local_dir().unwrap_or_else(|| std::path::PathBuf::from("."));
    path.push("taskly");
    std::fs::create_dir_all(&path).ok();
    path.push("tasks.json");
    path
}

fn save_tasks(tasks: &Vec<Task>) {
    let data = serde_json::to_string_pretty(tasks).unwrap();
    std::fs::write(get_tasks_path(), data).unwrap();
}

fn load_tasks() -> Vec<Task> {
    let data = std::fs::read_to_string(get_tasks_path()).unwrap_or("[]".to_string());
    serde_json::from_str(&data).unwrap()
}

#[tauri::command]
fn get_tasks(state: State<AppState>) -> Vec<Task> {
    state.tasks.lock().unwrap().clone()
}

#[tauri::command]
fn add_task(state: State<AppState>, title: String, category: String, priority: Priority, deadline: Option<String>) {
    let mut tasks = state.tasks.lock().unwrap();
    tasks.push(Task { title, priority, deadline, steps: vec![], category });
    save_tasks(&tasks);
}

#[tauri::command]
fn remove_task(state: State<AppState>, index: usize) {
    let mut tasks = state.tasks.lock().unwrap();
    if index < tasks.len() {
        tasks.remove(index);
        save_tasks(&tasks);
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(AppState {
            tasks: Mutex::new(load_tasks()),
        })
        .invoke_handler(tauri::generate_handler![get_tasks, add_task, remove_task, update_task])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn update_task(state: State<AppState>, index: usize, task: Task) -> Result<(), String> {
    let mut tasks = state.tasks.lock().map_err(|e| e.to_string())?;
    if index < tasks.len() {
        tasks[index] = task;
        save_tasks(&tasks);
    }
    Ok(())
}