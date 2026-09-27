# QMStudy_web · 量子力学交互式教学

> 版本 **v2.4** ｜ 私有仓库 ｜ 16 课模块化 · 交互动画 · AI 助教 · AI 自测 · 本地账号 · 策略选择模块 · 知识图谱

以《量子力学：从概念基础到现代应用》为知识主线，把每课的**概念、公式、推导与物理实验**通过**交互动画**连接起来的模块化数字教材，并内置基于 QuanLLM-v2.0 模型 + quanllm-harness 智能体验证的 **AI 助教**（划选追问 + 多轮对话），以及同源的**策略选择模块**（掌握度追踪、错题回流、复习任务与学情报告）。

---


## 🧭 一体化学习工作台（v2.4）

本整合版已将 AI 自测 / 自动出卷 / 智能阅卷模块并入主服务：

- `/`：交互式教材
- `/selftest/`：AI 自测、自动出卷与阅卷
- `/strategy/report`：学情报告
- `/strategy/graph`：知识图谱
- `/strategy/lab`：策略实验室

教材页与自测页共用统一站点导航、色彩/字体变量和当前本地账号上下文。自测模块 API 使用 `/selftest/api/*`，与教材原有 `/api/*` 完全隔离。详细合并说明见 `INTEGRATION_README.md`。

## ✨ 功能特性

- **16 课模块化课程**：前言 + 第 1–16 课 + 附录，教材正文、知识点、数学公式与交互动画一一对应。
- **交互动画**：黑体辐射、光电效应、双缝干涉、波包演化、隧道效应、谐振子、氢原子、布洛赫球、Bell 态关联等 30 个 Canvas 数值实验。
- **本地账号**：浏览器内注册 / 登录（v1.4 式私人账号），密码只做本地 SHA-256 摘要；账号与学习记录只保存在本机本浏览器的 localStorage，服务端不保存任何用户数据。
- **学习进度与学习奖状**：打开课程自动记为「已学」，顶栏实时显示进度条、已学课数与累计学习时长（页面切后台不计时）；学完全部 16 课后解锁 🏆 奖状，可查看、打印 / 保存为 PDF。
- **AI 助教（QuanLLM-v2.0）**：鼠标划选正文文字 → 光标旁浮出小胶囊（✨ 详细解释 / 💬 提问），点击进入右下角多轮对话面板连续追问；支持 SSE 流式输出、思考过程（按阶段分组）、过程时间线、停止生成与重试上一问。
- **🦉 引导模式（苏格拉底式）**：AI 面板头部可开启引导模式——AI 不直接给答案，而是判断理解程度、提出反问、只给下一步提示，引导你自己完成推导；随时说「直接给答案」可临时跳过。偏好在浏览器本地记忆，harness 核验流水线不变。
- **策略选择模块（v1.8 并入，同源）**：掌握度追踪、错题回流、复习任务调度、学情报告（学生/教师两个视角）与策略实验室；顶栏「查看学情报告」一键直达。与 QMStudy **同一个 `python server.py` 进程、同一个端口**，不再独立占用 8000 端口。
- **知识图谱模式（v2.3）**：教材之外的第二个学习入口（`/strategy/graph`），用 Cytoscape.js 把量子力学 16 课的知识点与其**前置依赖关系**绘成可交互图谱——节点按 6 大知识领域着色、圆形内嵌标题，按掌握度分「掌握 / 熟悉 / 学习中 / 未学」四级呈现，点击节点可跳回对应章节。教材侧边栏「知识图谱」一键直达。
- **服务端智能体验证（quanllm-harness）**：每个问题由 lct-unv/quanllm-harness 执行「路由 → 双求解器 → 综合 → 断言提取 → 工具证据 → 形式/要求核验 → 裁决 → 定向修复」流水线，逐题独立核验并返回 verified/degraded 状态；模型可调用内置 SymPy / mpmath / 算符代数 / 量纲 / 边界 / 角动量 / 数值工具，精确计算不口算。
- **公式可选中**：MathJax 采用 CHTML 输出，教材正文与 AI 回答区公式支持字符级划选（可只选单个物理量，如 h、ν）；选中后保持可见高亮，单击空白处清除；局部公式选区也可触发胶囊提问，并自动还原为可读公式上下文。交互实验图使用 Canvas 绘制，图内文字不支持原生文本划选；第1课黑体辐射卡片提供了「复制公式」按钮作为替代入口。
- **引用追问**：选中 AI 回答里的文字，可「💬 引用并追问」，把选中内容作为引用继续提问。
- **附录数学速查**：附录内置「数学预备」速查表（复变函数、线性代数与 Dirac 符号、傅里叶变换、δ 函数、常微分方程、球坐标与特殊函数、常用积分表），附课次对照。
- **学习笔记**：划选正文 / AI 回答一键存笔记 + 自由书写，按本地账号在浏览器归档（localStorage），右侧抽屉支持按课筛选、编辑、导出 Markdown 与一键复制全部。
- **公式渲染**：MathJax v3，支持 `\(...\)` / `\[...\]` / `$...$` / `$$...$$` 以及模型输出的 `[$...$]`。

