(async () => {
  const token = localStorage.getItem('token');
  let customers , products;
  if(token == null)
  {
    document.getElementById('main-body').innerHTML = `<span>
                                                        Please <a href="login" style"color: #D20606;">Login<a> to Add Invoice
                                                      </span>`;
  }
  else
  {
    const fetch_requests = [
                        fetch(`http://localhost:4000/api/customers`, {
                          method: 'GET',
                          headers: {
                            "Content-type": "application/json; charset=UTF-8",
                            "Authorization": `jwt ${token}`
                          }
                        }),
                        fetch(`http://localhost:4000/api/products`, {
                          method: 'GET',
                          headers: {
                            "Content-type": "application/json; charset=UTF-8",
                            "Authorization": `jwt ${token}`
                          }
                        })
                      ];
    const responses = await Promise.all(fetch_requests);
    customers = await responses[0].json();
    products = await responses[1].json();

    let dropdown_list = customers.reduce((agg , value) => {
      return agg += `<option value="${value.id}">${value.name}</option>`
    } , '');
    document.getElementById('custname').innerHTML = dropdown_list;

    let formCounter = 0;  /*Count of Number of Invoice Items*/

    document.getElementById('add-item').addEventListener('click' , (e) => {
      e.preventDefault();

      dropdown_list = products.reduce((agg , value) => {
        return agg += `<option value="${value.id}">${value.name}</option>`
      } , '');


      const newForm = `<div class="container-fluid pb-3 px-4 bg-white border mb-4" data-index="${formCounter}">
        <div class="row content mt-4 mb-3 mx-3">
          <div class="col-lg-1 my-auto">

          </div>
          <div class="col-lg-5 my-auto">
            Products Name
          </div>
          <div class="col-lg-5 my-auto">
            Quantity
          </div>
          <div class="col-lg-1 my-auto text-right">
            <a href="" class="del-item" data-index="${formCounter}"><img src="images/delete-button.png" alt="Del -"></a>
          </div>
        </div>
        <div class="row content my-3 mx-3 product-field">
          <div class="col-lg-1">

          </div>
          <div class="col-lg-5">
            <select class="form-in prodname" id="prodname" name="prodname" style="width: 100%" required>
              ${dropdown_list}
            </select>
          </div>
          <div class="col-lg-5">
            <input class="form-in qty" type="text" id="qty" name="qty" placeholder="Product Quantity" style="width: 100%" required>
          </div>
        </div>
      </div>`;

      document.getElementById('item-form').insertAdjacentHTML('beforeend', newForm);

      document.querySelectorAll('.del-item').forEach((item) => item.addEventListener('click' , deleteItem));

      document.getElementById('disc').addEventListener('change' , calcTotal);
      document.querySelectorAll('.prodname').forEach((item) => item.addEventListener('change' , calcTotal));
      document.querySelectorAll('.qty').forEach((item) => item.addEventListener('change' , calcTotal));

      formCounter++;
    });
  }

  document.getElementById('submit-invoice').addEventListener('click' , async (e) => {
    let inv_id;
    console.log(customers);
    const customer_id = document.getElementById('custname').value;
    const discount = document.getElementById('disc').value;
    let sel_prods = Array.from(document.getElementsByClassName('product-field'));
    let totalPrice = sel_prods.reduce((total , val) => {
      return total += products.find((prod) => prod.id == val.querySelector('.prodname').value).price
                    * val.querySelector('.qty').value;
    } , 0);
    totalPrice -= totalPrice * 0.01 * document.getElementById('disc').value;

    const base_url = 'http://localhost:4000/api/invoices';
    try {
      let response = await fetch(base_url , {
        method: 'POST',
        body: JSON.stringify({customer_id: customer_id, discount: discount, total: totalPrice}),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": `jwt ${token}`
        }
      });
      const new_invoice = await response.json();
      inv_id = new_invoice.id;
      console.log(new_invoice);
      // location.reload();
    }
    catch (e) {
      console.log(e);
    }

    let itemReqs = [];
    sel_prods.map((val) => {
      invItem = {
                  product_id: val.querySelector('.prodname').value,
                  quantity: val.querySelector('.qty').value
                };
      console.log(invItem);
      itemReqs.push(fetch(`${base_url}/${inv_id}/items` , {
        method: 'POST',
        body: JSON.stringify(invItem),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Authorization": `jwt ${token}`
        }
      }));
    });

    try {
      responses = await Promise.all(itemReqs);

      location.reload();
    }
    catch (e) {
      console.log(e);
    }
  });

  function deleteItem(element)
  {
    element.preventDefault();
    // console.log(this.getAttribute('data-index'));
    let itemForms = Array.from(document.getElementById("item-form").children);
    console.log(itemForms);
    itemForms.find((item) => item.getAttribute('data-index') == this.getAttribute('data-index')).outerHTML = "";
    calcTotal();
  }

  function calcTotal(element)
  {
    let sel_prods = Array.from(document.getElementsByClassName('product-field'));
    let totalPrice = sel_prods.reduce((total , val) => {
      return total += products.find((prod) => prod.id == val.querySelector('.prodname').value).price
                    * (+val.querySelector('.qty').value);
    } , 0);
    totalPrice -= totalPrice * 0.01 * document.getElementById('disc').value;
    document.getElementById('total').innerHTML = totalPrice.toFixed(2);
  }
})();

function clearForms() {
  document.getElementById('item-form').reset();
}
