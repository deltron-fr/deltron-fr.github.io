import { signalFieldConfig, signalFieldPaletteFallbacks } from '../data/signal-field';

type Point = { x: number; y: number };
type Segment = { start: Point; end: Point; length: number };
type Route = { segments: Segment[]; length: number; speed: number; offset: number; accent: boolean };
type Palette = Record<keyof typeof signalFieldPaletteFallbacks, [number, number, number]>;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const rgba = ([r, g, b]: [number, number, number], alpha: number) => `rgba(${r}, ${g}, ${b}, ${alpha})`;

const createRandom = (seed: number) => () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
};

const cssColorToRgb = (value: string, fallback: string): [number, number, number] => {
    const sample = document.createElement('span');
    sample.style.color = value.trim() || fallback;
    document.body.append(sample);
    const resolved = getComputedStyle(sample).color;
    sample.remove();
    const channels = resolved.match(/\d+(?:\.\d+)?/g);

    return channels && channels.length >= 3
        ? [Number(channels[0]), Number(channels[1]), Number(channels[2])]
        : cssColorToRgb(fallback, '#ffffff');
};

const readPalette = (): Palette => {
    const styles = getComputedStyle(document.documentElement);

    return {
        route: cssColorToRgb(styles.getPropertyValue('--signal-route'), signalFieldPaletteFallbacks.route),
        node: cssColorToRgb(styles.getPropertyValue('--signal-node'), signalFieldPaletteFallbacks.node),
        packet: cssColorToRgb(styles.getPropertyValue('--signal-packet'), signalFieldPaletteFallbacks.packet),
        accent: cssColorToRgb(styles.getPropertyValue('--accent'), signalFieldPaletteFallbacks.accent),
        label: cssColorToRgb(styles.getPropertyValue('--muted'), signalFieldPaletteFallbacks.label),
    };
};

const pointOnRoute = (route: Route, progress: number): Point => {
    let remaining = ((progress % route.length) + route.length) % route.length;

    for (const segment of route.segments) {
        if (remaining <= segment.length) {
            const ratio = segment.length ? remaining / segment.length : 0;
            return {
                x: segment.start.x + (segment.end.x - segment.start.x) * ratio,
                y: segment.start.y + (segment.end.y - segment.start.y) * ratio,
            };
        }

        remaining -= segment.length;
    }

    return route.segments.at(-1)?.end ?? { x: 0, y: 0 };
};

