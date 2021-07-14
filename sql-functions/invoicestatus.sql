select count(i.id) `Count`,'Paid' `Status`
,(select format(if(isnull(sum(units*unitprice)),0,sum(units*unitprice)),2)
  from invoice,invoiceitem
  where invoice.id=invoiceid
  and status=1) `Amount`
from invoice i
where i.status=1
union
select count(i.id) `Count`,'UnPaid' `Status`
,(select format(if(isnull(sum(units*unitprice)),0,sum(units*unitprice)),2)
  from invoice,invoiceitem
  where invoice.id=invoiceid
  and status=2) `Amount`
from invoice i
where i.status=2
union
select count(i.id) `Count`,'Open' `Status`
,(select format(if(isnull(sum(units*unitprice)),0,sum(units*unitprice)),2)
  from invoice,invoiceitem
  where invoice.id=invoiceid
  and status=3) `Amount`
from invoice i
where i.status=3;
