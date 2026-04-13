import { getCurrentWindow } from "@tauri-apps/api/window";
import { Image as TauriImage } from "@tauri-apps/api/image";
import { Priority } from "./Priority";

function getColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    High:   style.getPropertyValue('--high').trim(),
    Medium: style.getPropertyValue('--medium').trim(),
    Low:    style.getPropertyValue('--low').trim(),
    empty:  style.getPropertyValue('--accent').trim(),
  };
}

export async function updateIcon(tasks: { priority: Priority}[]) {
    const COLORS = getColors();
    const size = 256;
    const grid = 4;
    const cell = size / grid;
    const radius = cell * 0.35;
    const pad = cell / 2;

    const dots: string[] = [];
    const order: Priority[] = ['High', 'Medium', 'Low'];

    for (const priority of order) {
        const count = tasks.filter(t => t.priority === priority).length;
        for (let i = 0; i < count; i++) dots.push(COLORS[priority]);
    }
    while (dots.length < grid * grid) dots.push(COLORS.empty);

    const circles = dots.map((color, i) => {
        const x = (i % grid) * cell + pad;
        const y = Math.floor(i / grid) * cell + pad;
        return `<circle cx="${x}" cy="${y}" r="${radius}" fill="${color}"/>`;
    }).join('');

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
        <rect width="${size}" height="${size}" fill="#1a1a1a" rx="16"/>
        ${circles}
        </svg>
    `;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    await new Promise(r => img.onload = r);

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    canvas.getContext('2d')!.drawImage(img, 0, 0);
    URL.revokeObjectURL(url);

    

    const pngBlob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), 'image/png'));
    const arrayBuffer = await pngBlob.arrayBuffer();
    const image = await TauriImage.fromBytes(new Uint8Array(arrayBuffer));
    await getCurrentWindow().setIcon(image);
}