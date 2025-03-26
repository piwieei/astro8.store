/**
 * 每日运势测试功能 JavaScript 文件
 * 包含运势计算和结果展示功能
 */

// 在文档加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化年份选择器
    initBirthYearOptions();
    
    // 初始化日期选择器
    initBirthDayOptions();
    
    // 监听月份选择变化，更新日期选项
    const birthMonthSelect = document.getElementById('birthMonth');
    if (birthMonthSelect) {
        birthMonthSelect.addEventListener('change', updateBirthDayOptions);
    }
    
    // 监听年份选择变化，如果是闰年，更新2月份的天数
    const birthYearSelect = document.getElementById('birthYear');
    if (birthYearSelect) {
        birthYearSelect.addEventListener('change', function() {
            const monthSelect = document.getElementById('birthMonth');
            if (monthSelect && monthSelect.value === '2') {
                updateBirthDayOptions();
            }
        });
    }
    
    // 监听表单提交
    const fortuneForm = document.getElementById('fortuneForm');
    if (fortuneForm) {
        fortuneForm.addEventListener('submit', function(e) {
            e.preventDefault();
            generateFortuneResult();
        });
    }
    
    // 初始化历史记录显示
    updateHistoryDisplay();
});

/**
 * 初始化年份选择器选项
 */
function initBirthYearOptions() {
    const birthYearSelect = document.getElementById('birthYear');
    if (!birthYearSelect) return;
    
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100; // Display a range of 100 years
    
    for (let year = currentYear; year >= startYear; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        birthYearSelect.appendChild(option);
    }
}

/**
 * 初始化日期选择器选项
 */
function initBirthDayOptions() {
    const birthDaySelect = document.getElementById('birthDay');
    if (!birthDaySelect) return;
    
    // 默认显示31天
    updateDayOptions(birthDaySelect, 31);
}

/**
 * 根据选择的月份更新日期选项
 */
function updateBirthDayOptions() {
    const birthMonthSelect = document.getElementById('birthMonth');
    const birthDaySelect = document.getElementById('birthDay');
    const birthYearSelect = document.getElementById('birthYear');
    
    if (!birthMonthSelect || !birthDaySelect) return;
    
    const month = parseInt(birthMonthSelect.value, 10);
    const year = birthYearSelect ? parseInt(birthYearSelect.value, 10) : null;
    let days = 31;
    
    // 确定每月的天数
    if (month === 2) {
        // 检查是否为闰年
        if (year) {
            days = isLeapYear(year) ? 29 : 28;
        } else {
            days = 28; // 如果没有选择年份，默认为28天
        }
    } else if ([4, 6, 9, 11].includes(month)) {
        days = 30;
    }
    
    // 保存当前选择的日期
    const selectedDay = birthDaySelect.value;
    
    // 更新日期选项
    updateDayOptions(birthDaySelect, days);
    
    // 如果之前选择的日期仍然有效，则保持选择
    if (selectedDay && parseInt(selectedDay, 10) <= days) {
        birthDaySelect.value = selectedDay;
    }
}

/**
 * 更新日期选择器的选项
 * @param {HTMLSelectElement} selectElement - 日期选择器元素
 * @param {number} days - 天数
 */
function updateDayOptions(selectElement, days) {
    // Clear existing options, keep the first "Please select" option
    while (selectElement.options.length > 1) {
        selectElement.remove(1);
    }
    
    // Add day options
    for (let day = 1; day <= days; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        selectElement.appendChild(option);
    }
}

/**
 * 检查是否为闰年
 * @param {number} year - 年份
 * @returns {boolean} - 是否为闰年
 */
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * 生成运势结果
 */
