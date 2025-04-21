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
    task_importance?: boolean;
}

export interface Client {
    client_id: number;
    client_email: string;
    client_name: string;
    client_role: string;
} 