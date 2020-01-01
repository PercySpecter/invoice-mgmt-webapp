(async () => {
  document.getElementById('login-form').addEventListener('submit' , async (e) => {
    e.preventDefault();
    const credentials = {uname: document.forms['login-form']['uname'].value , pass: document.forms['login-form']['pass'].value};
    const url = 'http://localhost:4000/auth';
    console.log(credentials);
    if(uname.length < 4 || pass.length < 8)
    {
      document.getElementById('msg').innerHTML = '<span class="text-danger">Invalid Username or Password<span>';
      document.querySelector('#pass').value = '';
    }
    else
    {
      try {
        let response = await fetch(url , {
          method: 'POST',
          body: JSON.stringify(credentials),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        });
        const token = await response.json();
        console.log(token);
        if(token.token.length > 0)
        {
          localStorage.setItem("token" , token.token);
          document.getElementById('msg').innerHTML = '<span class="text-success">Logged In<span>';
          document.querySelector('#pass').value = '';
          location.replace('invoices');
        }
        else
        {
          document.getElementById('msg').innerHTML = '<span class="text-danger">Invalid Username or Password<span>';
          document.querySelector('#pass').value = '';
        }
      }
      catch (e) {
        console.log(e);
      }
    }
  });
})();

function clearForms() {
  document.getElementById('login-form').reset();
}