function generateFortuneResult() {
    // 获取表单数据
    const formData = new FormData(document.getElementById('fortuneForm'));
    const userData = {
        name: formData.get('userName'),
        gender: formData.get('gender'),
        birthYear: formData.get('birthYear'),
        birthMonth: formData.get('birthMonth'),
        birthDay: formData.get('birthDay'),
        bloodType: formData.get('bloodType'),
        zodiac: formData.get('zodiac')
    };
    
    // 计算运势
    const fortuneData = calculateFortune(userData);
    
    // 显示运势结果
    displayFortuneResult(fortuneData);
    
    // 保存到历史记录
    saveToHistory(fortuneData);
    
    // 滚动到结果区域
    const resultElement = document.getElementById('fortuneResult');
    if (resultElement) {
        resultElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * 计算运势数据
 * @param {Object} userData - 用户数据
 * @returns {Object} - 运势数据
 */
function calculateFortune(userData) {
    // 获取当前日期
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    
    // 创建一个基于名字、出生日期和当前日期的伪随机数生成器
    const seed = userData.name + userData.birthYear + userData.birthMonth + userData.birthDay + todayStr;
    const randomSeed = generateHashCode(seed);
    
    // 使用随机种子创建伪随机数生成器
    const random = seededRandom(randomSeed);
    
    // 计算生命灵数（命理学中的生命数字）
    const lifeNumber = calculateLifeNumber(userData.birthYear, userData.birthMonth, userData.birthDay);
    
    // 计算今日幸运数字（基于生命灵数和今日日期）
    const luckyNumber = calculateLuckyNumber(lifeNumber, today.getDate(), today.getMonth() + 1);
    
    // 计算姓名能量值
    const nameEnergy = calculateNameEnergy(userData.name);
    
    // 计算五行属性（金木水火土）基于生日
    const elementAttributes = calculateElementAttributes(userData.birthMonth, userData.birthDay);
    
    // 计算今日宇宙能量
    const cosmicEnergy = calculateCosmicEnergy(today.getFullYear(), today.getMonth() + 1, today.getDate());
    
    // 计算总体运势评分（1-100分）- 融合生命灵数、姓名能量、五行属性和宇宙能量
    const overallScore = calculateOverallScore(lifeNumber, nameEnergy, elementAttributes, cosmicEnergy, random);
    
    // 计算各项运势评分（1-5星）
    const categories = calculateCategoryScores(lifeNumber, nameEnergy, elementAttributes, cosmicEnergy, userData, random);
    
    // 获取运势描述
    const descriptions = getFortuneDescriptions(categories, random);
    
    // 获取运势建议
    const suggestions = getFortuneSuggestions(categories, random);
    
    // 获取幸运颜色和数字
    const luckyColor = getLuckyColor(random, lifeNumber);
    
    // 构建运势数据对象
    return {
        date: todayStr,
        userName: userData.name,
        overallScore: Math.round(overallScore),
        status: getFortuneStatus(overallScore),
        lifeNumber: lifeNumber,
        elementAttributes: elementAttributes,
        categories: Object.keys(categories).map(key => ({
            name: getCategoryName(key),
            score: categories[key],
            description: descriptions[key],
            suggestion: suggestions[key]
        })),
        luckyColor: luckyColor,
        luckyNumber: luckyNumber
    };
}

/**
 * 计算生命灵数（命理学中的生命数字）
 * @param {number} year - 出生年
 * @param {number} month - 出生月
 * @param {number} day - 出生日
 * @returns {number} - 生命灵数（1-9）
 */
function calculateLifeNumber(year, month, day) {
    // 将年月日各位数字相加，然后重复相加直到得到一个1-9的数字
    // 例如：1990年6月15日 = 1+9+9+0+6+1+5 = 31 = 3+1 = 4
    const dateStr = `${year}${month}${day}`;
    let sum = 0;
    
    for (let i = 0; i < dateStr.length; i++) {
        sum += parseInt(dateStr.charAt(i), 10) || 0;
    }
    
    // 如果和大于9，则继续相加各位数字
    while (sum > 9) {
        let newSum = 0;
        sum.toString().split('').forEach(char => {
            newSum += parseInt(char, 10);
        });
        sum = newSum;
    }
    
    return sum;
}

/**
 * 计算今日幸运数字
 * @param {number} lifeNumber - 生命灵数
 * @param {number} day - 今日日期
 * @param {number} month - 今日月份
 * @returns {number} - 幸运数字（1-9）
 */
function calculateLuckyNumber(lifeNumber, day, month) {
    // 基于生命灵数和今日日期计算幸运数字
    let luckyNumber = (lifeNumber + day + month) % 9;
    if (luckyNumber === 0) luckyNumber = 9;
    return luckyNumber;
}

/**
 * 计算姓名能量值
 * @param {string} name - 姓名
 * @returns {number} - 姓名能量值（0-100）
 */
function calculateNameEnergy(name) {
    if (!name) return 50; // 默认值
    
    // 简单实现：使用姓名长度和字符编码计算能量值
    let energy = 50; // 基础值
    
    // 姓名长度影响
    const nameLength = name.length;
    energy += (nameLength % 5) * 5; // 0-20
    
    // 字符编码影响
    let charSum = 0;
    for (let i = 0; i < name.length; i++) {
        charSum += name.charCodeAt(i);
    }
    energy += (charSum % 30); // 0-29
    
    // 确保能量值在0-100范围内
    return Math.min(100, Math.max(0, energy));
}

/**
 * 计算五行属性
 * @param {number} month - 出生月
 * @param {number} day - 出生日
 * @returns {Object} - 五行属性值
 */
function calculateElementAttributes(month, day) {
    // 简化的中国传统五行分配
    // 金(Metal)：8-9月，木(Wood)：2-3月，水(Water)：12-1月，火(Fire)：6-7月，土(Earth)：4-5月和10-11月
    let primaryElement;
    
    if (month === 12 || month === 1) {
        primaryElement = 'water';
    } else if (month === 2 || month === 3) {
        primaryElement = 'wood';
    } else if (month === 4 || month === 5) {
        primaryElement = 'earth';
    } else if (month === 6 || month === 7) {
        primaryElement = 'fire';
    } else if (month === 8 || month === 9) {
        primaryElement = 'metal';
    } else {
        primaryElement = 'earth';
    }
    
    // 计算每个元素的强度（0-100）
    const elements = {
        metal: 0,
        wood: 0, 
        water: 0,
        fire: 0,
        earth: 0
    };
    
    // 主元素获得更高的值
    elements[primaryElement] = 70 + (day % 30);
    
    // 次要元素
    const elementOrder = ['metal', 'water', 'wood', 'fire', 'earth'];
    const primaryIndex = elementOrder.indexOf(primaryElement);
    
    for (let i = 0; i < elementOrder.length; i++) {
        if (elementOrder[i] !== primaryElement) {
            // 相生关系（+20）：金生水，水生木，木生火，火生土，土生金
            if ((primaryIndex + 1) % 5 === i) {
                elements[elementOrder[i]] = 40 + (day % 20);
            } 
            // 相克关系（-20）：金克木，木克土，土克水，水克火，火克金
            else if ((primaryIndex + 2) % 5 === i) {
                elements[elementOrder[i]] = 20 + (day % 15);
            }
            else {
                elements[elementOrder[i]] = 30 + (day % 10);
            }
        }
    }
    
    return elements;
}

/**
 * 计算今日宇宙能量
 * @param {number} year - 年
 * @param {number} month - 月
 * @param {number} day - 日
 * @returns {number} - 宇宙能量值（0-100）
 */
function calculateCosmicEnergy(year, month, day) {
    // 简单实现：基于日期计算宇宙能量
    const dateSum = year + month + day;
    const phase = (dateSum % 28) / 28; // 0-1之间的月相周期
    
    // 模拟月相对能量的影响（新月和满月能量最高）
    let energy = Math.sin(phase * Math.PI * 2) * 0.5 + 0.5; // 0-1
    
    // 季节影响（春秋能量高，冬夏能量低）
    const seasonFactor = Math.cos(((month - 3) / 12) * Math.PI * 2) * 0.2 + 0.8; // 0.6-1
    
    return Math.round(energy * seasonFactor * 100);
}

/**
 * 计算总体运势评分
 * @param {number} lifeNumber - 生命灵数
 * @param {number} nameEnergy - 姓名能量
 * @param {Object} elementAttributes - 五行属性
 * @param {number} cosmicEnergy - 宇宙能量
 * @param {function} random - 随机数生成函数
 * @returns {number} - 总体运势评分（0-100）
 */
function calculateOverallScore(lifeNumber, nameEnergy, elementAttributes, cosmicEnergy, random) {
    // 基础分值
    let score = 50;
    
    // 生命灵数影响（1最好，4最差，9其次好）
    const lifeNumberFactor = [0.9, 0.7, 0.8, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0][lifeNumber - 1];
    
    // 姓名能量影响
    const nameEnergyFactor = nameEnergy / 100;
    
    // 五行平衡度影响
    let elementBalance = 0;
    const elementValues = Object.values(elementAttributes);
    const avgElement = elementValues.reduce((a, b) => a + b, 0) / elementValues.length;
    const elementVariance = elementValues.reduce((a, b) => a + Math.pow(b - avgElement, 2), 0) / elementValues.length;
    const elementBalanceFactor = 1 - (elementVariance / 10000);
    
    // 宇宙能量影响
    const cosmicEnergyFactor = cosmicEnergy / 100;
    
    // 加权计算最终分数
    score = score * 0.2 + // 基础分值占20%
            lifeNumberFactor * 20 + // 生命灵数占20%
            nameEnergyFactor * 20 + // 姓名能量占20%
            elementBalanceFactor * 20 + // 五行平衡占20%
            cosmicEnergyFactor * 20; // 宇宙能量占20%
    
    // 增加一些随机波动（±5分）
    score += (random() * 10 - 5);
    
    // 确保分数在1-100范围内
    return Math.min(100, Math.max(1, score));
}

/**
 * 计算各项运势评分
 * @param {number} lifeNumber - 生命灵数
 * @param {number} nameEnergy - 姓名能量
 * @param {Object} elementAttributes - 五行属性
 * @param {number} cosmicEnergy - 宇宙能量
 * @param {Object} userData - 用户数据
 * @param {function} random - 随机数生成函数
 * @returns {Object} - 各项运势评分
 */
function calculateCategoryScores(lifeNumber, nameEnergy, elementAttributes, cosmicEnergy, userData, random) {
    const categories = {
        career: 0,
        love: 0,
        wealth: 0,
        health: 0, 
        social: 0,
        study: 0
    };
    
    // 事业运：受金和土元素影响大，1、4、8、9生命灵数有利
    const careerBase = (elementAttributes.metal * 0.4 + elementAttributes.earth * 0.3) / 70;
    const careerLifeFactor = [1, 0.8, 0.7, 1, 0.6, 0.7, 0.8, 1, 1][lifeNumber - 1];
    categories.career = calculateCategoryScore(careerBase, careerLifeFactor, cosmicEnergy, random);
    
    // 爱情运：受火和木元素影响大，2、6、9生命灵数有利
    const loveBase = (elementAttributes.fire * 0.4 + elementAttributes.wood * 0.3) / 70;
    const loveLifeFactor = [0.7, 1, 0.8, 0.7, 0.6, 1, 0.7, 0.8, 1][lifeNumber - 1];
    categories.love = calculateCategoryScore(loveBase, loveLifeFactor, cosmicEnergy, random);
    
    // 财运：受金和水元素影响大，1、3、8生命灵数有利
    const wealthBase = (elementAttributes.metal * 0.5 + elementAttributes.water * 0.3) / 80;
    const wealthLifeFactor = [1, 0.7, 1, 0.6, 0.7, 0.8, 0.7, 1, 0.8][lifeNumber - 1];
    categories.wealth = calculateCategoryScore(wealthBase, wealthLifeFactor, cosmicEnergy, random);
    
    // 健康运：受水和土元素影响大，3、5、7生命灵数有利
    const healthBase = (elementAttributes.water * 0.4 + elementAttributes.earth * 0.3) / 70;
    const healthLifeFactor = [0.8, 0.7, 1, 0.8, 1, 0.8, 1, 0.7, 0.8][lifeNumber - 1];
    categories.health = calculateCategoryScore(healthBase, healthLifeFactor, cosmicEnergy, random);
    
    // 社交运：受火和金元素影响大，2、5、9生命灵数有利
    const socialBase = (elementAttributes.fire * 0.4 + elementAttributes.metal * 0.3) / 70;
    const socialLifeFactor = [0.7, 1, 0.7, 0.6, 1, 0.8, 0.7, 0.8, 1][lifeNumber - 1];
    categories.social = calculateCategoryScore(socialBase, socialLifeFactor, cosmicEnergy, random);
    
    // 学业运：受木和水元素影响大，4、7、8生命灵数有利
    const studyBase = (elementAttributes.wood * 0.4 + elementAttributes.water * 0.3) / 70;
    const studyLifeFactor = [0.8, 0.7, 0.8, 1, 0.7, 0.8, 1, 1, 0.7][lifeNumber - 1];
    categories.study = calculateCategoryScore(studyBase, studyLifeFactor, cosmicEnergy, random);
    
    return categories;
}

/**
 * 计算单个类别的评分
 * @param {number} baseScore - 基础分数
 * @param {number} lifeFactor - 生命灵数因子
 * @param {number} cosmicEnergy - 宇宙能量
 * @param {function} random - 随机数生成函数
 * @returns {number} - 类别评分（1-5）
 */
function calculateCategoryScore(baseScore, lifeFactor, cosmicEnergy, random) {
    // 基础分值（0-1）
    let score = baseScore;
    
    // 生命灵数影响
    score = score * lifeFactor;
    
    // 宇宙能量影响（±20%）
    const cosmicFactor = 0.8 + (cosmicEnergy / 100) * 0.4;
    score = score * cosmicFactor;
    
    // 随机波动（±10%）
    score = score * (0.9 + random() * 0.2);
    
    // 转换为1-5星
    return Math.min(5, Math.max(1, Math.round(score * 5)));
}

/**
 * 获取运势状态描述
 * @param {number} score - 运势评分
 * @returns {string} - 运势状态描述
 */
function getFortuneStatus(score) {
    if (score >= 90) return 'Exceptional Fortune';
    if (score >= 80) return 'Excellent Fortune';
    if (score >= 70) return 'Very Good Fortune';
    if (score >= 60) return 'Good Fortune';
    if (score >= 50) return 'Moderate Fortune';
    if (score >= 40) return 'Building Fortune';
    return 'Reserved Fortune';
}

/**
 * 获取类别名称
 * @param {string} key - 类别键名
 * @returns {string} - 类别中文名称
 */
function getCategoryName(key) {
    const nameMap = {
        career: 'Career',
        love: 'Love',
        wealth: 'Wealth',
        health: 'Health',
        social: 'Social Relationships',
        study: 'Study'
    };
    
    return nameMap[key] || key;
}

/**
 * 获取运势描述
 * @param {Object} categories - 各项运势评分
 * @param {function} random - 随机数生成函数
 * @returns {Object} - 各项运势描述
 */
function getFortuneDescriptions(categories, random) {
    const descriptions = {};
    
    const careerDesc = [
        'Your career is in a power-building phase. This period requires steadiness and patience to face challenges, laying the foundation for future breakthroughs. When confronting difficulties, maintain calm thinking to find unique solutions.',
        'Your career is in a steady development period. Staying focused on daily work will yield good results. Now is a good time to improve skills and expand your network, preparing for future development.',
        'Your career prospects are improving steadily. You can efficiently complete tasks and gain recognition from colleagues. Currently suitable for integrating resources, seeking new development opportunities, and proposing innovative ideas.',
        'Your career development is strong, and your work performance will be recognized and appreciated by superiors. Difficult problems are easily solved, teamwork is smooth, and this is an ideal period to demonstrate leadership.',
        'Your career fortune is excellent, with important development opportunities coming your way, possibly including promotion or salary increase. Your talents will be fully displayed, all work progresses smoothly, and creative thinking is particularly active.'
    ];
    
    const loveDesc = [
        'Your emotional life is in a settling period, a valuable time for self-understanding and growth. Singles should enrich themselves and enhance personal charm; those with partners can increase mutual understanding through honest communication.',
        'Your love fortune is mild and stable. Those in relationships can add new experiences to inject vitality; singles may meet like-minded people through friends\' introductions, and keeping an open mind is important.',
        'Your romantic world is harmonious and fulfilling, with deeper understanding and support between partners. Those in relationships enjoy stable development, while singles have opportunities to meet someone who moves their heart. Social activities will bring unexpected surprises.',
        'Your love fortune is prosperous, with smooth emotional communication and better expression of true feelings. Singles enjoy abundant romantic opportunities, potentially encountering ideal partners; those in relationships will progress further.',
        'Your love fortune is exceptional, experiencing profound and beautiful emotional connections. Singles are very likely to meet spiritually compatible partners, while those in relationships will experience important breakthroughs, with sweetness and romance coexisting.'
    ];
    
    const wealthDesc = [
        'Your financial fortune is building momentum. This is a good time to review and optimize your financial situation. Rational planning of expenses and reducing unnecessary consumption can actually bring greater returns in the future. Cultivate financial awareness to build a solid economic foundation.',
        'Your financial situation is stable with balanced income and expenditure. Suitable for reviewing personal financial plans and seeking ways to increase income. Small investments may bring unexpected gains, but risk control is essential - steady progress is key.',
        'Your financial fortune shows an upward trend with stable work income and growth potential. This is a good period to establish multiple income sources; you can try stable investments or side businesses, which will positively change your financial situation.',
        'Your financial fortune is quite good, with both primary and secondary finances performing well. You may receive additional rewards at work, and investments can easily yield considerable returns. Seize opportunities to expand income channels while reasonably allocating and accumulating assets.',
        'Your financial fortune is extremely prosperous, with economic benefits in all aspects exceeding expectations. Work income may show significant growth, investment projects are likely to yield substantial returns, and unexpected wealth may appear. Abundance and opportunity coexist - suitable for boldly trying new wealth growth points.'
    ];
    
    const healthDesc = [
        'Your health fortune is stable, and signals from your body should be taken seriously. Adjusting regular routines, focusing on balanced diet, and appropriate exercise will effectively improve physical fitness. Relaxation and maintaining a pleasant attitude are equally important.',
        'Your health condition is good. Maintain current lifestyle habits while adding some aerobic exercise to further strengthen your physique. Balanced diet and adequate sleep will make you more energetic, and work efficiency will improve accordingly.',
        'Your health index is rising, and physical condition is at a good level. Regular lifestyle habits are playing a positive role. This is a suitable time to try new health management methods, such as yoga, tai chi, and other activities that cultivate both body and mind.',
        'Your health fortune is strong, your body is full of vitality, suitable for various outdoor activities and physical exercise. Your energy is abundant, resistance is strong, making this a good time to challenge yourself and break through limits.',
        'Your health status has reached its peak, with body and mind in harmony, and smooth circulation. You will experience unprecedented vitality and sense of health, ideal for high-intensity exercise and setting new health goals. Maintain a positive attitude and continue healthy lifestyle practices for long-term benefits.'
    ];
    
    const socialDesc = [
        'Your social fortune is in a transition period, valuing spiritually compatible friendships more. Selective socializing and establishing deep connections with a few sincere friends is more important than expanding your social circle. Reflect quietly on the interpersonal relationships you truly need and adjust your social pace.',
        'Your social life is steady and orderly, with existing friend circles providing emotional support and practical help. Try participating in more small gatherings with common interests, which helps consolidate relationships and enhance emotional exchange.',
        'Your social fortune is improving, interpersonal relationships are developing smoothly, and your affinity is enhanced. Whether in work settings or private gatherings, you can easily integrate into different groups, establish new valuable connections, and maintain existing relationships.',
        'Your social charm is enhanced, making you the focus of various occasions. The ability to express and patience to listen make you at ease in social settings. This period is suitable for actively organizing activities and expanding your network, which is extremely beneficial for career development.',
        'Your social fortune is excellent, with your interpersonal network experiencing a qualitative leap. Your influence significantly increases, attracting like-minded people to form mutually beneficial social circles. The appearance of important figures will bring you valuable cooperation opportunities and life guidance.'
    ];
    
    const studyDesc = [
        'This is a stable development period for your studies, an excellent time to build a solid foundation of knowledge. Focus on consolidating what you\'ve learned and filling knowledge gaps. By establishing reasonable study plans and breaking down complex knowledge points, you can effectively enhance learning outcomes. Maintain patience and perseverance, making steady progress.',
        'Your learning state is gradually improving, with enhanced ability to absorb new knowledge. Suitable for trying different learning methods to find what works best for you. Discussing with like-minded classmates can bring new insights and learning motivation.',
        'Your study fortune is good, with clear thinking and enhanced comprehension. The speed of mastering new concepts and skills is accelerating, making this a good time to deeply research areas of interest. Active participation in classroom discussions and practical activities will make learning outcomes more significant.',
        'Your learning ability is outstanding, with agile thinking and enhanced innovative consciousness. This is a suitable time to challenge high-difficulty content and expand knowledge boundaries. Interdisciplinary learning will bring unexpected gains, and an integrated learning approach will help you build a unique knowledge system.',
        'Your study fortune is excellent, with your mind in optimal condition and intuitive understanding of complex concepts. Knowledge absorption and application abilities are at their peak, making this a golden period for exams and completing important research projects. Dare to propose innovative insights for significant results.'
    ];
    
    descriptions.career = careerDesc[categories.career - 1];
    descriptions.love = loveDesc[categories.love - 1];
    descriptions.wealth = wealthDesc[categories.wealth - 1];
    descriptions.health = healthDesc[categories.health - 1];
    descriptions.social = socialDesc[categories.social - 1];
    descriptions.study = studyDesc[categories.study - 1];
    
    return descriptions;
}

/**
 * 获取运势建议
 * @param {Object} categories - 各项运势评分
 * @param {function} random - 随机数生成函数
 * @returns {Object} - 各项运势建议
 */
function getFortuneSuggestions(categories, random) {
    const suggestions = {};
    
    const careerSugg = [
        'Be patient at work and seek help from colleagues or superiors when encountering difficulties.',
        'Make clear work plans to improve efficiency.',
        'Maintain your current work status, focusing on accumulating experience and skills.',
        'Take on more responsibilities to demonstrate your abilities and value.',
        'Seize opportunities to showcase your talents and appropriately express career development aspirations.'
    ];
    
    const loveSugg = [
        'Enhance communication with your partner and understand each other\'s needs and feelings.',
        'Add some freshness to your relationship by trying new activities together.',
        'Cherish your current emotional state, maintaining sincerity and care.',
        'Keep an open mind and actively participate in social activities.',
        'Express your true feelings and actively pursue someone you like.'
    ];
    
    const wealthSugg = [
        'Control expenditures, avoid impulse purchases, and establish reasonable budget plans.',
        'Maintain income-expense balance and look for ways to increase income.',
        'Invest moderately to improve capital utilization efficiency.',
        'Look for additional income sources, such as part-time work or investments.',
        'Pay attention to investment opportunities but also control risks.'
    ];
    
    const healthSugg = [
        'Pay attention to rest, maintain good sleep habits, and exercise appropriately.',
        'Increase daily exercise and maintain a balanced diet.',
        'Maintain current health habits and have regular check-ups.',
        'Try new exercise methods to strengthen your constitution.',
        'Maintain a positive attitude and enjoy a healthy lifestyle.'
    ];
    
    const socialSugg = [
        'Improve communication skills and understand others\' thoughts and feelings.',
        'Actively participate in social activities and make new friends.',
        'Maintain existing friendships through regular contact and communication.',
        'Expand your social circle by participating in various activities and groups.',
        'Share your knowledge and experience to help others solve problems.'
    ];
    
    const studySugg = [
        'Adjust your study plan and find learning methods that suit you.',
        'Increase study time and improve focus.',
        'Consolidate knowledge already learned before gradually learning new content.',
        'Challenge yourself by learning more in-depth knowledge.',
        'Sharing learning insights not only helps others but also enhances your own understanding.'
    ];
    
    suggestions.career = careerSugg[categories.career - 1];
    suggestions.love = loveSugg[categories.love - 1];
    suggestions.wealth = wealthSugg[categories.wealth - 1];
    suggestions.health = healthSugg[categories.health - 1];
    suggestions.social = socialSugg[categories.social - 1];
    suggestions.study = studySugg[categories.study - 1];
    
    return suggestions;
}

/**
 * 获取幸运颜色
 * @param {function} random - 随机数生成函数
 * @param {number} lifeNumber - 生命灵数
 * @returns {string} - 幸运颜色
 */
function getLuckyColor(random, lifeNumber) {
    // 根据生命灵数和随机数决定幸运颜色
    const colors = [
        ['Red', 'Purple', 'Pink'], // Fire
        ['Green', 'Teal', 'Brown'], // Wood
        ['Blue', 'Black', 'Gray'], // Water
        ['White', 'Gold', 'Silver'], // Metal
        ['Yellow', 'Orange', 'Beige']  // Earth
    ];
    
    let elementIndex;
    
    // 根据生命灵数选择元素
    if (lifeNumber === 1 || lifeNumber === 6) {
        elementIndex = 3; // Metal
    } else if (lifeNumber === 2 || lifeNumber === 7) {
        elementIndex = 0; // Fire
    } else if (lifeNumber === 3 || lifeNumber === 8) {
        elementIndex = 1; // Wood
    } else if (lifeNumber === 4 || lifeNumber === 9) {
        elementIndex = 2; // Water
    } else {
        elementIndex = 4; // Earth
    }
    
    // 从该元素的颜色中随机选择一种
    const colorIndex = Math.floor(random() * 3);
    return colors[elementIndex][colorIndex];
}

/**
 * 显示运势结果
 * @param {Object} fortuneData - 运势数据
 */
function displayFortuneResult(fortuneData) {
    const resultElement = document.getElementById('fortuneResult');
    if (!resultElement) return;
    
    // 将日期格式化为更友好的显示
    const dateObj = new Date(fortuneData.date);
    const formattedDate = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
    
    // 构建星星评分HTML
    const getStarsHtml = (score) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += i <= score ? '★' : '☆';
        }
        return stars;
    };
    
    // 获取五行属性的解释
    const getElementMeaning = (elementName) => {
        const meanings = {
            'metal': 'Metal represents strength, decisiveness, and perseverance, symbolizing autumn\'s contraction and severity.',
            'wood': 'Wood represents growth, development, and creativity, symbolizing spring\'s vitality and energy.',
            'water': 'Water represents wisdom, flexibility, and adaptability, symbolizing winter\'s calmness and introversion.',
            'fire': 'Fire represents passion, vitality, and change, symbolizing summer\'s warmth and activity.',
            'earth': 'Earth represents inclusion, stability, and steadiness, symbolizing the transition and balance between seasons.'
        };
        return meanings[elementName] || '';
    };
    
    // 获取五行相生相克关系
    const getElementRelationship = () => {
        return 'Five Elements Generation: Metal generates Water, Water generates Wood, Wood generates Fire, Fire generates Earth, Earth generates Metal<br>Five Elements Control: Metal controls Wood, Wood controls Earth, Earth controls Water, Water controls Fire, Fire controls Metal';
    };
    
    // 获取生命灵数的解释
    const getLifeNumberMeaning = (lifeNumber) => {
        const meanings = {
            1: 'Number 1 represents leadership and independence, showing pioneering spirit and strong will.',
            2: 'Number 2 represents cooperation and harmony, showing sensitivity and diplomatic skills.',
            3: 'Number 3 represents creativity and expressiveness, showing optimism and social talent.',
            4: 'Number 4 represents stability and order, showing practicality and reliability.',
            5: 'Number 5 represents freedom and change, showing adventurous spirit and adaptability.',
            6: 'Number 6 represents responsibility and care, showing dedication and sense of balance.',
            7: 'Number 7 represents wisdom and insight, showing analytical ability and introspection.',
            8: 'Number 8 represents power and achievement, showing material success and authority.',
            9: 'Number 9 represents ideals and completion, showing universal love and wisdom.'
        };
        return meanings[lifeNumber] || '';
    };
    
    // 构建五行属性图表HTML
    const buildElementChartHtml = (elements) => {
        // 定义元素名称和图标
        const elementNames = {
            metal: 'Metal',
            wood: 'Wood',
            water: 'Water', 
            fire: 'Fire',
            earth: 'Earth'
        };
        
        const elementEmojis = {
            metal: '🔶',
            wood: '🌿',
            water: '💧',
            fire: '🔥',
            earth: '🟤'
        };
        
        // 找出最大值和最强元素
        const maxValue = Math.max(...Object.values(elements));
        const strongestElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0][0];
        
        // 计算总和用于百分比
        const total = Object.values(elements).reduce((sum, val) => sum + val, 0);
        
        let chartHtml = '<div class="element-chart">';
        
        // 添加每个元素的条形
        for (const [element, value] of Object.entries(elements)) {
            const heightPercent = (value / maxValue) * 100;
            const percentage = Math.round((value / total) * 100);
            const isStrongest = (element === strongestElement) ? ' strongest-element' : '';
            
            chartHtml += `
                <div class="element-bar${isStrongest}" data-element="${element}" data-percentage="${percentage}%">
                    <div class="element-name">
                        <div class="element-emoji">
                            ${elementEmojis[element]}
                            <div class="element-score">${Math.round(value)}</div>
                        </div>
                        <span class="element-text">${elementNames[element]}</span>
                    </div>
                    <div class="element-value" style="--bar-height: ${heightPercent}%"></div>
                </div>
            `;
        }
        
        chartHtml += '</div>';
        
        return chartHtml;
    };
    
    // 构建运势结果HTML
    let resultHtml = `
        <div class="result-header">
            <h3>${fortuneData.userName}'s Daily Fortune</h3>
            <div class="result-date">${formattedDate}</div>
        </div>
        <div class="result-overview">
            <div class="result-score">${fortuneData.overallScore}</div>
            <div class="result-status">${fortuneData.status}</div>
        </div>
    `;
    
    // 添加生命灵数部分
    resultHtml += `
        <div class="result-lifenumber">
            <h4>Life Number: ${fortuneData.lifeNumber}</h4>
            <p>${getLifeNumberMeaning(fortuneData.lifeNumber)}</p>
        </div>
    `;
    
    // 添加五行分析部分
    resultHtml += `
        <div class="result-elements">
            <h4>Five Elements Analysis</h4>
            <div class="category-icons">
                <span class="element-icon element-icon-metal" title="Metal">🔶</span>
                <span class="element-icon element-icon-wood" title="Wood">🌿</span>
                <span class="element-icon element-icon-water" title="Water">💧</span>
                <span class="element-icon element-icon-fire" title="Fire">🔥</span>
                <span class="element-icon element-icon-earth" title="Earth">🟤</span>
            </div>
            ${buildElementChartHtml(fortuneData.elementAttributes)}
            <div class="element-explanation">
                <p>Your primary five elements attribute shows your connection to natural elements. ${getElementMeaning(Object.entries(fortuneData.elementAttributes).sort((a, b) => b[1] - a[1])[0][0])}</p>
                <p class="element-relationship">${getElementRelationship()}</p>
            </div>
        </div>
    `;
    
    // 添加各项运势详情
    resultHtml += `<div class="result-categories">`;
    fortuneData.categories.forEach(category => {
        resultHtml += `
            <div class="result-category">
                <div class="category-header">
                    <div class="category-name">${category.name}</div>
                    <div class="category-stars">${getStarsHtml(category.score)}</div>
                </div>
                <div class="category-description">${category.description}</div>
                <div class="category-suggestion"><strong>Suggestion: </strong>${category.suggestion}</div>
            </div>
        `;
    });
    resultHtml += `</div>`;
    
    // 添加幸运信息
    resultHtml += `
        <div class="result-lucky">
            <div><strong>Lucky Color: </strong>${fortuneData.luckyColor}</div>
            <div><strong>Lucky Number: </strong>${fortuneData.luckyNumber}</div>
        </div>
    `;
    
    // 添加操作按钮
    resultHtml += `
        <div class="result-actions">
            <button class="btn btn-secondary" onclick="window.print()">Print Results</button>
            <button class="btn btn-primary" onclick="document.getElementById('fortuneForm').reset();document.getElementById('fortuneResult').style.display='none';">Test Again</button>
        </div>
    `;
    
    // 更新结果区域的内容并显示
    resultElement.innerHTML = resultHtml;
    resultElement.style.display = 'block';
}

