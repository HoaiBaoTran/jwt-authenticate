import { create } from 'zustand';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import type { AuthState } from '@/types/store';

export const useAuthStore = create<AuthState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,

    clearState: () => {
        set({ accessToken: null, user: null, loading: false })
    },

    signUp: async (username, password, email, firstName, lastName) => {
        try {
            set({ loading: true });
            // call backend api
            await authService.signUp(username, password, email, firstName, lastName);

            toast.success('Signup successfully! You will be redirected to signin page')
        } catch (error) {
            console.error(error);
            toast.error('Signup failed!!!')
        } finally {
            set({ loading: false });
        }
    },

    signIn: async (username, password) => {
        try {
            set({ loading: true });
            // call backend api
            const { accessToken } = await authService.signIn(username, password);
            set({ accessToken })
            toast.success('Signin successfully! You will be redirected to signin page')
        } catch (error) {
            console.error(error);
            toast.error('Signin failed!!!')
        } finally {
            set({ loading: false });
        }
    },

    signOut: async () => {
        try {
            get().clearState();
            await authService.signOut();
            toast.success('Logout successfully!!!');
        } catch (error) {
            console.error(error);
            toast.error('Error when sign out. Please try again');
        }
    }

}));