import { UserStore } from 'src/stores/user';
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import {
  getUsersService,
  deleteUsersService,
  getLoginService,
  getProfileService,
  forgotPassService,
  updateUserService,
  CreateUserService,
  //   getUserImageProfileService,
  //   resetPassService,
  getUserMenuService,
  //   updateUserProfileImageService,
} from 'src/services/userServices';

export const userComposable = () => {
  const $q = useQuasar();
  const {
    setUser,
    setUserMenu,
    setTokens,
    setUsers,
    setOneUser,
    setQueryUsers,
    setCountUsers,
    setFilterUsers,
  } = UserStore();
  const {
    user,
    users,
    oneUser,
    accessToken,
    refreshToken,
    userMenu,
    filterUsers,
    countUsers,
    queryUsers,
  } = storeToRefs(UserStore());

  const languages = [
    { label: 'English', language: 'en', flag: 'united-states', country: 'US' },
    // { label: 'Español', language: 'es', flag: 'spain', country: 'US'},
    { label: 'Portugues', language: 'pt', flag: 'portugal', country: 'BR' },
  ];

  async function getUsers(query: any): Promise<void> {
    $q.loading.show();

    // Transform from & to -> startDate & endDate
    const { from, to, ...rest } = query;
    query.startDate = from
      ? new Date(from).toISOString()
      : query.startDate
      ? query.startDate
      : null;
    query.endDate = to
      ? new Date(to).toISOString()
      : query.endDate
      ? query.endDate
      : null;
    delete query.from;
    delete query.to;
    try {
      const { status, data } = await getUsersService(query);
      if (status === 200) {
        setUsers(data?.data);
        setCountUsers(data?.meta?.totalItems);
      }
    } catch (error) {
      console.log(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function getUserById(id: string): Promise<void> {
    $q.loading.show();
    try {
      const { status, data } = await getUsersService({ id: id });
      if (status === 200) {
        setOneUser(data?.data[0]);
      }
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
    // console.log('🚀 ~ updateUser ~ userUpated:', userUpated);
    $q.loading.show();

    const userDetail = JSON.parse(JSON.stringify(userUpated));
    delete userDetail?.id;
    delete userDetail?.email;
    delete userDetail?.isVerified;
    delete userDetail?.imageProfile;
    delete userDetail?.createdAt;
    delete userDetail?.updatedAt;
    delete userDetail?.preference.dashboard;
    delete userDetail?.dashboard;

    console.log('🚀 ~ updateUser ~ userDetail:', userDetail);
    try {
      const { status } = await updateUserService(userID, userDetail);
      return { status };
    } catch (error: any) {
      console.log(error);
      return error.response.data;
    } finally {
      $q.loading.hide();
    }
  }

  async function createUser(userValue: any): Promise<any> {
    $q.loading.show();

    const userDetail = JSON.parse(JSON.stringify(userValue));
    delete userDetail?.id;
    delete userDetail?.isVerified;
    delete userDetail?.imageProfile;
    delete userDetail?.createdAt;
    delete userDetail?.updatedAt;
    delete userDetail?.preference;
    delete userDetail?.dashboard;

    try {
      const { status, data } = await CreateUserService(userDetail);
      if (status === 201) {
        return { status, data };
      }
    } catch (error) {
      console.log(error);
      return error;
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
    users,
    languages,
    accessToken,
    refreshToken,
    getUsers,
    getLogin,
    getProfile,
    forgotPass,
    resetPass,
    getUserMenu,
    countUsers,
    queryUsers,
    setUsers,
    setQueryUsers,
    setCountUsers,
    createUser,
    getUserById,
    setOneUser,
    oneUser,
    filterUsers,
    setFilterUsers,
    deleteUsersService,
  };
};
