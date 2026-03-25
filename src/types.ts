export interface Step {
  description: string;
  done: boolean;
}

export interface Task {
  title: string;
  priority: "Low" | "Medium" | "High";
  deadline: string | null;
  steps: Step[];
  category: string;
}