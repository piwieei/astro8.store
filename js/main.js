/**
 * 每日运势网站主要 JavaScript 文件
 * 包含网站的基本交互功能
 */

// 在文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 导航菜单高亮当前页面
    highlightCurrentPage();
    
    // 添加平滑滚动效果
    setupSmoothScroll();
    
    // 设置响应式菜单切换
    setupMobileMenu();
    
    // 设置返回顶部按钮
    setupBackToTop();
});

/**
 * 高亮当前页面的导航菜单项
 */
function highlightCurrentPage() {
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    const fileName = currentPath.split('/').pop();
    
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.main-nav a');
    
    // 遍历链接并检查是否匹配当前页面
    navLinks.forEach(link => {
        // 从链接中获取文件名
        const linkPath = link.getAttribute('href');
        
        // 如果链接的 href 属性与当前页面的文件名匹配，则添加 active 类
        if (linkPath === fileName || 
            (fileName === '' && linkPath === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/**
 * 设置页面内锚点的平滑滚动效果
 */
function setupSmoothScroll() {
    // 获取所有内部锚点链接
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    // 为每个锚点链接添加点击事件监听器
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 获取目标元素的 ID
            const targetId = this.getAttribute('href').substring(1);
            
            // 如果目标 ID 存在
            if (targetId) {
                // 获取目标元素
                const targetElement = document.getElementById(targetId);
                
                // 如果目标元素存在
                if (targetElement) {
                    // 阻止默认行为
                    e.preventDefault();
                    
                    // 平滑滚动到目标元素
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/**
 * 设置移动设备上的菜单切换功能
 */
function setupMobileMenu() {
    // 添加菜单按钮（如果不存在）
    const header = document.querySelector('.header .container');
    let menuBtn = document.querySelector('.mobile-menu-btn');
    
    // 如果移动菜单按钮不存在，创建一个
    if (!menuBtn && header) {
        menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '&#9776; 菜单';
        menuBtn.style.display = 'none'; // 初始隐藏
        
        // 添加按钮到顶部导航
        const nav = document.querySelector('.main-nav');
        if (nav && header) {
            header.insertBefore(menuBtn, nav);
            
            // 添加点击事件处理
            menuBtn.addEventListener('click', function() {
                nav.classList.toggle('show');
            });
        }
    }
    
    // 窗口大小变化时适应
    window.addEventListener('resize', function() {
        adjustMobileMenu();
    });
    
    // 初始检查
    adjustMobileMenu();
}

/**
 * 调整移动菜单显示
 */
function adjustMobileMenu() {
    const nav = document.querySelector('.main-nav');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    
    if (window.innerWidth <= 767) {
        if (menuBtn) menuBtn.style.display = 'block';
        if (nav) nav.classList.add('mobile');
    } else {
        if (menuBtn) menuBtn.style.display = 'none';
        if (nav) {
            nav.classList.remove('mobile');
            nav.classList.remove('show');
        }
    }
}

/**
 * 设置返回顶部按钮
 */
function setupBackToTop() {
    // 创建返回顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '&#8593;';
    backToTopBtn.title = '返回顶部';
    backToTopBtn.style.display = 'none';
    
    // 添加按钮到页面
    document.body.appendChild(backToTopBtn);
    
    // 监听滚动事件
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // 添加点击事件
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 添加返回顶部按钮样式
    const style = document.createElement('style');
    style.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 40px;
            height: 40px;
            background-color: #6a5acd;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            line-height: 40px;
            text-align: center;
            z-index: 99;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .back-to-top:hover {
            opacity: 1;
        }
        
        @media (max-width: 767px) {
            .back-to-top {
                bottom: 20px;
                right: 20px;
                width: 35px;
                height: 35px;
                line-height: 35px;
            }
        }
    `;
    document.head.appendChild(style);
} 