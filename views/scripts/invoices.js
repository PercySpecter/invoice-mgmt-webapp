(async () => {
  const token = localStorage.getItem('token');
  if(token == null)
  {
    location.replace('login');
  }
})();
