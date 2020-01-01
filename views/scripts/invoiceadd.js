(async () => {
  const token = localStorage.getItem('token');
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
    const customers = await responses[0].json();
    const products = await responses[1].json();

    let dropdown_list = customers.reduce((agg , value) => {
      return agg += `<option value="${value.id}">${value.name}</option>`
    } , '');
    document.getElementById('custname').innerHTML = dropdown_list;

    let formCounter = 0;  /*Count of Number of Invoice Items*/

    document.getElementById('add-item').addEventListener('click' , (e) => {
      e.preventDefault();

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
        <div class="row content my-3 mx-3">
          <div class="col-lg-1">

          </div>
          <div class="col-lg-5">
            <select class="form-in prodname" id="prodname" name="prodname" style="width: 100%" required>

            </select>
          </div>
          <div class="col-lg-5">
            <input class="form-in" type="text" id="qty" name="qty" placeholder="Product Quantity" style="width: 100%" required>
          </div>
        </div>
      </div>`;

      document.getElementById('item-form').insertAdjacentHTML('beforeend', newForm);
      document.querySelectorAll('.del-item').forEach((item) => item.addEventListener('click' , deleteItem));
      document.querySelectorAll('.prodname').forEach((item) => {
        dropdown_list = products.reduce((agg , value) => {
          return agg += `<option value="${value.product_id}">${value.name}</option>`
        } , '');
        item.innerHTML = dropdown_list;
      });
      formCounter++;
    });
  }

  function deleteItem(element)
  {
    element.preventDefault();
    // console.log(this.getAttribute('data-index'));
    let itemForms = Array.from(document.getElementById("item-form").children);
    console.log(itemForms);
    itemForms.find((item) => item.getAttribute('data-index') == this.getAttribute('data-index')).outerHTML = "";
  }
})();

function clearForms() {
  document.getElementById('item-form').reset();
}
