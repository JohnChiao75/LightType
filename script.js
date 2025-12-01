
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
            }
            
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
            
            // 简单的Markdown解析器
            function parseMarkdown(text) {
                // 处理标题
                text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');
                text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
                text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
                
                // 处理粗体
                text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                
                // 处理斜体
                text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
                
                // 处理代码块
                text = text.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
                
                // 处理行内代码
                text = text.replace(/`(.*?)`/g, '<code>$1</code>');
                
                // 处理链接
                text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
                
                // 处理图片
                text = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1">');
                
                // 处理引用
                text = text.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>');
                
                // 处理无序列表
                text = text.replace(/^\s*[-*] (.*$)/gm, '<li>$1</li>');
                text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
                
                // 处理有序列表
                text = text.replace(/^\s*\d+\. (.*$)/gm, '<li>$1</li>');
                text = text.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
                
                // 处理表格
                text = text.replace(/^\|(.+)\|$/gm, function(match) {
                    const cells = match.split('|').slice(1, -1);
                    return '<tr>' + cells.map(cell => `<td>${cell.trim()}</td>`).join('') + '</tr>';
                });
                
                // 处理换行
                text = text.replace(/\n/g, '<br>');
                
                return text;
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