(async () => {
  const token = localStorage.getItem('token');
  if(token == null)
  {
    document.getElementById('main-body').innerHTML = `<span>
                                                        Please <a href="login" style"color: #D20606;">Login<a> to Add Product
                                                      </span>`;
  }

  else
  {
    document.getElementById('product-form').addEventListener('submit' , async (e) => {
      e.preventDefault();
      const product = {name: document.forms['product-form']['prodname'].value , price: document.forms['product-form']['price'].value};
      if(isNaN(product.price))
      {
        document.querySelector('#price').value = '';
        document.getElementById('msg').innerHTML = `<span class="text-danger">
                                                            Please enter a valid Price
                                                          </span>`;
        return;
      }
      const url = 'http://localhost:4000/api/products';
      console.log(product);
      try {
        let response = await fetch(url , {
          method: 'POST',
          body: JSON.stringify(product),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Authorization": `jwt ${token}`
          }
        });
        const new_product = await response.json();
        console.log(new_product);
        document.getElementById('msg').innerHTML = `<span class="text-success">Product added. Product ID: ${new_product.id}<span>`;
        clearForms();
      }
      catch (e) {
        console.log(e);
      }
    });
  }
})();

function clearForms() {
  document.getElementById('product-form').reset();
}
