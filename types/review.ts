// ============================================================
// 管理端编辑模块的类型定义
// 说明：HeatmapItem、ReviewInput 等类型已在 @/lib/reviews 中定义
//       这里只放管理端编辑器独有的类型
// ============================================================

// 🔵 MoodOption：心情选项（MoodSelector 组件用）
export type MoodOption = {
  emoji: string; // 表情符号，例如 "😊"
  label: string; // 文字描述，例如 "开心"
  value: string; // 存储的值，例如 "happy"
};

// 🔵 SaveStatus：保存状态（ReviewEditor 组件用）
export type SaveStatus = "idle" | "saving" | "success" | "error";
