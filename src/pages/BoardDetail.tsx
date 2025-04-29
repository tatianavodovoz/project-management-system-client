/**
 * Страница детального просмотра доски с задачами.
 * Отображает задачи в формате канбан-доски с колонками To Do, In Progress и Done.
 * Позволяет создавать, редактировать, удалять задачи и менять их статус.
 */
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    CircularProgress
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Task } from '../types';
import { api } from '../services/api';
import TaskForm from '../components/Task/TaskForm';
import TaskCard from '../components/Task/TaskCard';

const calculateRiceScore = (reach: number, impact: number, confidence: number, effort: number): number => {
    // RICE = Reach * Impact * Confidence / Effort
    return (reach * impact * (confidence / 100)) / effort;
};

const sortTask = (data: Task[]) => {
    for (const obj of data) {
        const todayDate = new Date();
        const deadlineDate = new Date(obj.task_deadline);
        const timeLeft = (deadlineDate.getTime() - todayDate.getTime()) / (1000 * 3600 * 24);

        if (obj.task_importance == true && timeLeft <= obj.task_time_warning) {
            obj.task_category_matrix = 1
        }
        if (obj.task_importance == true && timeLeft > obj.task_time_warning) {
            obj.task_category_matrix = 2
        }
        if (obj.task_importance == false && timeLeft <= obj.task_time_warning) {
            obj.task_category_matrix = 3
        }
        if (obj.task_importance == false && timeLeft > obj.task_time_warning) {
            obj.task_category_matrix = 4
        }
        if (obj.task_effort == 0) {
            continue
        }
        else {
            // Рассчитываем RICE score
            const riceScore = calculateRiceScore(
                obj.task_reach,
                obj.task_impact,
                obj.task_confidence,
                obj.task_effort
            );

            obj.task_rice_score = riceScore;

        }
    }
    return data;
}

