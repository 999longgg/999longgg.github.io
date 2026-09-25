// Navigation scroll effect
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// ===== 主页反馈 (3)：research-flow 滚动到视口时，各环节按顺序依次出现 =====
(function researchFlowReveal() {
    const flow = document.querySelector('.research-flow');
    if (!flow) return;

    // 没有 IntersectionObserver 时直接显示，避免内容永久不可见
    if (!('IntersectionObserver' in window)) return;

    flow.classList.add('js-reveal');

    const flowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            // 触发一次即可，错开延迟由 CSS 的 transition-delay 控制
            entry.target.classList.add('is-revealed');
            flowObserver.unobserve(entry.target);
        });
    }, { threshold: 0.25 });

    flowObserver.observe(flow);
})();

// Close mobile menu when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== 测试反馈 #3：副导航栏当前区块高亮 =====
(function highlightSubNav() {
    const subLinks = Array.from(document.querySelectorAll('.nav-sub-list a[href^="#"]'));
    if (!subLinks.length || !('IntersectionObserver' in window)) return;

    // 建立 页面区块 -> 副导航链接 的映射
    const sections = subLinks
        .map(link => {
            const id = link.getAttribute('href').slice(1);
            const el = document.getElementById(id);
            return el ? { link: link, el: el } : null;
        })
        .filter(Boolean);

    if (!sections.length) return;

    const setActive = (activeLink) => {
        subLinks.forEach(link => link.classList.toggle('is-active', link === activeLink));
    };

    const subNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const match = sections.find(item => item.el === entry.target);
            if (match) setActive(match.link);
        });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(item => subNavObserver.observe(item.el));
})();

// Intersection Observer for fade-in animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add animation classes to cards
document.querySelectorAll('.about-card, .feature-card, .roadmap-item, .tech-item').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
    el.classList.add('animate-on-scroll');
    observer.observe(el);
});

// Handle visibility class
const style = document.createElement('style');
style.textContent = `
    .animate-on-scroll.visible {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Demo input interaction (visual only)
const demoInput = document.querySelector('.demo-input input');
if (demoInput) {
    demoInput.addEventListener('focus', () => {
        demoInput.parentElement.classList.add('focused');
    });
    demoInput.addEventListener('blur', () => {
        demoInput.parentElement.classList.remove('focused');
    });
}

// ===== 测试反馈 #1：邮件模板一键复制 =====
(function initCopyButtons() {
    const buttons = document.querySelectorAll('[data-copy-target]');
    if (!buttons.length) return;

    // 复制内容：按 data-copy-target 选择器取目标元素的纯文本
    const resolveText = (button) => {
        const selector = button.getAttribute('data-copy-target');
        const target = selector ? document.querySelector(selector) : null;
        if (!target) return '';
        return (target.innerText || target.textContent || '').replace(/\r\n/g, '\n').trim();
    };

    // 兜底方案：execCommand('copy')，用于非安全上下文或不支持剪贴板 API 的浏览器
    const legacyCopy = (text) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (err) {
            ok = false;
        }
        document.body.removeChild(textarea);
        return ok;
    };

    const writeClipboard = (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text)
                .then(() => true)
                .catch(() => legacyCopy(text));
        }
        return Promise.resolve(legacyCopy(text));
    };

    buttons.forEach(button => {
        const label = button.querySelector('.copy-btn__label');
        // data-label-* 让中英文页面各自显示对应文案
        const idleText = button.getAttribute('data-label-idle') || (label ? label.textContent : '复制');
        const doneText = button.getAttribute('data-label-done') || '已复制';
        const failText = button.getAttribute('data-label-fail') || '复制失败';
        let resetTimer = null;

        button.addEventListener('click', () => {
            const text = resolveText(button);
            if (!text) return;

            writeClipboard(text).then(success => {
                button.classList.toggle('is-copied', success);
                button.classList.toggle('is-failed', !success);
                if (label) label.textContent = success ? doneText : failText;

                clearTimeout(resetTimer);
                resetTimer = setTimeout(() => {
                    button.classList.remove('is-copied', 'is-failed');
                    if (label) label.textContent = idleText;
                }, 2000);
            });
        });
    });
})();
