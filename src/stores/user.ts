import { ref } from 'vue';
import { defineStore } from 'pinia';
import type UserType from 'src/types/userTypes';
import { QueryParameters } from 'src/utils/helpers';

export const UserStore = defineStore('user', () => {
  const user = ref<UserType | null>(null);
  const oneUser = ref<any>(null);
  const userMenu = ref<any>(null);
  const accessToken = ref<string | null>(null);
  const refreshToken = ref<string | null>(null);

  // USERS
  const users = ref<UserType[]>([]);
  const countUsers = ref<number>(0);
  const queryUsers = ref<QueryParameters>({ page: 1, perPage: 10 });
  const filterUsers = ref<any>({});

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

  // USERS
  function setUsers(data: any): void {
    users.value = data;
  }

  function setOneUser(data: any): void {
    oneUser.value = data;
  }

  function setQueryUsers(data: QueryParameters): void {
    queryUsers.value = data;
  }

  function setCountUsers(data: number): void {
    countUsers.value = data;
  }

  function setFilterUsers(data: any): void {
    filterUsers.value = data;
  }

  return {
    user,
    users,
    filterUsers,
    setFilterUsers,
    oneUser,
    setUsers,
    setUser,
    setTokens,
    refreshToken,
    accessToken,
    userMenu,
    setUserMenu,
    countUsers,
    queryUsers,
    setQueryUsers,
    setCountUsers,
    setOneUser,
  };
});
