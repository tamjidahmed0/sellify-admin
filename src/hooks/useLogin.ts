import { useMutation } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    access_token: string;
}

const loginRequest = async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(error.message ?? `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const useLogin = () => {
    return useMutation<LoginResponse, Error, LoginPayload>({
        mutationFn: loginRequest,

        onError: (error) => {
            console.error('Login failed:', error.message);
        },
    });
};