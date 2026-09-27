/* ==========================================================================
   QuanLLM 主题切换
   --------------------------------------------------------------------------
   - 默认暗色（与 styles.css 一致）；
   - 用户选择写入 localStorage('quanllm-theme')，刷新后保持；
   - 未手动选择过时跟随系统 prefers-color-scheme；
   - 首屏防闪烁由 <head> 里的内联脚本负责（见各页 <head>），本文件负责交互。
   ========================================================================== */
(function () {
    var STORAGE_KEY = 'quanllm-theme';
    var root = document.documentElement;

    function readStored() {
        try {
            var v = localStorage.getItem(STORAGE_KEY);
            return (v === 'light' || v === 'dark') ? v : null;
        } catch (e) {
            return null;
        }
    }

    function store(theme) {
        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* 隐私模式忽略 */ }
    }

    function currentTheme() {
        return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function apply(theme) {
        root.setAttribute('data-theme', theme);
        // 同步浏览器 UI 配色（滚动条、表单控件）
        root.style.colorScheme = theme;
        syncButtons(theme);
    }

    function syncButtons(theme) {
        var isLight = theme === 'light';
        var label = isLight ? '切换到暗色主题' : '切换到浅色主题';
        document.querySelectorAll('.theme-toggle').forEach(function (btn) {
            btn.setAttribute('aria-pressed', String(isLight));
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
        });
    }

    function toggle() {
        var next = currentTheme() === 'light' ? 'dark' : 'light';
        apply(next);
        store(next);
    }

    // 初始化：优先用户选择，其次系统偏好
    if (!root.getAttribute('data-theme')) {
        var stored = readStored();
        if (stored) {
            apply(stored);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            apply('light');
        } else {
            apply('dark');
        }
    } else {
        root.style.colorScheme = currentTheme();
        syncButtons(currentTheme());
    }

    // 绑定切换按钮（导航栏在每个页面各有一个）
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
        btn.addEventListener('click', toggle);
    });

    // 用户没有手动选择过时，跟随系统主题变化
    if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: light)');
        var onChange = function (e) {
            if (readStored()) return;
            apply(e.matches ? 'light' : 'dark');
        };
        if (mq.addEventListener) mq.addEventListener('change', onChange);
        else if (mq.addListener) mq.addListener(onChange);
    }

    // 暴露给调试/测试
    window.__QL_THEME__ = {
        get: currentTheme,
        set: function (t) { apply(t); store(t); },
        toggle: toggle
    };
})();
