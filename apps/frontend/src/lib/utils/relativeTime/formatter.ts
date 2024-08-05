// keep a cache of the formatter, to avoid re-creating it (GC)
let formatter: Intl.RelativeTimeFormat | null = null;

// get the Intl.RelativeTimeFormat formatter
export function getFormatter() {
  if (formatter === null) {
    formatter = new Intl.RelativeTimeFormat("da-DK", { numeric: 'auto' })
  }
  return formatter
}