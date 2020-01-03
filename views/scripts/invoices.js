let invItems = [];
let customers, invoices, products;

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
      let fetch_requests = [
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
                          }),
                          fetch(`http://localhost:4000/api/products`, {
                            method: 'GET',
                            headers: {
                              "Content-type": "application/json; charset=UTF-8",
                              "Authorization": `jwt ${token}`
                            }
                          })
                        ];
      let responses = await Promise.all(fetch_requests);
      invoices = await responses[0].json();
      customers = await responses[1].json();
      products = await responses[2].json();

      fetch_requests = [];
      invoices.map((value) => {
        fetch_requests.push(fetch(`http://localhost:4000/api/invoices/${value.id}/items`, {
                              method: 'GET',
                              headers: {
                                "Content-type": "application/json; charset=UTF-8",
                                "Authorization": `jwt ${token}`
                              }
                            })
                          );
      });

      responses = await Promise.all(fetch_requests);

      responses.map(async (value) => {
        let item = await value.json();
        invItems.push(item);
      });

      // console.log(invoices);
      // console.log(customers);
      let invoice_list = invoices.reduce((agg , invoice , index) => {
        return agg += `<tr class="${(index % 2) ? "dark-row" : "light-row"}" onclick="printInvoice(${invoice.id})">
                        <td>${index+1}</td>
                        <td>${customers.find((customer) => customer.id == invoice.customer_id).name}</td>
                        <td>${invoice.discount}%</td>
                        <td>${invoice.total}</td>
                        <td class="inv-link col-lg-1 pl-3 pl-lg-5"><i class="fa fa-print"></i></td>
                      </tr>`
      } , '');
      document.getElementById('invoice-list').innerHTML = invoice_list;
    }
    catch (e) {
      console.log(e);
    }
  }

})();

function printInvoice(inv_id)
{
  let itemList = invItems.find((val) => {
    if(val[0] == null)
      return false;
    return (val[0].invoice_id === inv_id);
  });
  console.log(itemList);


  let inv = invoices.find((val) => val.id === inv_id);
  let invItemList = [[ {text: 'Product Name', bold: true}, {text: 'Quantity', bold: true}, {text: 'Sub Total', bold: true} ]];
  let subtotal = itemList.reduce((s , item) => {
    let prod = products.find((val) => val.id == item.product_id);
    invItemList.push([prod.name , item.quantity , (prod.price * item.quantity).toFixed(2)]);
    return s += prod.price * item.quantity;
  } , 0);
  let discAmt = subtotal * inv.discount * 0.01;
  console.log(invItemList);
  let docDefinition = {
    content: [
      `Invoice Number: ${inv._id}`,
      `Customer Name: ${customers.find((val) => val.id == inv.customer_id).name}`,
      {
        table: {
          headerRows: 1,
          widths: [ 300 , 100 , 100 ],
          body: invItemList
        }
      },
      `Gross Total: ${subtotal.toFixed(2)}`,
      `Discount (@${inv.discount}%): ${discAmt.toFixed(2)}`,
      `Net Total: ${inv.total.toFixed(2)}`
    ]
  };

  pdfMake.createPdf(docDefinition).open();

}
