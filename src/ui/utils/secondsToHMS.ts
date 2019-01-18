export function secondsToHMS(seconds: number): string {
  const pad = num => (10 ** 2 + Math.floor(num)).toString().substring(1);

  seconds = Math.ceil(seconds);

  let display: string = '';

  const h = Math.trunc(seconds / 3600) % 24;
  if (h) {
    display += `${pad(h)}:`;
  }

  const m = Math.trunc(seconds / 60) % 60;
  display += `${pad(m)}:`;

  const s = Math.trunc(seconds % 60);
  display += `${pad(s)}`;

  return display;
}
