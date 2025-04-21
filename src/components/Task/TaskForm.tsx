/**
 * Компонент TaskForm предоставляет форму для создания и редактирования задач.
 * Отображается в модальном окне и поддерживает все основные поля задачи.
 */
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
    Checkbox,
    FormControlLabel
} from '@mui/material';
import { Task } from '../../types';

interface TaskFormProps {
    /** Флаг для отображения/скрытия модального окна */
    open: boolean;
    /** Callback для закрытия модального окна */
    onClose: () => void;
    /** Callback для отправки данных формы */
    onSubmit: (task: Partial<Task>) => void;
    /** Объект задачи для редактирования (опционально) */
    task?: Task;
    /** ID доски, к которой относится задача */
    boardId: number;
}

const TaskForm: React.FC<TaskFormProps> = ({ open, onClose, onSubmit, task, boardId }) => {
    // Состояние формы с начальными значениями
    const [formData, setFormData] = useState<Partial<Task>>({
        task_name: '',
        task_description: '',
        task_status: 'TODO',
        task_deadline: new Date().toISOString().split('T')[0],
        task_board_id: boardId,
        task_importance: false
    });

    /**
     * Форматирование даты в формат YYYY-MM-DD для поля ввода
     */
    const formatDateForInput = (date: string | Date): string => {
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    /**
     * Эффект для заполнения формы данными при редактировании существующей задачи
     */
    useEffect(() => {
        if (task) {
            setFormData({
                ...task,
                task_deadline: formatDateForInput(task.task_deadline),
                task_importance: task.task_importance ?? false
            });
        } else {
            // Сброс формы при создании новой задачи
            setFormData({
                task_name: '',
                task_description: '',
                task_status: 'TODO',
                task_deadline: formatDateForInput(new Date()),
                task_board_id: boardId,
                task_importance: false
            });
        }
    }, [task, boardId]);

    /**
     * Обработчик отправки формы
     * @param e - событие отправки формы
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    /**
     * Обработчик изменения полей формы
     * @param e - событие изменения поля
     */
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {task ? 'Редактировать задачу' : 'Создать новую задачу'}
                </DialogTitle>
                <DialogContent>
                    {/* Название задачи */}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="task_name"
                        label="Название задачи"
                        fullWidth
                        value={formData.task_name}
                        onChange={handleTextChange}
                        required
                    />
                    {/* Описание задачи */}
                    <TextField
                        margin="dense"
                        name="task_description"
                        label="Описание"
                        fullWidth
                        multiline
                        rows={4}
                        value={formData.task_description}
                        onChange={handleTextChange}
                        required
                    />
                   
                    {/* Дедлайн задачи */}
                    <TextField
                        margin="dense"
                        name="task_deadline"
                        label="Дедлайн"
                        type="date"
                        fullWidth
                        value={formData.task_deadline}
                        onChange={handleTextChange}
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                     {/* Важность задачи */}
                     <FormControlLabel
                        control={
                            <Checkbox
                                checked={Boolean(formData.task_importance)}
                                onChange={(e) => setFormData(prev => ({ ...prev, task_importance: e.target.checked }))}
                                name="task_importance"
                            />
                        }
                        label="Важно"
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Отмена</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {task ? 'Сохранить' : 'Создать'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default TaskForm; 