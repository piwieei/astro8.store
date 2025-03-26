/**
 * 历史记录功能 JavaScript 文件
 * 包含历史记录显示、筛选和图表功能
 */

// 在文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化历史记录显示
    initHistoryDisplay();
    
    // 监听筛选按钮点击
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的激活状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的按钮添加激活状态
            this.classList.add('active');
            // 根据筛选条件更新历史记录
            updateHistoryDisplay(this.dataset.period);
        });
    });
    
    // 监听清除历史记录按钮点击
    const clearBtn = document.getElementById('clearHistoryBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('确定要清除所有历史记录吗？此操作不可恢复。')) {
                clearHistory();
            }
        });
    }
});

/**
 * 初始化历史记录显示
 */
function initHistoryDisplay() {
    // 获取历史记录
    const historyData = getHistoryData();
    
    // 检查是否有历史记录
    if (historyData.length === 0) {
        showNoRecordsMessage(true);
        return;
    }
    
    // 显示历史记录
    showNoRecordsMessage(false);
    
    // 更新历史记录表格和图表
    updateHistoryDisplay('all');
}

/**
 * 显示或隐藏无记录提示
 * @param {boolean} show - 是否显示无记录提示
 */
function showNoRecordsMessage(show) {
    const noRecordsMessage = document.getElementById('noRecordsMessage');
    const historyTableContainer = document.querySelector('.history-table-container');
    const historyChart = document.querySelector('.history-chart');
    const clearHistoryBtn = document.querySelector('.clear-history');
    const filtersSection = document.querySelector('.history-filters');
    
    if (noRecordsMessage && historyTableContainer && historyChart && clearHistoryBtn && filtersSection) {
        if (show) {
            noRecordsMessage.style.display = 'block';
            historyTableContainer.style.display = 'none';
            historyChart.style.display = 'none';
            clearHistoryBtn.style.display = 'none';
            filtersSection.style.display = 'none';
        } else {
            noRecordsMessage.style.display = 'none';
            historyTableContainer.style.display = 'block';
            historyChart.style.display = 'block';
            clearHistoryBtn.style.display = 'block';
            filtersSection.style.display = 'flex';
        }
    }
}

/**
 * 获取历史记录数据
 * @returns {Array} - 历史记录数据数组
 */
function getHistoryData() {
    const historyData = JSON.parse(localStorage.getItem('fortuneHistory')) || [];
    return historyData;
}

/**
 * 根据筛选条件更新历史记录显示
 * @param {string} period - 筛选周期：all(全部), week(最近一周), month(最近一月)
 */
function updateHistoryDisplay(period) {
    // 获取历史记录
    let historyData = getHistoryData();
    
    // 根据筛选条件过滤历史记录
    historyData = filterHistoryByPeriod(historyData, period);
    
    // 更新表格
    updateHistoryTable(historyData);
    
    // 更新图表
    updateHistoryChart(historyData);
}

/**
 * 根据周期筛选历史记录
 * @param {Array} historyData - 原始历史记录数据
 * @param {string} period - 筛选周期
 * @returns {Array} - 筛选后的历史记录数据
 */
function filterHistoryByPeriod(historyData, period) {
    if (period === 'all') {
        return historyData;
    }
    
    const now = new Date();
    let filterDate = new Date();
    
    if (period === 'week') {
        // 最近一周
        filterDate.setDate(now.getDate() - 7);
    } else if (period === 'month') {
        // 最近一月
        filterDate.setMonth(now.getMonth() - 1);
    }
    
    return historyData.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= filterDate;
    });
}

/**
 * 更新历史记录表格
 * @param {Array} historyData - 历史记录数据
 */
function updateHistoryTable(historyData) {
    const tableBody = document.getElementById('historyTableBody');
    if (!tableBody) return;
    
    // 清空表格内容
    tableBody.innerHTML = '';
    
    // 如果没有记录，显示提示信息
    if (historyData.length === 0) {
        tableBody.innerHTML = `
            <tr class="no-records">
                <td colspan="7">没有符合条件的记录</td>
            </tr>
        `;
        return;
    }
    
    // 按日期降序排序
    historyData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 添加记录到表格
    historyData.forEach((record, index) => {
        const date = new Date(record.date);
        const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        
        // 获取五行属性中文名和对应的CSS类
        let elementName = '-';
        let elementClass = '';
        let elementEmoji = '';
        
        if (record.strongestElement) {
            const elementNames = {
                'metal': '金',
                'wood': '木',
                'water': '水',
                'fire': '火',
                'earth': '土'
            };
            
            const elementEmojis = {
                'metal': '🔶',
                'wood': '🌿',
                'water': '💧',
                'fire': '🔥',
                'earth': '🟤'
            };
            
            elementName = elementNames[record.strongestElement] || '-';
            elementClass = `element-${record.strongestElement}`;
            elementEmoji = elementEmojis[record.strongestElement] || '';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${record.userName}</td>
            <td>${record.overallScore}</td>
            <td>${record.status}</td>
            <td>${record.lifeNumber || '-'}</td>
            <td class="${elementClass}">
                <span class="element-emoji-small">${elementEmoji}</span>
                <span class="element-name-small">${elementName}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-danger delete-record" data-index="${index}">删除</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // 绑定删除按钮事件
    const deleteButtons = document.querySelectorAll('.delete-record');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            deleteHistoryRecord(parseInt(this.dataset.index));
        });
    });
}

