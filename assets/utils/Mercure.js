const Mercure = (() => {
  const baseUrl = 'http://localhost:3000/.well-known/mercure';

  return ({
    createSubscriber: (topic) => {
      const url = new URL(baseUrl);
      url.searchParams.append('topic', topic);

      return new EventSource(url);
    },
  });
})();

export default Mercure;
