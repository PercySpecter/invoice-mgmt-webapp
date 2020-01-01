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
                          fetch(`http://localhost:4000/api/invoices`, {
                            method: 'GET',
                            headers: {
                              "Content-type": "application/json; charset=UTF-8",
                              "Authorization": `jwt ${token}`
                            }
                          }),
                          fetch(`http://localhost:4000/api/customers`, {
                            method: 'GET',
                            headers: {
                              "Content-type": "application/json; charset=UTF-8",
                              "Authorization": `jwt ${token}`
                            }
                          })
                        ];
      const responses = await Promise.all(fetch_requests);
      let invoices = await responses[0].json();
      const customers = await responses[1].json();
      // console.log(invoices);
      // console.log(customers);
      let invoice_list = invoices.reduce((agg , invoice , index) => {
        return agg += `<tr class=${(index % 2) ? "dark-row" : "light-row"}>
                        <td>${index+1}</td>
                        <td>${customers.find((customer) => customer.id == invoice.customer_id).name}</td>
                        <td>${invoice.discount}%</td>
                        <td>${invoice.total}</td>
                      </tr>`
      } , '');
      document.getElementById('invoice-list').innerHTML = invoice_list;
    }
    catch (e) {
      console.log(e);
    }
  }
})();
