import React, { useEffect, useState } from 'react';
import { 
    Grid, 
    Card, 
    CardContent, 
    Typography, 
    Button,
    Container,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Board } from '../../types';
import { api } from '../../services/api';
import BoardForm from './BoardForm';

const BoardList: React.FC = () => {
    const navigate = useNavigate();
    const [boards, setBoards] = useState<Board[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [error, setError] = useState<string>('');
    const [editingBoard, setEditingBoard] = useState<Board | null>(null);


    useEffect(() => {
        fetchBoards();
    }, []);

    const fetchBoards = async () => {
        try {
            const response = await api.get('/boards');
            console.log('response.data', response.data);
            setBoards(response.data);
        } catch (error) {
            console.error('Error fetching boards:', error);
            setError('Ошибка при загрузке досок');
        }
    };

    const handleCreateBoard = async (boardData: Partial<Board>) => {
        try {
            // Получаем данные пользователя из localStorage
            const userData = localStorage.getItem('user');
            if (!userData) {
                throw new Error('Необходимо войти в систему');
            }
            
            const user = JSON.parse(userData);
            const newBoardData = {
                ...boardData,
                board_creator_id: user.client_id
            };

            console.log('Создаем доску:', newBoardData);
            const response = await api.post('/boards', newBoardData);
            console.log('Ответ сервера:', response.data);
            
            fetchBoards();
            setError('');
        } catch (error: any) {
            console.error('Error creating board:', error);
            setError(error.message || 'Ошибка при создании доски');
        }
    };

    const handleEditBoard = async (boardData: Partial<Board>) => {
        if (!editingBoard) return;
        try {
          await api.put(`/boards/${editingBoard.board_id}`, boardData);
          fetchBoards();
          setEditingBoard(null);
        } catch (error) {
          setError('Ошибка при редактировании доски');
        }
      };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">
                    Мои доски
                </Typography>
                <Button 
                    variant="contained" 
                    onClick={() => setIsFormOpen(true)}
                >
                    Создать доску
                </Button>
            </Box>

            {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Grid container spacing={3}>
                {boards.map(board => (
                    <Grid item xs={12} sm={6} md={4} key={board.board_id}>
                        <Card 
                            sx={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/boards/${board.board_id}`)}
                        >
                            <CardContent>
                                <Typography variant="h5">
                                    {board.board_name}
                                </Typography>
                                <Button 
                                    onClick={e => { e.stopPropagation(); setEditingBoard(board); }}>Редактировать
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <BoardForm
                open={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreateBoard}
            />
            <BoardForm
                open={!!editingBoard}
                onClose={() => setEditingBoard(null)}
                onSubmit={handleEditBoard}
                board={editingBoard || undefined}
            />

            
        </Container>
    );
};

export default BoardList; 