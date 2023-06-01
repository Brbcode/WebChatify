const User = (() => {
  let instance = null;

  function create(id, email, displayName, roles, token) {
    const user = {
      id, email, displayName, roles, token,
    };

    return Object.freeze(user);
  }

  return {
    save: ({
      id, email, displayName, roles, token,
    }) => {
      sessionStorage.setItem('user', JSON.stringify({
        id, email, displayName, roles,
      }));
      sessionStorage.setItem('token', token);

      instance = create(id, email, displayName, roles, token);

      return instance;
    },
    get: () => {
      if (instance === null) {
        const userItem = sessionStorage.getItem('user');
        if (userItem === null) {
          return null;
        }
        const {
          id, email, displayName, roles,
        } = JSON.parse(userItem);
        const token = sessionStorage.getItem('token');
        instance = create(id, email, displayName, roles, token);
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
