/**
 * Компонент BoardForm предоставляет форму для создания и редактирования досок.
 * Отображается в модальном окне и позволяет задать название доски и её тип (общая/личная).
 */
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import { Board } from '../../types';

interface BoardFormProps {
    /** Флаг для отображения/скрытия модального окна */
    open: boolean;
    /** Callback для закрытия модального окна */
    onClose: () => void;
    /** Callback для отправки данных формы */
    onSubmit: (board: Partial<Board>) => void;
    /** Объект доски для редактирования (опционально) */
    board?: Board;
}

const BoardForm: React.FC<BoardFormProps> = ({ open, onClose, onSubmit, board }) => {
    // Состояние формы с начальными значениями
    const [formData, setFormData] = useState<Partial<Board>>({
        board_name: '',
        board_general: false
    });

    /**
     * Эффект для заполнения формы данными при редактировании существующей доски
     */
    useEffect(() => {
        if (board) {
            setFormData(board);
        }
    }, [board]);

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
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    {board ? 'Редактировать доску' : 'Создать новую доску'}
                </DialogTitle>
                <DialogContent>
                    {/* Название доски */}
                    <TextField
                        autoFocus
                        margin="dense"
                        name="board_name"
                        label="Название доски"
                        fullWidth
                        value={formData.board_name}
                        onChange={handleChange}
                        required
                    />
                    {/* Флаг общей доски */}
                    <FormControlLabel
                        control={
                            <Checkbox
                                name="board_general"
                                checked={formData.board_general}
                                onChange={handleChange}
                            />
                        }
                        label="Общая доска"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Отмена</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {board ? 'Сохранить' : 'Создать'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default BoardForm; 