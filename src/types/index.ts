export interface Board {
    board_id: number;
    board_name: string;
    board_general: boolean;
    board_creator_id: number;
}

export interface Task {
    task_id: number;
    task_name: string;
    task_description: string;
    task_status: string;
    task_performer_id: number;
    task_deadline: string;
    task_board_id: number;
    task_importance: boolean;
    task_time_warning: number;
    task_category_matrix: number;
    task_reach: number;      // Охват (сколько пользователей затронет)
    task_impact: number;     // Влияние (1-3: низкое, среднее, высокое)
    task_confidence: number; // Уверенность (0-100%)
    task_effort: number;     // Усилия (в человеко-недели)
    task_rice_score: number; // Итоговый RICE score
}

export interface Client {
    client_id: number;
    client_email: string;
    client_name: string;
    client_role: string;
} 