/**
 * 删除单条历史记录
 * @param {number} index - 记录索引
 */
function deleteHistoryRecord(index) {
    if (confirm('确定要删除这条记录吗？')) {
        // 获取历史记录
        let historyData = getHistoryData();
        
        // 删除指定记录
        historyData.splice(index, 1);
        
        // 保存更新后的记录
        localStorage.setItem('fortuneHistory', JSON.stringify(historyData));
        
        // 重新初始化显示
        initHistoryDisplay();
    }
}

/**
 * 清除所有历史记录
 */
function clearHistory() {
    // 清除本地存储中的历史记录
    localStorage.removeItem('fortuneHistory');
    
    // 重新初始化显示
    initHistoryDisplay();
}

/**
 * 更新历史记录图表
 * @param {Array} historyData - 历史记录数据
 */
function updateHistoryChart(historyData) {
    const chartCanvas = document.getElementById('historyChart');
    if (!chartCanvas) return;
    
    // 如果没有记录，清空图表
    if (historyData.length === 0) {
        if (window.historyChartInstance) {
            window.historyChartInstance.destroy();
            window.historyChartInstance = null;
        }
        return;
    }
    
    // 按日期升序排序
    historyData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 准备图表数据
    const labels = historyData.map(record => {
        const date = new Date(record.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    
    const scores = historyData.map(record => record.overallScore);
    
    // 创建渐变背景
    const ctx = chartCanvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(187, 134, 252, 0.8)');
    gradient.addColorStop(1, 'rgba(187, 134, 252, 0.1)');
    
    // 配置图表数据
    const data = {
        labels: labels,
        datasets: [{
            label: '运势评分',
            data: scores,
            fill: true,
            backgroundColor: gradient,
            borderColor: 'rgba(187, 134, 252, 1)',
            tension: 0.3,
            pointBackgroundColor: '#2c2c2c',
            pointBorderColor: 'rgba(187, 134, 252, 1)',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };
    
    // 配置图表选项
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '分';
                    },
                    color: '#e0e0e0'
                },
                grid: {
                    drawBorder: false,
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#e0e0e0'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(30, 30, 30, 0.9)',
                titleColor: '#bb86fc',
                bodyColor: '#e0e0e0',
                borderColor: 'rgba(187, 134, 252, 0.5)',
                borderWidth: 1,
                titleFont: {
                    size: 14,
                    weight: 'bold'
                },
                bodyFont: {
                    size: 13
                },
                padding: 12,
                displayColors: false,
                callbacks: {
                    title: function(tooltipItems) {
                        const index = tooltipItems[0].dataIndex;
                        const date = new Date(historyData[index].date);
                        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
                    },
                    label: function(context) {
                        const record = historyData[context.dataIndex];
                        return `${record.overallScore}分 (${record.status})`;
                    },
                    afterLabel: function(context) {
                        const record = historyData[context.dataIndex];
                        let info = `用户：${record.userName}`;
                        
                        if (record.lifeNumber) {
                            info += `\n生命灵数：${record.lifeNumber}`;
                        }
                        
                        if (record.strongestElement) {
                            const elementColors = {
                                'metal': '#FFD700',
                                'wood': '#4CAF50',
                                'water': '#03A9F4',
                                'fire': '#F44336',
                                'earth': '#795548'
                            };
                            
                            const elementName = {
                                'metal': '金',
                                'wood': '木',
                                'water': '水',
                                'fire': '火',
                                'earth': '土'
                            }[record.strongestElement] || record.strongestElement;
                            
                            // Chart.js的tooltip不支持CSS，但可以使用emoji来区分
                            const elementEmojis = {
                                'metal': '🔶',
                                'wood': '🌿',
                                'water': '💧',
                                'fire': '🔥',
                                'earth': '🟤'
                            };
                            
                            const emoji = elementEmojis[record.strongestElement] || '⭐';
                            info += `\n主要五行：${emoji} ${elementName}`;
                        }
                        
                        if (record.luckyNumber) {
                            info += `\n幸运数字：${record.luckyNumber}`;
                        }
                        
                        return info;
                    }
                }
            }
        }
    };
    
    // 如果图表已存在，先销毁
    if (window.historyChartInstance) {
        window.historyChartInstance.destroy();
    }
    
    // 创建新图表
    window.historyChartInstance = new Chart(chartCanvas, {
        type: 'line',
        data: data,
        options: options
    });
} 