const BoardDetail: React.FC = () => {
    const { boardId } = useParams<{ boardId: string }>();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [boardName, setBoardName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
    const [showMatrix, setShowMatrix] = useState(false);
    const client_token = localStorage.getItem('token');
    const client_id = localStorage.getItem('client_id');

    // Получение задач доски
    const fetchTasks = useCallback(async () => {
        try {
            setIsLoading(true);
            const boardResponse = await api.get(`/boards/${boardId}`);
            setBoardName(boardResponse.data.board_name);

            const tasksResponse = await api.get('/tasks', {
                params: { board_id: boardId }
            });
            const sortedTask = sortTask(tasksResponse.data)
            setTasks(sortedTask);
            console.log('Результат сортировки (матрица):', sortedTask);
            setError('');
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            setError(error.message || 'Ошибка при загрузке задач');
        } finally {
            setIsLoading(false);
        }
    }, [boardId]);

    useEffect(() => {
        if (boardId) {
            fetchTasks();
        }
    }, [fetchTasks]);

    // Создание новой задачи
    const handleCreateTask = async (taskData: Partial<Task>) => {
        try {
            if (!client_token) throw new Error('Необходимо войти в систему');

            const newTaskData = {
                ...taskData,
                task_performer_id: Number(client_id), //был client_token, с ним не работало создание задачи
                task_board_id: Number(boardId)
            };

            await api.post('/tasks', newTaskData);
            fetchTasks();
            setIsTaskFormOpen(false);
        } catch (error: any) {
            console.error('Error creating task:', error);
            setError(error.message || 'Ошибка при создании задачи');
        }
    };

    // Обновление статуса задачи
    const handleStatusChange = async (taskId: number, newStatus: string) => {
        try {
            await api.patch(`/tasks/${taskId}`, { task_status: newStatus });
            fetchTasks();
        } catch (error: any) {
            console.error('Error updating task status:', error);
            setError(error.message || 'Ошибка при обновлении статуса');
        }
    };

    // Редактирование задачи
    const handleEditTask = async (taskData: Partial<Task>) => {
        try {
            if (!editingTask) return;
            await api.put(`/tasks/${editingTask.task_id}`, taskData);
            fetchTasks();
            setEditingTask(undefined);
        } catch (error: any) {
            console.error('Error updating task:', error);
            setError(error.message || 'Ошибка при обновлении задачи');
        }
    };

    // Удаление задачи
    const handleDeleteTask = async (taskId: number) => {
        try {
            await api.delete(`/tasks/${taskId}`);
            fetchTasks();
        } catch (error: any) {
            console.error('Error deleting task:', error);
            setError(error.message || 'Ошибка при удалении задачи');
        }
    };

    // Фильтрация задач по статусу
    const filterTasksByStatus = (status: string) => {
        return tasks.filter(task => task.task_status === status);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    {boardName}
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setIsTaskFormOpen(true)}
                >
                    Добавить задачу
                </Button>
                <Button
                    variant={showMatrix ? "outlined" : "contained"}
                    onClick={() => setShowMatrix((prev) => !prev)}
                >
                    {showMatrix ? "Скрыть матрицу Эйзенхауэра" : "Показать матрицу Эйзенхауэра"}
                </Button>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            {showMatrix ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, mb: 4 }}>
                    {/* Квадрант 1 */}
                    <Paper sx={{ p: 2, minHeight: 200, border: '2px solid #1976d2', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Важные и срочные (1)</Typography>
                        {tasks.filter(t => t.task_category_matrix === 1).sort((a,b) => (b.task_rice_score - a.task_rice_score)).map(task => (
                            <TaskCard key={task.task_id} task={task} onStatusChange={handleStatusChange} onEdit={t => { setEditingTask(t); setIsTaskFormOpen(true); }} onDelete={handleDeleteTask} />
                        ))}
                    </Paper>
                    {/* Квадрант 2 */}
                    <Paper sx={{ p: 2, minHeight: 200, border: '2px solid #1976d2', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Важные, не срочные (2)</Typography>
                        {tasks.filter(t => t.task_category_matrix === 2).sort((a,b) => (b.task_rice_score - a.task_rice_score)).map(task => (
                            <TaskCard key={task.task_id} task={task} onStatusChange={handleStatusChange} onEdit={t => { setEditingTask(t); setIsTaskFormOpen(true); }} onDelete={handleDeleteTask} />
                        ))}
                    </Paper>
                    {/* Квадрант 3 */}
                    <Paper sx={{ p: 2, minHeight: 200, border: '2px solid #1976d2', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Неважные, срочные (3)</Typography>
                        {tasks.filter(t => t.task_category_matrix === 3).sort((a,b) => (b.task_rice_score - a.task_rice_score)).map(task => (
                            <TaskCard key={task.task_id} task={task} onStatusChange={handleStatusChange} onEdit={t => { setEditingTask(t); setIsTaskFormOpen(true); }} onDelete={handleDeleteTask} />
                        ))}
                    </Paper>
                    {/* Квадрант 4 */}
                    <Paper sx={{ p: 2, minHeight: 200, border: '2px solid #1976d2', borderRadius: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Неважные, не срочные (4)</Typography>
                        {tasks.filter(t => t.task_category_matrix === 4).sort((a,b) => (b.task_rice_score - a.task_rice_score)).map(task => (
                            <TaskCard key={task.task_id} task={task} onStatusChange={handleStatusChange} onEdit={t => { setEditingTask(t); setIsTaskFormOpen(true); }} onDelete={handleDeleteTask} />
                        ))}
                    </Paper>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {/* Колонка TODO */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                К выполнению
                            </Typography>
                            {filterTasksByStatus('TODO').map(task => (
                                <TaskCard
                                    key={task.task_id}
                                    task={task}
                                    onStatusChange={handleStatusChange}
                                    onEdit={(task) => {
                                        setEditingTask(task);
                                        setIsTaskFormOpen(true);
                                    }}
                                    onDelete={handleDeleteTask}
                                />
                            ))}
                        </Paper>
                    </Grid>

                    {/* Колонка IN PROGRESS */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                В работе
                            </Typography>
                            {filterTasksByStatus('IN PROGRESS').map(task => (
                                <TaskCard
                                    key={task.task_id}
                                    task={task}
                                    onStatusChange={handleStatusChange}
                                    onEdit={(task) => {
                                        setEditingTask(task);
                                        setIsTaskFormOpen(true);
                                    }}
                                    onDelete={handleDeleteTask}
                                />
                            ))}
                        </Paper>
                    </Grid>

                    {/* Колонка DONE */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Выполнено
                            </Typography>
                            {filterTasksByStatus('DONE').map(task => (
                                <TaskCard
                                    key={task.task_id}
                                    task={task}
                                    onStatusChange={handleStatusChange}
                                    onEdit={(task) => {
                                        setEditingTask(task);
                                        setIsTaskFormOpen(true);
                                    }}
                                    onDelete={handleDeleteTask}
                                />
                            ))}
                        </Paper>
                    </Grid>
                </Grid>
            )}

            <TaskForm
                open={isTaskFormOpen}
                onClose={() => {
                    setIsTaskFormOpen(false);
                    setEditingTask(undefined);
                }}
                onSubmit={editingTask ? handleEditTask : handleCreateTask}
                task={editingTask}
                boardId={Number(boardId)}
            />
        </Container>
    );
};

export default BoardDetail; 