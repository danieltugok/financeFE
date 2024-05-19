import { UserStore } from 'src/stores/user';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import {
  //   getUsersService,
  getLoginService,
  getProfileService,
  forgotPassService,
  //   updateUserService,
  //   getUserImageProfileService,
  //   resetPassService,
  getUserMenuService,
  //   updateUserProfileImageService,
} from 'src/services/userServices';

export const userComposable = () => {
  const $q = useQuasar();
  const { setUser, setUserMenu, setTokens } = UserStore();
  const { user, accessToken, refreshToken, userMenu } = storeToRefs(
    UserStore()
  );

  const languages = [
    { label: 'English', language: 'en', flag: 'united-states', country: 'US' },
    // { label: 'Español', language: 'es', flag: 'spain', country: 'US'},
    { label: 'Portugues', language: 'pt', flag: 'portugal', country: 'BR' },
  ];

  async function getUsers(query: any): Promise<void> {
    $q.loading.show();
    try {
      // const { status, data } = await getUsersService(query);
      // if (status === 201) {
      //   user.value = data;
      // }
    } catch (error) {
      console.log(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function getUserProfileImage(imageName: string): Promise<any> {
    $q.loading.show();
    try {
      // const response = await getUserImageProfileService(imageName);
      // return response;
    } catch (error: any) {
      console.log(error);
      return error.response.data;
    } finally {
      $q.loading.hide();
    }
  }

  async function updateUserProfileImage(userProfileImage: any): Promise<any> {
    $q.loading.show();
    try {
      // const { status } = await updateUserProfileImageService(userProfileImage);
      // return { status };
    } catch (error: any) {
      console.log(error);
      return error.response.data;
    } finally {
      $q.loading.hide();
    }
  }

  async function updateUser(userID: string, userUpated: any): Promise<any> {
    $q.loading.show();
    try {
      // const { status } = await updateUserService(userID, userUpated);
      // return { status };
    } catch (error: any) {
      console.log(error);
      return error.response.data;
    } finally {
      $q.loading.hide();
    }
  }

  async function getLogin(username: string, password: string): Promise<any> {
    $q.loading.show();
    try {
      const { status, data } = await getLoginService(username, password);
      if (status === 201) setTokens(data);
      return { status, data };
    } catch (error: any) {
      console.log(error);
      return error.response.data;
    } finally {
      $q.loading.hide();
    }
  }

  async function forgotPass(email: string): Promise<any> {
    $q.loading.show();
    try {
      const { status } = await forgotPassService(email);
      return { status };
    } catch (error: any) {
      console.log(error);
      return error.response.data;
    } finally {
      $q.loading.hide();
    }
  }

  async function resetPass(password: string): Promise<any> {
    $q.loading.show();
    try {
      // const { status } = await resetPassService(password);
      // return { status };
    } catch (error: any) {
      console.log(error);
      return error.response.data;
    } finally {
      $q.loading.hide();
    }
  }

  async function getProfile(): Promise<void> {
    $q.loading.show();
    try {
      const { status, data } = await getProfileService();
      if (status === 200) {
        setUser(data);
      }
    } catch (error) {
      console.log('ERROR: ', error);
    } finally {
      $q.loading.hide();
    }
  }

  async function getUserMenu(): Promise<void> {
    $q.loading.show();
    try {
      const { status, data } = await getUserMenuService();
      if (status === 200) {
        setUserMenu(data);
      }
    } catch (error) {
      console.log('ERROR: ', error);
    } finally {
      $q.loading.hide();
    }
  }

  return {
    setUser,
    updateUser,
    getUserProfileImage,
    updateUserProfileImage,
    user,
    languages,
    accessToken,
    refreshToken,
    getUsers,
    getLogin,
    getProfile,
    forgotPass,
    resetPass,
    getUserMenu,
  };
};
