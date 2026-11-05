import { defaultTheme, isThemeId, themeStorageKey, themes, type ThemeId } from '../data/themes';

const getTheme = (): ThemeId => {
    try {
        const storedTheme = window.localStorage.getItem(themeStorageKey);
        return isThemeId(storedTheme) ? storedTheme : defaultTheme;
    } catch {
        return defaultTheme;
    }
};

const updateThemeControls = (themeId: ThemeId) => {
    document.querySelectorAll<HTMLElement>('[data-theme-picker]').forEach((picker) => {
        const currentTheme = themes.find((theme) => theme.id === themeId) ?? themes[0];
        const currentLabel = picker.querySelector<HTMLElement>('[data-theme-current]');
        if (currentLabel) currentLabel.textContent = currentTheme.label;

        const currentSwatch = picker.querySelector<HTMLElement>('[data-theme-current-swatch]');
        if (currentSwatch) {
            currentSwatch.style.setProperty('--theme-preview-background', currentTheme.previewBackground);
            currentSwatch.style.setProperty('--theme-preview-accent', currentTheme.previewAccent);
        }

        picker.querySelectorAll<HTMLButtonElement>('[data-theme-option]').forEach((option) => {
            const selected = option.dataset.themeOption === themeId;
            option.setAttribute('aria-selected', String(selected));
            option.tabIndex = selected ? 0 : -1;
        });
    });
};

export const applyTheme = (themeId: ThemeId, persist = true) => {
    const theme = themes.find((candidate) => candidate.id === themeId) ?? themes[0];
    document.documentElement.dataset.theme = theme.id;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme.themeColor);

    if (persist) {
        try {
            window.localStorage.setItem(themeStorageKey, theme.id);
        } catch {
            // A private browsing context may reject local storage. The theme still applies for this page.
        }
    }

    updateThemeControls(theme.id);
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme.id } }));
};

export const initializeTheme = () => {
    const themeId = getTheme();
    applyTheme(themeId, false);
};

export const initializeThemeControls = () => {
    initializeTheme();

    document.querySelectorAll<HTMLElement>('[data-theme-picker]').forEach((picker) => {
        const toggle = picker.querySelector<HTMLButtonElement>('[data-theme-toggle]');
        const options = picker.querySelector<HTMLElement>('[data-theme-options]');

        if (!toggle || !options || picker.dataset.initialized === 'true') return;
        picker.dataset.initialized = 'true';

        const setOpen = (open: boolean) => {
            toggle.setAttribute('aria-expanded', String(open));
            options.hidden = !open;
            picker.classList.toggle('is-open', open);
        };

        toggle.addEventListener('click', () => setOpen(options.hidden));

        picker.querySelectorAll<HTMLButtonElement>('[data-theme-option]').forEach((option) => {
            option.addEventListener('click', () => {
                const nextTheme = option.dataset.themeOption;
                if (isThemeId(nextTheme)) applyTheme(nextTheme);
                setOpen(false);
            });
        });

        document.addEventListener('click', (event) => {
            if (event.target instanceof Node && !picker.contains(event.target)) setOpen(false);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setOpen(false);
        });
    });
};
