(async () => {
  const token = localStorage.getItem('token');
  if(token == null)
  {
    document.getElementById('main-body').innerHTML = `<span>
                                                        Please <a href="login" style"color: #D20606;">Login<a> to view Products
                                                      </span>`;
  }
  else
  {
    try {
      console.log("requests");
      const fetch_requests = [
                          fetch(`http://localhost:4000/api/products`, {
                            method: 'GET',
                            headers: {
                              "Content-type": "application/json; charset=UTF-8",
                              "Authorization": `jwt ${token}`
                            }
                          })
                        ];
      const responses = await Promise.all(fetch_requests);
      const products = await responses[0].json();
      // console.log(invoices);
      // console.log(customers);
      let product_list = products.reduce((agg , product , index) => {
        return agg += `<tr class=${(index % 2) ? "dark-row" : "light-row"}>
                        <td>${product.name}</td>
                        <td>${product.price}</td>
                        <td class="col-lg-1 pl-3 pl-lg-5"><a href=""><img src="images/edit.png"></a></td>
                      </tr>`
      } , '');
      document.getElementById('product-list').innerHTML = product_list;
    }
    catch (e) {
      console.log(e);
    }
  }
})();