/**
 * 保存运势结果到历史记录
 * @param {Object} fortuneData - 运势数据
 */
function saveToHistory(fortuneData) {
    // 获取已有的历史记录
    let history = localStorage.getItem('fortuneHistory');
    let historyData = history ? JSON.parse(history) : [];
    
    // 添加新记录
    historyData.push({
        date: fortuneData.date,
        userName: fortuneData.userName,
        overallScore: fortuneData.overallScore,
        status: fortuneData.status
    });
    
    // 只保留最近的10条记录
    if (historyData.length > 10) {
        historyData = historyData.slice(-10);
    }
    
    // 保存到本地存储
    localStorage.setItem('fortuneHistory', JSON.stringify(historyData));
    
    // 更新历史记录显示
    updateHistoryDisplay();
}

/**
 * 更新历史记录显示
 */
function updateHistoryDisplay() {
    const historyElement = document.getElementById('fortuneHistory');
    if (!historyElement) return;
    
    // 获取历史记录
    let history = localStorage.getItem('fortuneHistory');
    if (!history) {
        historyElement.innerHTML = '<p class="text-center">No history records</p>';
        return;
    }
    
    let historyData = JSON.parse(history);
    
    // 生成历史记录HTML
    let historyHtml = '<div class="history-list">';
    historyData.reverse().forEach(item => {
        const dateObj = new Date(item.date);
        const formattedDate = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
        
        historyHtml += `
            <div class="history-item">
                <div class="history-date">${formattedDate}</div>
                <div class="history-name">${item.userName}</div>
                <div class="history-score">${item.overallScore}</div>
                <div class="history-status">${item.status}</div>
            </div>
        `;
    });
    historyHtml += '</div>';
    
    historyElement.innerHTML = historyHtml;
}

/**
 * 生成哈希码（用于随机数种子）
 * @param {string} str - 输入字符串
 * @returns {number} - 哈希码
 */
function generateHashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * 创建基于种子的伪随机数生成器
 * @param {number} seed - 随机数种子
 * @returns {function} - 返回0-1之间的随机数的函数
 */
function seededRandom(seed) {
    return function() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
}