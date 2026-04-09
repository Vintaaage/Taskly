import { createSignal, createEffect, Show, onCleanup } from "solid-js";
import { TimePicker } from "./TimePicker";

interface Props {
  value: string;
  onChange: (date: string) => void;
}

export function formatDisplay(val: string): string {
    if (!val) return "No deadline";
    const [datePart, timePart] = val.split("T");
    const [year, month, day] = datePart.split("-");
    const dateStr = `${day}.${month}.${year}`;
    return timePart ? `${dateStr} ${timePart}` : dateStr;
}

function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}



export function DatePicker(props: Props) {
    const [open, setOpen] = createSignal(false);   
    const [viewYear, setViewYear] = createSignal(new Date().getFullYear()); 
    const [viewMonth, setViewMonth] = createSignal(new Date().getMonth());
    const [selectedDate, setSelectedDate] = createSignal(props.value?.split("T")[0] ?? "");
    const [time, setTime] = createSignal(props.value?.split("T")[1] ?? "");     
    
    let containerRef!: HTMLDivElement;

    const handleOutsideClick = (e: MouseEvent) => {
        if (!containerRef.contains(e.target as Node)) setOpen(false);
    };

    createEffect(() => {
        if (open()) document.addEventListener("mousedown", handleOutsideClick);
        else document.removeEventListener("mousedown", handleOutsideClick);
    });

    onCleanup(() => document.removeEventListener("mousedown", handleOutsideClick));

    const emit = (date: string, t: string) => {
        props.onChange(t ? `${date}T${t}` : date);
    };

    const selectDate = (data: Date) => {
        const iso = toISODate(data);
        setSelectedDate(iso);
        setViewMonth(data.getMonth());
        setViewYear(data.getFullYear())
        emit(iso, time());
    };

    const HandleTimeChange = (t: string) => {
        setTime(t);
        if (selectedDate()) emit(selectedDate(), t);
    }

    const clear = () => {
        setSelectedDate("");
        setTime("");
        props.onChange("");
        setOpen(false);
    }

    const quick = [
        { label: "Today",      date: () => new Date() },
        { label: "Tomorrow",   date: () => { const d = new Date(); d.setDate(d.getDate() + 1); return d; } },
        { label: "Next week",  date: () => { const d = new Date(); d.setDate(d.getDate() + 7); return d; } },
        { label: "Next month", date: () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return d; } },
    ];

    const getDays = () => {
        const firstDay = new Date(viewYear(), viewMonth(), 1).getDay();
        const daysInMonth = new Date(viewYear(), viewMonth() + 1, 0).getDate();
        const days: (number | null)[] = [];
        const offset = (firstDay + 6) % 7;
        for (let i = 0; i < offset; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    };

    const monthName = () =>
        new Date(viewYear(), viewMonth()).toLocaleDateString("en-GB", { month: "long", year: "numeric" })

    const prevMonth = () => {
        if (viewMonth() === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };

    const nextMonth = () => {
        if (viewMonth() === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const isSelected = (day: number) =>
        selectedDate() === toISODate(new Date(viewYear(), viewMonth(), day));

    const isToday = (day: number) => {
        const t = new Date();
        return t.getFullYear() === viewYear() && t.getMonth() === viewMonth() && t.getDate() === day;
    };

    return (
        <div class="datepicker-wrapper" ref={containerRef}>
            <div class = "datepicker-input" onClick={() => setOpen(o => !o)}>
                <span class={props.value ? "" : "datepicker-placeholder"}>
                    {formatDisplay(props.value)}
                </span>
                <i class="fa-solid fa-calendar-days" />
            </div>

            <Show when={open()}>
                <div class="datepicker-dropdown">

                <div class="datepicker-quick">
                    {quick.map(q => (
                        <button class="datepicker-quick-btn" onClick={() => selectDate(q.date())}>
                            {q.label}
                        </button>
                    ))}
                </div>

                <div class="datepicker-divider"/>

                <div class="datepicker-nav">
                    <button class="datepicker-nav-btn" onClick={prevMonth}>
                        <i class="fa-solid fa-chevron-left"/>
                    </button>
                    <span class="datepicker-month">{monthName()}</span>
                    <button class="datepicker-nav-btn" onClick={nextMonth}>
                        <i class="fa-solid fa-chevron-right" />
                    </button>
                </div>

                <div class="datepicker-grid">
                    {["Mo","Tu","We","Th","Fr","Sa","Su"].map(d => (
                        <div class="datepicker-weekday">{d}</div>
                    ))}
                    {getDays().map(day => (
                        <div
                        class={[
                            "datepicker-day",
                            !day ? "empty" : "", 
                            day && isSelected(day) ? "selected" : "",
                            day && isToday(day) ? "today" : "",
                        ].join(" ")}
                        onclick={() => day && selectDate(new Date(viewYear(), viewMonth(), day))}
                        >
                            {day ?? ""}
                        </div>
                    ))}
                </div>

                <Show when={selectedDate()}>
                    <div class="datepicker-divider"/>
                    <div class="datepicker-time-row">
                        <i class="fa-regular fa-clock" />
                        <span>Time (optional)</span>
                        <TimePicker value={time()} onChange={HandleTimeChange} />
                        <Show when={time()}>
                            <button class="datepicker-time-clear" onClick={() => HandleTimeChange("")}>
                                <i class="fa-solid fa-xmark" />
                            </button>
                        </Show>
                    </div>
                </Show>

                <div class="datepicker-divider" />

                <button class="datepicker-clear" onClick={clear}>
                    <i class="fa-solid fa-xmark" /> Clear deadline
                </button>

                </div>
            </Show>
        </div>
    )
}