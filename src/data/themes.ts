export const themes = [
    {
        id: 'ember',
        label: 'Ember',
        description: 'Black, white, and orange',
        previewBackground: '#050505',
        previewAccent: '#ff6b00',
        themeColor: '#050505',
    },
    {
        id: 'cobalt',
        label: 'Cobalt',
        description: 'Black, white, and blue',
        previewBackground: '#05080d',
        previewAccent: '#42a5ff',
        themeColor: '#05080d',
    },
    {
        id: 'terminal',
        label: 'Terminal',
        description: 'Black, white, and lime',
        previewBackground: '#030704',
        previewAccent: '#7dff6b',
        themeColor: '#030704',
    },
    {
        id: 'violet',
        label: 'Violet',
        description: 'Black, white, and violet',
        previewBackground: '#07050b',
        previewAccent: '#b78cff',
        themeColor: '#07050b',
    },
    {
        id: 'clay',
        label: 'Clay',
        description: 'Graphite and clay',
        previewBackground: '#171615',
        previewAccent: '#c18468',
        themeColor: '#171615',
    },
] as const;

export type ThemeId = (typeof themes)[number]['id'];
export const defaultTheme: ThemeId = 'ember';
export const themeStorageKey = 'kelechi-theme';

export const isThemeId = (value: string | null | undefined): value is ThemeId =>
    themes.some((theme) => theme.id === value);
