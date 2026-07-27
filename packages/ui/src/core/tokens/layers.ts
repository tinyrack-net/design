export const tinyrackLayers = {
  base: 0,
  /**
   * In-flow page furniture that pins while the page scrolls — a sticky app
   * header or toolbar. Deliberately below `backdrop`: chrome is part of the
   * page a scrim is meant to cover, not an overlay competing with it.
   */
  chrome: 100,
  dropdown: 1000,
  popover: 1100,
  backdrop: 900,
  dialog: 1210,
  toast: 1300,
  tooltip: 1400,
} as const;
