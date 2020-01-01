(async () => {
  const token = localStorage.getItem('token');
  if(token == null)
  {
    document.getElementById('main-body').innerHTML = `<span>
                                                        Please <a href="login" style"color: #D20606;">Login<a> to view Invoices
                                                      </span>`;
  }
  else
  {
    try {
      console.log("requests");
      const fetch_requests = [
                          fetch(`http://localhost:4000/api/customers`, {
                            method: 'GET',
                            headers: {
                              "Content-type": "application/json; charset=UTF-8",
                              "Authorization": `jwt ${token}`
                            }
                          })
                        ];
      const responses = await Promise.all(fetch_requests);
      const customers = await responses[0].json();
      // console.log(invoices);
      // console.log(customers);
      let customer_list = customers.reduce((agg , customer , index) => {
        return agg += `<tr class=${(index % 2) ? "dark-row" : "light-row"}>
                        <td>${customer.name}</td>
                        <td>${customer.address}</td>
                        <td>${customer.phone}</td>
                        <td class="col-sm-2 col-lg-1"><a href=""><div><img src="images/edit.png"></div></a></td>
                      </tr>`
      } , '');
      document.getElementById('customer-list').innerHTML = customer_list;
    }
    catch (e) {
      console.log(e);
    }
  }
})();
