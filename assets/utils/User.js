const User = (() => {
  let instance = null;

  function create(email, displayName, roles, token) {
    const user = {
      email, displayName, roles, token,
    };

    return Object.freeze(user);
  }

  return {
    save: ({
      email, displayName, roles, token,
    }) => {
      sessionStorage.setItem('user', JSON.stringify({ email, displayName, roles }));
      sessionStorage.setItem('token', token);

      instance = create(email, displayName, roles, token);

      return instance;
    },
    get: () => {
      if (instance === null) {
        const userItem = sessionStorage.getItem('user');
        if (userItem === null) {
          return null;
        }
        const { email, displayName, roles } = JSON.parse(userItem);
        const token = sessionStorage.getItem('token');
        instance = create(email, displayName, roles, token);
      }

      return instance;
    },
    getToken: () => sessionStorage.getItem('token'),
    logout: () => {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('token');
      instance = null;
      window.dispatchEvent(new CustomEvent('user-logout'));
    },
  };
})();

export default User;