export const mountSignalField = (root: HTMLElement) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return () => {};

    root.append(canvas);

    let width = 1;
    let height = 1;
    let routes: Route[] = [];
    let nodes: Point[] = [];
    let palette = readPalette();
    let pointer: Point | null = null;
    let animationFrame = 0;
    let visible = true;
    let previousTime = performance.now();
    let elapsed = 0;

    const buildNetwork = () => {
        const mobile = window.innerWidth < signalFieldConfig.mobileBreakpoint;
        const spacing = mobile ? signalFieldConfig.gridSizeMobile : signalFieldConfig.gridSizeDesktop;
        const routeCount = mobile ? signalFieldConfig.routeCountMobile : signalFieldConfig.routeCountDesktop;
        const columns = Math.max(4, Math.ceil(width / spacing) + 1);
        const rows = Math.max(5, Math.ceil(height / spacing) + 1);
        const random = createRandom(Math.round(width * 17 + height * 31));
        const nodeKeys = new Set<string>();

        routes = Array.from({ length: routeCount }, (_, routeIndex) => {
            let column = Math.floor(random() * columns);
            let row = Math.floor(random() * rows);
            const points: Point[] = [{ x: column * spacing, y: row * spacing }];
            const steps = 4 + Math.floor(random() * (mobile ? 4 : 7));

            for (let step = 0; step < steps; step += 1) {
                const horizontal = step % 2 === routeIndex % 2;
                const amount = 1 + Math.floor(random() * 3);
                const direction = random() > 0.5 ? 1 : -1;

                if (horizontal) column = clamp(column + amount * direction, 0, columns - 1);
                else row = clamp(row + amount * direction, 0, rows - 1);

                const point = { x: column * spacing, y: row * spacing };
                if (distance(points.at(-1)!, point) > 0) points.push(point);
            }

            const segments = points.slice(0, -1).map((start, index) => {
                const end = points[index + 1]!;
                return { start, end, length: distance(start, end) };
            });

            points.forEach((point) => nodeKeys.add(`${point.x}:${point.y}`));

            return {
                segments,
                length: segments.reduce((total, segment) => total + segment.length, 0),
                speed: 26 + random() * 34,
                offset: random() * 1000,
                accent: routeIndex % 5 === 3,
            };
        }).filter((route) => route.length > 0);

        nodes = Array.from(nodeKeys, (key) => {
            const [x, y] = key.split(':').map(Number);
            return { x: x!, y: y! };
        });
    };

    const resize = () => {
        width = Math.max(root.clientWidth, 1);
        height = Math.max(root.clientHeight, 1);
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.floor(width * ratio);
        canvas.height = Math.floor(height * ratio);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        palette = readPalette();
        buildNetwork();
    };

    const pointerStrength = (point: Point) => pointer
        ? clamp(1 - distance(point, pointer) / signalFieldConfig.pointerRadius, 0, 1)
        : 0;

    const draw = (time: number) => {
        const delta = Math.min(time - previousTime, 50);
        previousTime = time;
        elapsed += delta;
        context.clearRect(0, 0, width, height);

        const shiftX = pointer ? (pointer.x / width - 0.5) * 7 : 0;
        const shiftY = pointer ? (pointer.y / height - 0.5) * 7 : 0;
        context.save();
        context.translate(shiftX, shiftY);

        routes.forEach((route) => {
            route.segments.forEach((segment) => {
                const midpoint = {
                    x: (segment.start.x + segment.end.x) / 2,
                    y: (segment.start.y + segment.end.y) / 2,
                };
                const strength = pointerStrength(midpoint);
                context.strokeStyle = rgba(route.accent ? palette.accent : palette.route, 0.09 + strength * 0.28);
                context.lineWidth = 1 + strength * 0.65;
                context.beginPath();
                context.moveTo(segment.start.x, segment.start.y);
                context.lineTo(segment.end.x, segment.end.y);
                context.stroke();
            });

            const packetCount = window.innerWidth < signalFieldConfig.mobileBreakpoint
                ? signalFieldConfig.packetsPerRouteMobile
                : signalFieldConfig.packetsPerRouteDesktop;

            for (let packetIndex = 0; packetIndex < packetCount; packetIndex += 1) {
                const progress = elapsed * route.speed / 1000 + route.offset + route.length * packetIndex / packetCount;
                const point = pointOnRoute(route, progress);
                const strength = pointerStrength(point);
                const packetColor = route.accent ? palette.accent : palette.packet;
                const glow = context.createRadialGradient(point.x, point.y, 0, point.x, point.y, 10 + strength * 6);
                glow.addColorStop(0, rgba(packetColor, 0.76));
                glow.addColorStop(0.25, rgba(packetColor, 0.18));
                glow.addColorStop(1, rgba(packetColor, 0));
                context.fillStyle = glow;
                context.beginPath();
                context.arc(point.x, point.y, 10 + strength * 6, 0, Math.PI * 2);
                context.fill();
                context.fillStyle = rgba(packetColor, 0.86);
                context.fillRect(point.x - 2.5, point.y - 2.5, 5, 5);
            }
        });

        nodes.forEach((node, index) => {
            const strength = pointerStrength(node);
            context.fillStyle = rgba(palette.node, 0.22 + strength * 0.48);
            context.fillRect(node.x - 2, node.y - 2, 4, 4);

            if (index % Math.max(7, Math.floor(nodes.length / 4)) === 2) {
                const label = signalFieldConfig.labels[index % signalFieldConfig.labels.length];
                context.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
                context.letterSpacing = '1px';
                context.fillStyle = rgba(palette.label, 0.5 + strength * 0.35);
                context.fillText(`${label} // ${String(index).padStart(2, '0')}`, node.x + 9, node.y - 8);
            }
        });

        context.restore();
        if (visible && document.visibilityState === 'visible') animationFrame = requestAnimationFrame(draw);
    };

    const syncPointer = (event: PointerEvent) => {
        const rect = root.getBoundingClientRect();
        const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        pointer = point.x >= 0 && point.y >= 0 && point.x <= rect.width && point.y <= rect.height ? point : null;
    };

    const clearPointer = () => { pointer = null; };
    const onThemeChange = () => { palette = readPalette(); };
    const resume = () => {
        if (!visible || document.visibilityState !== 'visible' || animationFrame) return;
        previousTime = performance.now();
        animationFrame = requestAnimationFrame((time) => {
            animationFrame = 0;
            draw(time);
        });
    };
    const pause = () => {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
    };
    const onVisibilityChange = () => document.visibilityState === 'visible' ? resume() : pause();

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? true;
        if (visible) resume(); else pause();
    });

    resize();
    resizeObserver.observe(root);
    intersectionObserver.observe(root);
    window.addEventListener('pointermove', syncPointer, { passive: true });
    window.addEventListener('pointerleave', clearPointer);
    window.addEventListener('blur', clearPointer);
    window.addEventListener('themechange', onThemeChange);
    document.addEventListener('visibilitychange', onVisibilityChange);
    resume();

    return () => {
        pause();
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        window.removeEventListener('pointermove', syncPointer);
        window.removeEventListener('pointerleave', clearPointer);
        window.removeEventListener('blur', clearPointer);
        window.removeEventListener('themechange', onThemeChange);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        canvas.remove();
    };
};
