const defaultData = {
  name: '林知夏', headline: '独立开发者 / AI 产品设计师', role: 'PRODUCT BUILDER', location: '杭州，中国', years: 5,
  email: 'hello@example.com', github: 'https://github.com/',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=700&q=85',
  bio: '我把复杂的技术想法，变成清晰、好用、有人情味的数字体验。现在专注于 AI 应用、创意编程和开源项目。',
  about: '我喜欢从一个模糊的问题出发，经历研究、原型、代码与反馈，把它打磨成值得每天使用的工具。我的工作横跨产品设计、前端工程和 AI 应用。',
  skills: ['AI 应用开发', '产品设计', 'React / Next.js', 'Creative Coding', 'Open Source'],
  projects: [
    { title: '日光 · AI 日记', category: 'AI PRODUCT', description: '帮人们从零散记录中发现生活线索的智能日记应用。', url: 'https://github.com/', featured: true },
    { title: '读本', category: 'OPEN SOURCE', description: '一个为长文阅读而做的极简知识管理工具。', url: 'https://github.com/', featured: false },
    { title: '星图', category: 'EXPERIMENT', description: '把城市声音变成可触摸的交互式数据地图。', url: 'https://github.com/', featured: false }
  ],
  timeline: [
    { year: '2024 — NOW', title: '独立产品开发', description: '探索 AI 与个人创造力的交点。' },
    { year: '2022 — 2024', title: '高级产品设计师 · Aster', description: '负责从 0 到 1 的 AI 创作工具体验。' },
    { year: '2019 — 2022', title: '交互设计 · IDEO', description: '参与数字服务与公共创新项目。' }
  ]
};
let data = JSON.parse(localStorage.getItem('github-homepage-data') || 'null') || structuredClone(defaultData);
const $ = (s) => document.querySelector(s);
const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' })[c]);

function render() {
  document.title = `${data.name} - 个人主页`;
  document.querySelectorAll('[data-bind]').forEach((el) => { el.textContent = data[el.dataset.bind] ?? ''; });
  document.querySelectorAll('[data-bind-image]').forEach((el) => { el.src = data[el.dataset.bindImage] || defaultData.avatar; });
  document.querySelectorAll('[data-bind-link]').forEach((el) => { const key = el.dataset.bindLink; el.href = key === 'email' ? `mailto:${data[key]}` : data[key] || '#'; });
  document.querySelectorAll('[data-bind="projectCount"]').forEach((el) => { el.textContent = data.projects.length; });
  $('#skills-list').innerHTML = data.skills.map((skill) => `<span class="skill">${escapeHTML(skill)}</span>`).join('');
  $('#projects-list').innerHTML = data.projects.map((project, index) => `<article class="project-card ${project.featured ? 'featured' : ''}"><div class="project-art"></div><span class="project-index">0${index + 1} / 0${data.projects.length}</span><div><h3>${escapeHTML(project.title)}</h3><p>${escapeHTML(project.description)}</p></div><div class="project-meta"><span>${escapeHTML(project.category)}</span><a class="project-link" href="${escapeHTML(project.url || '#')}" target="_blank" rel="noreferrer" aria-label="打开 ${escapeHTML(project.title)}"><i data-lucide="arrow-up-right"></i></a></div></article>`).join('');
  $('#timeline-list').innerHTML = data.timeline.map((item) => `<article class="timeline-item"><time>${escapeHTML(item.year)}</time><div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></div></article>`).join('');
  $('#current-year').textContent = new Date().getFullYear();
  lucide.createIcons();
}
function input(name, value, type = 'text') { return `<label>${name}<input data-key="${name}" type="${type}" value="${escapeHTML(value || '')}"></label>`; }
function skillRow(value = '') { return `<div class="repeat-row skill-row">${input('技能', value)}<button type="button" class="delete-row" aria-label="删除"><i data-lucide="trash-2"></i></button></div>`; }
function projectRow(item = {}) { return `<div class="repeat-row project-row">${input('名称', item.title)}${input('分类', item.category)}${input('链接', item.url, 'url')}<label>简介<input data-key="description" value="${escapeHTML(item.description || '')}"></label><label class="checkbox-label"><input data-key="featured" type="checkbox" ${item.featured ? 'checked' : ''}> 重点展示</label><button type="button" class="delete-row" aria-label="删除"><i data-lucide="trash-2"></i></button></div>`; }
function timelineRow(item = {}) { return `<div class="repeat-row timeline-row">${input('时间', item.year)}${input('标题', item.title)}${input('说明', item.description)}<button type="button" class="delete-row" aria-label="删除"><i data-lucide="trash-2"></i></button></div>`; }
function fillEditor() {
  const form = $('#profile-form');
  ['name','headline','role','location','email','github','years','avatar','bio','about'].forEach((key) => { form.elements[key].value = data[key] ?? ''; });
  $('#skills-editor').innerHTML = data.skills.map(skillRow).join('');
  $('#projects-editor').innerHTML = data.projects.map(projectRow).join('');
  $('#timeline-editor').innerHTML = data.timeline.map(timelineRow).join('');
  lucide.createIcons();
}
function collectRows(selector, keys) { return [...document.querySelectorAll(selector)].map((row) => Object.fromEntries(keys.map((key) => { const field = row.querySelector(`[data-key="${key}"]`); return [key, field?.type === 'checkbox' ? field.checked : field?.value.trim()]; }))).filter((item) => Object.values(item).some(Boolean)); }

$('#open-editor').addEventListener('click', () => { fillEditor(); $('#editor-modal').showModal(); });
$('#close-editor').addEventListener('click', () => $('#editor-modal').close());
$('#theme-toggle').addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('github-homepage-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); lucide.createIcons(); });
$('#add-skill').addEventListener('click', () => { $('#skills-editor').insertAdjacentHTML('beforeend', skillRow()); lucide.createIcons(); });
$('#add-project').addEventListener('click', () => { $('#projects-editor').insertAdjacentHTML('beforeend', projectRow({})); lucide.createIcons(); });
$('#add-timeline').addEventListener('click', () => { $('#timeline-editor').insertAdjacentHTML('beforeend', timelineRow({})); lucide.createIcons(); });
document.addEventListener('click', (event) => { if (event.target.closest('.delete-row')) event.target.closest('.repeat-row').remove(); });
$('#reset-data').addEventListener('click', () => { data = structuredClone(defaultData); fillEditor(); });
$('#profile-form').addEventListener('submit', (event) => { event.preventDefault(); const form = event.currentTarget; ['name','headline','role','location','email','github','years','avatar','bio','about'].forEach((key) => data[key] = form.elements[key].value.trim()); data.skills = collectRows('.skill-row', ['技能']).map((item) => item['技能']); data.projects = collectRows('.project-row', ['title','category','url','description','featured']); data.timeline = collectRows('.timeline-row', ['year','title','description']); localStorage.setItem('github-homepage-data', JSON.stringify(data)); render(); $('#editor-modal').close(); });
if (localStorage.getItem('github-homepage-theme') === 'dark') document.body.classList.add('dark');
render();
