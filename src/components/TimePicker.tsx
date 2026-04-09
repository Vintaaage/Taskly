import { createSignal, onMount, onCleanup, createEffect } from "solid-js";
import { Show } from "solid-js";

interface Props {
  value: string;
  onChange: (time: string) => void;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function Drum(props: {
  items: number;
  selected: number;
  onSelect: (i: number) => void;
  format?: (i: number) => string;
}) {
  const ITEM_H = 40;
  const VISIBLE = 5;
  const fmt = props.format ?? pad;

  let ref!: HTMLDivElement;
  let isDragging = false;
  let startY = 0;
  let startScroll = 0;

  const scrollToSelected = (smooth = true) => {
    const totalItems = props.items;
    const scrollIndex = props.selected + totalItems;
    ref.scrollTo({
      top: scrollIndex * ITEM_H,
      behavior: "smooth",
    });
  };

  onMount(() => {
    scrollToSelected(true);
  });

  createEffect(() => {
    if (isDragging) return;
    scrollToSelected();
  });

  const handleScroll = () => {
    const totalItems = props.items;
    let index = Math.round((ref.scrollTop) / ITEM_H);

    // текущий элемент внутри блока
    const clamped = ((index % totalItems) + totalItems) % totalItems;
    props.onSelect(clamped);
    

    if (!isDragging) {
      if (index < totalItems) {
          ref.scrollTop = (index + totalItems) * ITEM_H;
      } else if (index >= totalItems * 2) {
          ref.scrollTop = (index - totalItems) * ITEM_H;
      }
      };
    };

  // Drag support
  const onMouseDown = (e: MouseEvent) => {
    isDragging = true;
    startY = e.clientY;
    startScroll = ref.scrollTop;
    e.preventDefault();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    ref.scrollTop = startScroll - (e.clientY - startY);
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  // Touch support
  const onTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
    startScroll = ref.scrollTop;
    e.preventDefault();
  };

  const onTouchMove = (e: TouchEvent) => {
    ref.scrollTop = startScroll - (e.touches[0].clientY - startY);
  };

  const onTouchEnd = () => {
    isDragging = false;
  };

  const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      ref.scrollTop += e.deltaY > 0 ? ITEM_H : - ITEM_H
  }

  onMount(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  onCleanup(() => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  });

  return (
    <div class="drum-wrapper">
      {/* Подсветка выбранного */}
      <div class="drum-highlight" />

      <div
        ref={ref}
        class="drum-scroll"
        style={`height: ${ITEM_H * VISIBLE}px`}
        onScroll={handleScroll}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onWheel={onWheel}
        onTouchEnd={onTouchEnd}
      >
        {/* Отступы сверху и снизу чтобы первый/последний элемент центрировался */}
        <div style={`height: ${ITEM_H * 2}px`} />
        {Array.from({ length: props.items * 3 }, (_, i) => {
          const idx = i % props.items;
          return (
            <div
              class={`drum-item ${idx === props.selected ? "drum-item-selected" : ""}`}
              style={`height: ${ITEM_H}px`}
            >
              {fmt(idx)}
            </div>
          );
        })}
        <div style={`height: ${ITEM_H * 2}px`} />
      </div>
    </div>
  );
}

export function TimePicker(props: Props) {
  const [open, setOpen] = createSignal(false);

  const parseHour = () => props.value ? parseInt(props.value.split(":")[0]) || 0 : 0;
  const parseMin  = () => props.value ? parseInt(props.value.split(":")[1]) || 0 : 0;

  const [hour, setHour] = createSignal(parseHour());
  const [min, setMin]   = createSignal(parseMin());

  const emit = (h: number, m: number) => props.onChange(`${pad(h)}:${pad(m)}`);

  const selectHour = (h: number) => { setHour(h); emit(h, min()); };
  const selectMin  = (m: number) => { setMin(m);  emit(hour(), m); };

  const label = () => props.value ? props.value : "Set time";

  return (
    <div class="timepicker-wrapper">
      <button
        class={`timepicker-toggle ${open() ? "active" : ""}`}
        onClick={() => setOpen(o => !o)}
      >
        <i class="fa-regular fa-clock" />
        {label()}
      </button>

      <Show when={open()}>
        <div class="timepicker">
          <Drum items={24} selected={hour()} onSelect={selectHour} />
          <div class="timepicker-colon">:</div>
          <Drum items={60} selected={min()} onSelect={selectMin} />
        </div>
      </Show>
    </div>
  );
}