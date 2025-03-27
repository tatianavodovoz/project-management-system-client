import React, { useState, ReactNode, createContext, useContext, useEffect } from "react"

interface ManageContextType {
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
    refreshAdminStatus: () => void;
}

const ManageContext = createContext<ManageContextType>({
    isAdmin: false,
    setIsAdmin: () => { },
    refreshAdminStatus: () => { }
});

export const ManageProvider = ({ children }: { children: ReactNode }) => {
    // Функция для проверки, является ли пользователь администратором
    const checkIsAdmin = () => {
        return localStorage.getItem('isAdmin') === "true";
    };

    // При инициализации проверяем статус админа
    const [isAdmin, setIsAdmin] = useState<boolean>(checkIsAdmin);

    // Функция для обновления статуса администратора (можно вызывать из компонентов)
    const refreshAdminStatus = () => {
        setIsAdmin(checkIsAdmin());
    };

    // На первом рендере и при изменениях localStorage обновляем статус
    useEffect(() => {
        refreshAdminStatus();

        const handleStorageChange = () => {
            refreshAdminStatus();
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <ManageContext.Provider value={{ isAdmin, setIsAdmin, refreshAdminStatus }}>
            {children}
        </ManageContext.Provider>
    );
}

export const useManage = () => {
    const context = useContext(ManageContext);
    if (!context) {
        throw new Error('useManage must be used within a ManageProvider');
    }
    return context;
}