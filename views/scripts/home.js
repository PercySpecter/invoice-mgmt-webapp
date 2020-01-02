(() => {
  if(localStorage.getItem('token') == null)
  {
    location.replace('login');
  }
  else
  {
    location.replace('invoices');
  }
})();
