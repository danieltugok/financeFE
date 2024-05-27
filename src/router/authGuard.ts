import { userComposable } from 'src/composables/userComposable';

export default async (to: any, from: any, next: any): Promise<void> => {
  const { accessToken, refreshToken, getProfile, setUser, user } =
    userComposable();

  if (to.meta.requiresAuth) {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      try {
        if (!user.value) await getProfile();

        if (user.value) {
          if (to.meta?.roles && to.meta?.roles?.length > 0) {
            if (to.meta?.roles?.includes(user.value?.role)) next();
            else next({ path: '/dashboard' });
          } else next();
        } else {
          next({
            path: '/signin',
            query: {
              redirect: to.fullPath,
            },
          });
        }
      } catch (error: any) {
        console.log('ERROR: ', error?.response?.data);
        next({
          path: '/signin',
          query: {
            redirect: to.fullPath,
          },
        });
      }
    } else {
      // next({ name: "SignIn" });
      next({
        path: '/signin',
        query: {
          redirect: to.fullPath,
        },
      });
    }
  } else next();
};
