(async () => {
  const token = localStorage.getItem('token');
  if(token == null)
  {
    document.getElementById('main-body').innerHTML = `<span>
                                                        Please <a href="login" style"color: #D20606;">Login<a> to Add Customer
                                                      </span>`;
  }

  else
  {
    document.getElementById('customer-form').addEventListener('submit' , async (e) => {
      e.preventDefault();
      const customer = {
                        name: document.forms['customer-form']['custname'].value,
                        address: document.forms['customer-form']['addr'].value,
                        phone: document.forms['customer-form']['phone'].value
                      };
      if(isNaN(customer.phone))
      {
        document.querySelector('#phone').value = '';
        document.getElementById('msg').innerHTML = `<span class="text-danger">
                                                            Please enter a valid Phone Number
                                                          </span>`;
        return;
      }
      const url = 'http://localhost:4000/api/customers';
      console.log(customer);
      try {
        let response = await fetch(url , {
          method: 'POST',
          body: JSON.stringify(customer),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `jwt ${token}`
          }
        });
        const new_customer = await response.json();
        console.log(new_customer);
        document.getElementById('msg').innerHTML = `<span class="text-success">Customer added. Customer ID: ${new_customer.id}<span>`;
        clearForms();
      }
      catch (e) {
        console.log(e);
      }
    });
  }
})();

function clearForms() {
  document.getElementById('customer-form').reset();
}
