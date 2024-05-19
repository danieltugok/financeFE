import { userComposable } from 'src/composables/userComposable';

export default async (to: any, from: any, next: any) => {
  const { accessToken, refreshToken, getProfile, setUser, user } =
    userComposable();

  if (to.meta.requiresAuth) {
    console.log('to.meta.requiresAuth: ', to.meta.requiresAuth);
    const access_token = localStorage.getItem('access_token');
    console.log('🚀 ~ access_token:', access_token);
    if (access_token) {
      try {
        await getProfile();
        console.log('🚀 ~ user.value:', user.value);
        if (user.value) next();
        else {
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
