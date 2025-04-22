import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSessionStore = defineStore('session', () => {
    const username = ref(localStorage.getItem('username') || '');
    const boardName = ref(localStorage.getItem('boardName') || '');

    const setUsername = (name) => {
        username.value = name;
        localStorage.setItem('username', name);
    };

    const setBoardName = (name) => {
        boardName.value = name;
        localStorage.setItem('boardName', name);
    };

    const clearSession = () => {
        username.value = '';
        boardName.value = '';
        localStorage.removeItem('username');
        localStorage.removeItem('boardName');
    };

    return { username, boardName, setUsername, setBoardName, clearSession };
});
