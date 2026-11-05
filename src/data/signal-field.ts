export const signalFieldConfig = {
    mobileBreakpoint: 768,
    gridSizeDesktop: 92,
    gridSizeMobile: 72,
    routeCountDesktop: 11,
    routeCountMobile: 7,
    packetsPerRouteDesktop: 2,
    packetsPerRouteMobile: 1,
    pointerRadius: 190,
    labels: ['SYS', 'NET', 'PROC', 'IO'],
} as const;

export const signalFieldPaletteFallbacks = {
    route: '#ff6b00',
    node: '#f5f5f5',
    packet: '#ff6b00',
    accent: '#ffc247',
    label: '#b8b8b8',
} as const;
