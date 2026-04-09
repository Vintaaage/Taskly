export type Priority = "Low" | "Medium" | "High";

interface Props {
  value: Priority;
  onChange: (p: Priority) => void;
}

const OPTIONS: { value: Priority; label: string }[] = [
  { value: "Low",    label: "Low"    },
  { value: "Medium", label: "Medium" },
  { value: "High",   label: "High"   },
];

export function PrioritySelect(props: Props) {
    return (
    <div class="priority-buttons">
      {OPTIONS.map(opt => (
        <button
        class={`priority-btn tag-priority-${opt.value} ${props.value === opt.value ? "active" : ""}`}
        onClick={() => props.onChange(opt.value)}
        >
        {opt.label}
        </button>
      ))}
    </div>
  );
}