
        document.addEventListener('DOMContentLoaded', function() {
            const markdownInput = document.getElementById('markdown-input');
            const preview = document.getElementById('preview');
            const lineNumbers = document.querySelector('.line-numbers');
            const codeViewBtn = document.getElementById('code-view');
            const splitViewBtn = document.getElementById('split-view');
            const previewViewBtn = document.getElementById('preview-view');
            const editorPanel = document.querySelector('.editor-panel');
            const previewPanel = document.querySelector('.preview-panel');
            
            // 初始渲染
            updatePreview();
            updateLineNumbers();
            
            // 输入事件监听
            markdownInput.addEventListener('input', function() {
                updatePreview();
                updateLineNumbers();
            });
            
            // 滚动同步
            markdownInput.addEventListener('scroll', function() {
                lineNumbers.scrollTop = markdownInput.scrollTop;
            });
            
            // 视图切换
            codeViewBtn.addEventListener('click', function() {
                setActiveView('code');
            });
            
            splitViewBtn.addEventListener('click', function() {
                setActiveView('split');
            });
            
            previewViewBtn.addEventListener('click', function() {
                setActiveView('preview');
            });
            
            // 更新预览
            function updatePreview() {
                const markdownText = markdownInput.value;
                preview.innerHTML = parseMarkdown(markdownText);
                openLinks();
            }
            function openLinks() {
                if (!preview) return;
                preview.querySelectorAll('a').forEach(a => {
                    try {
                        a.setAttribute('target', '_blank');
                        a.setAttribute('rel', 'noopener noreferrer');
                    } catch (e) {
                    }
                });
            }

            preview.addEventListener('click', function(e) {
                const anchor = e.target.closest && e.target.closest('a');
                if (!anchor || !preview.contains(anchor)) return;

                const href = anchor.getAttribute('href') || anchor.href;
                if (!href) return;
                if (href.startsWith('#')) return;

                e.preventDefault();
                try {
                    if (window.__TAURI__ && window.__TAURI__.shell && typeof window.__TAURI__.shell.open === 'function') {
                        window.__TAURI__.shell.open(href);
                        return;
                    }
                } catch (err) {
                }
                window.open(href, '_blank', 'noopener');
            });
            
            // 更新行号
            function updateLineNumbers() {
                const lineCount = markdownInput.value.split('\n').length;
                let numbersHTML = '';
                
                for (let i = 1; i <= lineCount; i++) {
                    numbersHTML += i + '<br>';
                }
                
                lineNumbers.innerHTML = numbersHTML;
            }
            
            // 设置活动视图
            function setActiveView(view) {
                // 重置所有按钮状态
                codeViewBtn.classList.remove('active');
                splitViewBtn.classList.remove('active');
                previewViewBtn.classList.remove('active');
                
                // 根据视图类型设置显示
                switch(view) {
                    case 'code':
                        codeViewBtn.classList.add('active');
                        editorPanel.classList.remove('hidden');
                        previewPanel.classList.add('hidden');
                        editorPanel.classList.add('full-width');
                        break;
                    case 'split':
                        splitViewBtn.classList.add('active');
                        editorPanel.classList.remove('hidden');
                        previewPanel.classList.remove('hidden');
                        editorPanel.classList.remove('full-width');
                        break;
                    case 'preview':
                        previewViewBtn.classList.add('active');
                        editorPanel.classList.add('hidden');
                        previewPanel.classList.remove('hidden');
                        previewPanel.classList.add('full-width');
                        break;
                }
            }
            
            if (typeof marked !== 'undefined') {
                const renderer = new marked.Renderer();
                const originalCode = renderer.code.bind(renderer);
                
                renderer.code = function(code, language) {
                    if (language && typeof hljs !== 'undefined') {
                        try {
                            const highlighted = hljs.highlight(code, { language: language }).value;
                            return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
                        } catch (e) {
                            console.warn('无法高亮:', language, e.message);
                        }
                    }
                    return originalCode(code, language);
                };
                
                marked.setOptions({
                    gfm: true,
                    breaks: false,
                    renderer: renderer
                });
            }
            
            function parseMarkdown(text) {
                if (typeof marked === 'undefined') {
                    return '<p style="color: red;">解析器加载失败 无法渲染</p>';
                }
                try {
                    return marked.parse(text);
                } catch (e) {
                    return `<p style="color: red;">Markdown 解析错误: ${e.message}</p>`;
                }
            }
// ===== 主题切换 =====
const themeSelect = document.getElementById('theme-select');
// 读取用户上次选择
const saved = localStorage.getItem('theme') || 'light';
themeSelect.value = saved;
document.documentElement.setAttribute('data-theme', saved);

themeSelect.addEventListener('change', e => {
  const t = e.target.value;
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
});

        });