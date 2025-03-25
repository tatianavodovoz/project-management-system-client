import React, { useState, ReactNode, createContext, useContext, useEffect } from "react"

interface ManageContextType {
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
}

const ManageContext = createContext<ManageContextType>({
    isAdmin: false,
    setIsAdmin: () => {}
});

export const ManageProvider = ({children}: {children: ReactNode}) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(() => {
        const userData = localStorage.getItem('user');
        console.log('Initial userData:', userData);
        
        // Проверяем значение isAdmin из localStorage
        const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
        if (userData) {
            const user = JSON.parse(userData);
            console.log('Initial user admin status:', user.client_admin);
            // Если storedIsAdmin true, используем его, иначе используем client_admin
            return storedIsAdmin || user.client_admin === true; 
        }
        return false;
    });

    // Активно проверяем роль пользователя
    useEffect(() => {
        const checkUserRole = () => {
            const userData = localStorage.getItem('user');
            console.log('Checking user role, userData:', userData);
            
            if (userData) {
                const user = JSON.parse(userData);
                console.log('Current user role:', user.client_role);
                console.log('Current isAdmin state:', isAdmin);
                
                const shouldBeAdmin = user.client_role === 'admin';
                if (shouldBeAdmin !== isAdmin) {
                    console.log('Updating isAdmin to:', shouldBeAdmin);
                    setIsAdmin(shouldBeAdmin);
                }
            } else if (isAdmin) {
                console.log('No user data found, setting isAdmin to false');
                setIsAdmin(false);
            }
        };

        // Проверяем роль каждый раз при монтировании и при изменении localStorage
        checkUserRole();

        const handleStorageChange = () => {
            console.log('Storage changed, checking role');
            checkUserRole();
        };

        window.addEventListener('storage', handleStorageChange);
        
        // Добавляем интервальную проверку
        const interval = setInterval(checkUserRole, 1000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [isAdmin]);

    console.log('ManageProvider rendering with isAdmin:', isAdmin);

    return (
        <ManageContext.Provider value={{ isAdmin, setIsAdmin }}>
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
