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

    setAccessToken: (accessToken) => {
        set({ accessToken });
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
            get().setAccessToken(accessToken);

            await get().fetchMe();

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
    },

    fetchMe: async () => {
        try {
            set({ loading: true });
            const user = await authService.fetchMe();

            set({ user })
        } catch (error) {
            console.error(error);
            set({ user: null, accessToken: null });
            toast.error('Error when get user data. Please try again');
        } finally {
            set({ loading: false })
        }
    },

    refresh: async () => {
        try {
            set({ loading: true })
            const { user, fetchMe, setAccessToken } = get();
            const accessToken = await authService.refresh();

            setAccessToken(accessToken);

            if (!user) {
                await fetchMe();
            }
        } catch (error) {

            console.error(error);
            toast.error('Signin session expired. Please sign in again');
            get().clearState();

        } finally {
            set({ loading: false })
        }
    }

}));