## 🚀 快速开始

课程内容通过 `fetch` 动态加载，**不能直接双击 `index.html` 打开**（浏览器会拦截本地 fetch）。请用项目自带的 FastAPI 服务（托管网页与 AI 代理）：

```bash
cd QMStudy_web
python -m pip install -r requirements.txt
python -m pip install -r requirements-ai.txt   # AI 后端（quanllm-harness，完整安装）
python server.py          # 默认 127.0.0.1:8765；也可 python server.py --port 9000
```

然后浏览器访问 <http://localhost:8765>，注册或登录本地账号即可开始学习。

> v1.7 后端只需要 FastAPI、uvicorn 与 `python-dotenv`（`requirements.txt`）；AI 后端使用 `quanllm-harness`（`requirements-ai.txt`，**完整安装**，含 SymPy / mpmath / pycommute / QuTiP / OpenFermion 全部后端）。
>
> **Windows 完整安装说明**：pycommute 1.0.0 只有源码包，需要 C++17 编译环境。请先安装 Visual Studio Build Tools 的「使用 C++ 的桌面开发」工作负载，再按 [quanllm-harness 的 Windows 安装指南](https://github.com/lct-unv/quanllm-harness)运行其仓库根目录的官方安装器 `install.ps1`（自动修补并编译 pycommute），然后执行上面的 `pip install -r requirements-ai.txt` 即可。
>
> **API Key 配置（按 quanllm-harness README）**：在项目根目录新建 `APIKEY` 文件，文件中只写 Key 本身（不加引号、变量名或 `export`）。`APIKEY` 文件缺失时回退到 `.env` 的 `QMSTUDY_AI_API_KEY`；两者都没有时 AI 接口返回 503，课程与其它功能不受影响。

> **AI 自测凭据独立**：`/selftest/` 使用 `selftest/APIKEY`，该文件恢复自原始 `app1/.env` 的 `AI_API_KEY`。它不会再被根目录教材 `APIKEY` 覆盖。若以后更换 Key，请按模块分别替换对应文件。

> **运行环境**：推荐 Python 3.11 / 3.12。`pykatex` 用于服务端公式 HTML 渲染；若目标平台没有对应 wheel，服务端会保留 LaTeX 文本降级显示，建议安装成功以获得完整排版。

## 🔐 首次配置凭据（clone 后必做）

本仓库**不包含任何真实 API Key**（`.env`、`APIKEY`、`selftest/.env`、`selftest/APIKEY` 均已被 `.gitignore` 排除）。首次使用请从模板创建并填入真实 Key（两套 AI 使用各自凭据，不要混用）：

| 需要创建的文件 | 复制自 | 用途 |
| :--- | :--- | :--- |
| `.env` | `.env.example` | 服务端口、模型等通用配置 |
| `APIKEY` | `APIKEY.example` | **教材 AI** 助教（quanllm-harness 流水线） |
| `selftest/.env` | `selftest/.env.example` | AI 自测模块配置 |
| `selftest/APIKEY` | `selftest/APIKEY.example` | **AI 自测**模块（非流式、关闭 thinking） |

```bat
copy .env.example .env
copy APIKEY.example APIKEY
copy selftest\.env.example selftest\.env
copy selftest\APIKEY.example selftest\APIKEY
```

配置完成后验证凭据与网关（**不会打印密钥**）：`python check_ai_connections.py`（Windows 也可双击 `check_ai_connections.bat`，会明确区分 401/403 凭据错误与网络不可达）。

## ▶️ 一键运行（Windows）

首次运行双击 `install_and_start.bat`：脚本会创建 `.venv`、安装 `requirements.txt`、执行本地诊断并启动服务。以后直接双击 `start.bat`；PowerShell 用户用 `.\install_and_start.ps1` / `.\start.ps1`。

## 🔌 后端服务端口

| 服务 | 端口 | 说明 |
| :--- | :--- | :--- |
| `server.py`（主服务） | `8765` | 静态网页 + AI 代理（quanllm-harness SSE）+ 策略选择模块（同源 `/strategy`）；`--port` 可改 |

> AI 网关地址由 quanllm-harness 包内置，无需配置；API Key 与模型在项目根 `APIKEY` 文件与 `.env` 的 `QMSTUDY_AI_MODEL` 配置（服务端代理转发，浏览器不直连）。

**页面入口**：`/`（交互教材）· `/selftest/`（AI 自测、自动出卷与阅卷）· `/strategy/report`（学情报告）· `/strategy/graph`（知识图谱）· `/strategy/lab`（策略实验室）· `/strategy/admin`（后台管理）· `/api/docs`（开发模式 API 文档）。

所有模块共用同一顶部导航、同一明暗主题与同一字体策略：西文优先 `Times New Roman`，中文回退 `STZhongsong / 华文中宋`。项目不捆绑字体文件，本机应安装华文中宋；未安装时回退到宋体类字体。

## 📊 策略选择模块（v1.8）

策略选择模块（adaptive-learning）已并入主服务，**无需单独启动、不使用 8000 端口**：

- **账户约定**：QMStudy 本地登录昵称 = 策略模块 `student_id`。顶栏「查看学情报告」按钮会以当前登录昵称打开 `/strategy/report?student_id=<昵称>`；该昵称下的错题回流、复习任务、学情报告都在策略模块中归账。
- **页面**：`/strategy/report`（学情报告，学生 `#student` / 教师 `#teacher` 两个视角）、`/strategy/lab`（策略实验室演示界面）。
- **API**：`/strategy/api/v1/*`（attempts / review_tasks / strategy / mastery / demo / accounts / report），启动时自动建表并灌入演示数据（SQLite `strategy/strategy_dev.db`）。
- **数据库**：默认使用 `strategy/strategy_dev.db`（SQLite）；如需更换，在 `.env` 或环境变量中设置 `DATABASE_URL`（SQLAlchemy 异步 URL，如 `sqlite+aiosqlite:///...`）。PostgreSQL 生产部署需自行用 Alembic 管理迁移（模块源码 `migrations/` 未并入本仓库）。

**数据存储一览**：教材账号、进度、笔记存浏览器 `localStorage`；策略模块用 `strategy/strategy_dev.db`（演示库，可删后重启自动重建并灌入）；AI 自测用 `selftest/data/ai_exam.db`。

## 🔑 本地账号（v1.4 式）

- 首次打开页面会弹出登录遮罩：输入用户名 + 密码（≥4 位）即可「注册」，之后用同一组凭据「登录」。
- 账号、密码 SHA-256 摘要、学习进度、学习时长、完成日期与笔记全部保存在浏览器 localStorage（键：`qm_accounts`、`qm_active_user`、`qm_userdata_*`、`qm_notes_*`），**换浏览器 / 换电脑 / 清除站点数据后不可恢复**。
- 退出登录在顶栏用户区「退出」按钮；切换账号后笔记与进度自动切换到对应账号。

## 🤖 AI 助教配置

- **后端来源**：[lct-unv/quanllm-harness](https://github.com/lct-unv/quanllm-harness)（PyPI `quanllm-harness`）—— 服务端智能体验证流水线，完整安装：`pip install -r requirements-ai.txt`（Windows 下 pycommute 需先按上文的官方安装器编译）。
- **API Key（按 harness README）**：项目根目录的 `APIKEY` 文件（只写 Key 本身）；`HarnessSettings.from_api_key_file()` 在服务端读取，不写入源码或运行记录。`.env` 的 `QMSTUDY_AI_API_KEY` 仅为回退。
- **模型**：`.env` 的 `QMSTUDY_AI_MODEL`（默认 `QuanLLM-v2.0-qm`，可回退 `QuanLLM-v1.0-qm`）。浏览器只调用同源 `/api/ai/answer`（SSE）。
- **AI Provider 抽象层（v2.1）**：AI 后端通过 `ai/providers/` 抽象层调用，`server.py` 不直接依赖 `quanllm_harness`。换 provider 只需改 `.env` 的 `QMSTUDY_AI_PROVIDER` 或新增一个 provider 文件。可用 `GET /api/ai/providers` 查看当前 provider 与可用状态。

## 🔐 安全与部署

- 账号体系是**本地私人账号**（v1.4 式）：仅用于隔离同机同浏览器内不同使用者的学习档案，密码摘要不提供真实服务器鉴权；请勿把它当作安全防护手段。
- 服务端（`server.py`）只托管静态文件与 `/api/ai/answer`：无会话、无 Cookie、无数据库；API Key 只保存在服务端 `APIKEY` 文件 / `.env`，浏览器不可见。
- 服务端保留可信 Host、精确 CORS、请求体上限与安全响应头；`/api/ai/answer` 面向本机使用设计，**若要暴露到局域网 / 公网，请自行加访问控制**，否则任何人都能消耗你的 AI 额度。
- 生产部署必须使用 HTTPS（反向代理终结），`QMSTUDY_ENV=production` 会追加 HSTS 并关闭 `/api/docs`。

**🔒 敏感文件**：`.env`、根目录 `APIKEY`（教材 AI）与 `selftest/APIKEY`（AI 自测）均被 `.gitignore` 排除、不随仓库分发，请按上文「首次配置凭据」自行创建；凭据**仅限内部使用，切勿分享、勿将仓库设为公开**，建议定期轮换 AI Key。`.env.example` / `APIKEY.example` 模板不含真实凭据。

## 📁 目录结构

```text
QMStudy_web/
├── index.html            页面框架：顶部导航 + 课程容器 + MathJax
├── server.py             FastAPI 服务（静态托管 + quanllm-harness SSE 代理）
├── requirements.txt      Python 依赖
├── requirements-ai.txt   quanllm-harness 运行依赖（对齐 harness/pyproject.toml）
├── .env.example          环境变量模板（复制为 .env）
├── .env                  真实配置（AI Key 回退等，随私有仓库提交，勿公开）
├── APIKEY                AI 网关 Key（harness README 规定的凭据来源，勿公开）
├── .gitignore            忽略缓存/系统文件
├── harness/              quanllm-harness v0.1.3 本地源码（server.py 经 sys.path 优先导入）
├── ai/                   AI Provider 抽象层（v2.1：接口 base.py + 工厂 factory.py + harness 适配器）
├── strategy/             策略选择模块（v1.8 并入，同源 /strategy）
│   ├── apps/             FastAPI 子包（api/core/engine/models/repositories/schemas/services）
│   ├── pages/
│   │   ├── report.html   学情报告页（API 已改为同源 /strategy/api/v1）
│   │   └── lab.html      策略实验室演示界面
│   ├── strategy_dev.db   策略模块 SQLite（演示数据，可删后重启自动重建并灌入）
│   └── 统一账户说明.md    账户对接约定说明
├── css/
│   └── main.css          全局样式（教材排版 + 账号/奖状 + AI 助教 UI）
├── js/
│   ├── app.js            导航生成、课程路由、学习进度挂钩、启动
│   ├── loader.js         课程加载、动画生命周期管理、公式渲染
│   ├── account.js        本地账号 + 学习进度/时长 + 学习奖状（localStorage）
│   ├── notes.js          学习笔记（localStorage 按账号归档 + 右侧抽屉）
│   ├── ai-assistant.js   AI 助教（划选追问胶囊 + quanllm-harness SSE 客户端）
│   └── lessons/
│       ├── lesson01.js   ……  第 1 课动画
│       └── lesson16.js   第 16 课动画
├── lessons/
│   ├── lesson01.html     ……  第 1 课正文 + 交互实验
│   ├── lesson16.html
│   └── appendix.html     附录：16 课总复习表 + 数学速查 + 结语
├── CHANGELOG.md         更新日志
└── README.md
```

## 📚 课程 ↔ 动画对应关系

| 课次（本教材） | 交互动画 |
| :--- | :--- |
| 第 1 课 量子力学的黎明 | 黑体辐射滑块 · 光电效应 · 玻尔原子驻波 |
| 第 2 课 波粒二象性与概率波 | 双缝干涉 · 单电子累积 · 归一化/相位 |
| 第 3 课 动量表象与不确定性 | FFT 高斯波包（Δx·Δp） |
| 第 4 课 薛定谔方程与概率流 | 平面波动态 · 概率流箭图 |
| 第 5 课 量子化涌现与坍缩 | 能量扫掠 · 能级乐高与坍缩 |
| 第 6 课 方势阱与隧道效应 | 有限深阱渗透 · 隧道效应 |
| 第 7 课 谐振子与 δ 势 | 谐振子（对应原理）· δ 势 |
| 第 8 课 算符、本征值与 CSCO | 对易式验证 · Robertson 关系 |
| 第 9 课 连续谱与 Dirac 符号 | δ 函数（高斯序列 → δ） |
| 第 10 课 守恒量与 Ehrenfest 定理 | 波包质心经典轨道 |
| 第 11 课 角动量与球谐函数 | 球谐函数 3D 投影 |
| 第 12 课 氢原子 | 氢原子能级与跃迁 |
| 第 13 课 自旋与泡利原理 | 布洛赫球 |
| 第 14 课 微扰论与变分法 | 微扰逐阶逼近 · 变分法调参 |
| 第 15 课 量子跃迁与散射 | 拉比振荡 |
| 第 16 课 纠缠与量子信息 | Bell 态关联（CHSH） |

## 👥 Contributors

- **沈纪中**（[github-sjz-ui](https://github.com/github-sjz-ui)）— 项目作者与维护
- **CASEY**（[CASEY-XIN-2107](https://github.com/CASEY-XIN-2107)）— 项目作者与维护
- **DeepSeek** — AI 能力与内容生成支持
- **lct-unv**（[lct-unv](https://github.com/lct-unv)）— QuanLLM Harness 与模型网关

## 📄 License

私有仓库，保留所有权利。
