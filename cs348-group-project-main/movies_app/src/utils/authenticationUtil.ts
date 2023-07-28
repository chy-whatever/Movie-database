import jwt_decode from 'jwt-decode';

export const isTokenValid = () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decodedToken: {exp: number} = jwt_decode(token);
            const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds
            const currentTime = Date.now();
            return currentTime < expirationTime;
        } catch (error) {
            console.error('Error decoding JWT token:', error);
            return false;
        }
    }
    return false;
};
