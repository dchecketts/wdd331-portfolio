const byId = id => document.getElementById(id);
const originalRootLineHeight = document.documentElement.style.lineHeight;
const setOutput = (id, value) => { byId(id).value = value; };
const rangeValue = (id, outputId, unit = '') => {
    const input = byId(id);
    const value = Number(input.value);
    const label = `${value}${unit}`;
    setOutput(outputId, label);
    input.setAttribute('aria-valuetext', label);
    return value;
};

const updateWrapping = () => {
    const mode = byId('wrap-mode').value;
    const width = rangeValue('poster-width', 'poster-width-value', 'rem');
    byId('poster').style.setProperty('--poster-width', `${width}rem`);
    byId('poster').style.setProperty('--wrap-mode', mode);
    byId('live-headline').textContent = byId('poster-title').value;
    byId('wrap-code').textContent = `.poster h3, .poster .invitation { text-wrap: ${mode}; }\n.poster { max-inline-size: ${width}rem; }`;
};

const updateInitial = () => {
    const size = Number(byId('initial-size').value);
    const sink = Number(byId('initial-sink').value);
    const value = size === 1 ? 'normal' : `${size} ${sink}`;
    byId('opening').style.setProperty('--initial', value);
    byId('opening').classList.toggle('initial-off', size === 1);
    byId('initial-sink').disabled = size === 1;
    byId('initial-code').textContent = `.drop-cap::first-letter {\n    -webkit-initial-letter: ${value};\n    initial-letter: ${value};\n}`;
};

const updateClamp = () => {
    const lines = rangeValue('clamp-lines', 'clamp-value', ' lines');
    if (lines === 1) setOutput('clamp-value', '1 line');
    const enabled = byId('clamp-enabled').checked;
    byId('event-preview').classList.toggle('clamped', enabled);
    byId('event-preview').style.setProperty('--preview-lines', lines);
    byId('clamp-lines').disabled = !enabled;
    byId('clamp-code').textContent = enabled
        ? `.clamped {\n    display: -webkit-box;\n    -webkit-box-orient: vertical;\n    -webkit-line-clamp: ${lines};\n    overflow: hidden;\n}`
        : '.preview { display: block; overflow: visible; }';
};

const updateMetrics = () => {
    const preview = byId('measure-preview');
    const marker = preview.querySelector('.inline-marker');
    setOutput('measure-metrics', `Rendered width: ${preview.getBoundingClientRect().width.toFixed(1)}px. Marker: ${marker.getBoundingClientRect().height.toFixed(1)}px tall (1ex).`);
    const local = getComputedStyle(document.querySelector('.rhythm-local p')).paddingBottom;
    const root = getComputedStyle(document.querySelector('.rhythm-root p')).paddingBottom;
    setOutput('rhythm-metrics', `Tinted bottom padding: 1lh = ${local}; 1rlh = ${root}.`);
};

const updateMeasure = () => {
    const measure = rangeValue('measure', 'measure-value', 'ch');
    const size = rangeValue('text-size', 'size-value', 'px');
    const fonts = { body: 'var(--font-family-body)', mono: 'var(--font-family-mono)', serif: 'Georgia, serif' };
    const preview = byId('measure-preview');
    preview.style.setProperty('--measure', `${measure}ch`);
    preview.style.fontSize = `${size}px`;
    preview.style.fontFamily = fonts[byId('sample-font').value];
    byId('measure-code').textContent = `.invitation { max-inline-size: ${measure}ch; font-size: ${size}px; }\n.marker { inline-size: 1ex; block-size: 1ex; }`;
    updateMetrics();
};

let rootChanged = false;
const updateRhythm = () => {
    const leading = rangeValue('line-height', 'rhythm-value');
    byId('rhythm-preview').style.setProperty('--sample-leading', leading);
    if (rootChanged) document.documentElement.style.lineHeight = `${byId('root-height').value}px`;
    const root = parseFloat(getComputedStyle(document.documentElement).lineHeight);
    setOutput('root-value', `${root}px`);
    byId('rhythm-code').textContent = `html { line-height: ${root}px; }\n.note p { line-height: ${leading}; }\n.local p { padding-block-end: 1lh; }\n.shared p { padding-block-end: 1rlh; }`;
    updateMetrics();
};

// The initial root line-height is explicit in CSS so rlh has a stable baseline.
const initialRootHeight = parseFloat(getComputedStyle(document.documentElement).lineHeight);
byId('root-height').value = initialRootHeight;
byId('root-height').defaultValue = initialRootHeight;

const groups = [
    [['wrap-mode', 'poster-width', 'poster-title'], updateWrapping],
    [['initial-size', 'initial-sink'], updateInitial],
    [['clamp-lines', 'clamp-enabled'], updateClamp],
    [['measure', 'text-size', 'sample-font'], updateMeasure],
    [['line-height'], updateRhythm],
];
for (const [ids, update] of groups) {
    ids.forEach(id => byId(id).addEventListener('input', update));
    update();
}
byId('root-height').addEventListener('input', () => {
    rootChanged = true;
    rangeValue('root-height', 'root-value', 'px');
    updateRhythm();
});

byId('reset').addEventListener('click', () => {
    document.querySelectorAll('main input, main select').forEach(control => {
        if (control.tagName === 'SELECT') {
            control.selectedIndex = [...control.options].findIndex(option => option.defaultSelected);
            if (control.selectedIndex < 0) control.selectedIndex = 0;
        } else if (control.type === 'checkbox') control.checked = control.defaultChecked;
        else control.value = control.defaultValue;
    });
    document.querySelectorAll('main details').forEach(details => { details.open = false; });
    rootChanged = false;
    document.documentElement.style.lineHeight = originalRootLineHeight;
    groups.forEach(([, update]) => update());
});

const supports = (property, value) => CSS.supports(property, value);
byId('support').textContent = `This browser recognizes: balance ${supports('text-wrap', 'balance') ? '✓' : '✕'}, pretty ${supports('text-wrap', 'pretty') ? '✓' : '✕'}, initial-letter ${supports('initial-letter', '3') || supports('-webkit-initial-letter', '3') ? '✓' : '✕'}. Recognition does not guarantee a visible change at every width.`;
new ResizeObserver(updateMetrics).observe(byId('measure-preview'));
document.fonts.ready.then(updateMetrics);
window.addEventListener('resize', updateMetrics);
document.querySelectorAll('[data-enhanced]').forEach(control => { control.hidden = false; });
