/**
 * Компонент TaskCard отображает отдельную задачу в виде карточки.
 * Предоставляет возможности управления задачей: изменение статуса, редактирование и удаление.
 */
import React from 'react';
import { Card, CardContent, Typography, Chip, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Task } from '../../types';

interface TaskCardProps {
    /** Объект задачи для отображения */
    task: Task;
    /** Callback для изменения статуса задачи */
    onStatusChange: (taskId: number, newStatus: string) => void;
    /** Callback для редактирования задачи */
    onEdit: (task: Task) => void;
    /** Callback для удаления задачи */
    onDelete: (taskId: number) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onEdit, onDelete }) => {
    // Состояние для управления меню действий
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    /**
     * Обработчик открытия меню действий
     */
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    /**
     * Обработчик закрытия меню действий
     */
    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    /**
     * Определяет цвет чипа статуса задачи
     * @param status - текущий статус задачи
     * @returns цвет Material-UI для компонента Chip
     */
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'todo':
                return 'default';
            case 'in progress':
                return 'primary';
            case 'done':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status.toUpperCase()) {
            case 'TODO':
                return 'К выполнению';
            case 'IN PROGRESS':
                return 'В работе';
            case 'DONE':
                return 'Выполнено';
            default:
                return status;
        }
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                {/* Заголовок задачи и кнопка меню */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6">{task.task_name}</Typography>
                    <IconButton onClick={handleMenuOpen}>
                        <MoreVertIcon />
                    </IconButton>
                </div>
                {/* Описание задачи */}
                <Typography color="textSecondary" gutterBottom>
                    {task.task_description}
                </Typography>
                {/* Статус и дедлайн */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                    <Chip 
                        label={getStatusLabel(task.task_status)}
                        color={getStatusColor(task.task_status) as any}
                        size="small"
                    />
                    <Typography variant="caption">
                        Дедлайн: {new Date(task.task_deadline).toLocaleDateString()}
                    </Typography>
                </div>
                {/* Меню действий */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => {
                        onStatusChange(task.task_id, 'TODO');
                        handleMenuClose();
                    }}>К выполнению</MenuItem>
                    <MenuItem onClick={() => {
                        onStatusChange(task.task_id, 'IN PROGRESS');
                        handleMenuClose();
                    }}>В работе</MenuItem>
                    <MenuItem onClick={() => {
                        onStatusChange(task.task_id, 'DONE');
                        handleMenuClose();
                    }}>Выполнено</MenuItem>
                    <MenuItem onClick={() => {
                        onEdit(task);
                        handleMenuClose();
                    }}>Редактировать</MenuItem>
                    <MenuItem onClick={() => {
                        onDelete(task.task_id);
                        handleMenuClose();
                    }}>Удалить</MenuItem>
                </Menu>
            </CardContent>
        </Card>
    );
};

export default TaskCard; 