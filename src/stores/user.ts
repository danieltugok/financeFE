import { ref } from 'vue';
import { defineStore } from 'pinia';
import type UserType from 'src/types/userTypes';

export const UserStore = defineStore('user', () => {
  const user = ref<UserType | null>(null);
  const userMenu = ref<any>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);

  function setUser(data: any): void {
    user.value = data;
  }

  function setUserMenu(data: any): void {
    userMenu.value = data;
  }

  function setTokens(data: any): void {
    localStorage.setItem('access_token', data.accessToken);
    localStorage.setItem('refresh_token', data.refreshToken);
    (accessToken.value = data.accessToken),
      (refreshToken.value = data.refreshToken);
  }

  return {
    user,
    setUser,
    setTokens,
    refreshToken,
    accessToken,
    userMenu,
    setUserMenu,
  };
});
