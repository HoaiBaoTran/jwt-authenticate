import { create } from 'zustand';
import { toast } from 'sonner';

export const useAuthStore = create((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            // call backend api
            toast.success('Signup successfully! You will be redirected to signin page')
        } catch (error) {
            console.error(error);
            toast.error('Signup failed!!!')
        } finally {
            set({ loading: false });
        }
    }

}))