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
    route: '#a97560',
    node: '#d2a38e',
    packet: '#c18468',
    accent: '#c0a77a',
    label: '#a69b91',
} as const;
