const parent = document.getElementById("parent_div");
const payment = document.getElementById("payment");
if(parent.children.length > 0){
    payment.style.pointerEvents = "auto";
}

    // to delete the item from the cart
    async function remove(id) {
        let divtodel = document.getElementsByClassName(id);
        let total = document.getElementById("total_bill");
        
        const res = await fetch("http://localhost:3000/cart/removefromcart",{
            method: "DELETE",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { cartid: id } )
        })

        const data = await res.json();
        
        if(data.delete){
           divtodel[0].remove();
           let trtodel = document.getElementsByClassName(id);
           let TOT = parseFloat(total.innerHTML) - parseFloat(trtodel[0].children[3].innerHTML)
           TOT = TOT.toFixed(2);
           total.innerHTML=TOT;
           trtodel[0].remove();
        }
        else{
            alert("Error deleting the item");
        }     
    }


    async function increase(id, prodid){
        
        const obj = {
            cartid: id,
            pid: prodid
        }
        
        console.log(prodid);
        console.log(obj);

        const res = await fetch("http://localhost:3000/cart/increaseqty",{
            method:"PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( obj )
        })

        const data = await res.json();

        if(data.increased){
            const rowtochange = document.getElementsByClassName(id);
            const billamt = document.getElementById("total_bill");
            
            let current = rowtochange[1].children[3].innerHTML;
            let bill = billamt.innerHTML - current;
            
            const label = rowtochange[0].children[1].children[3];
            rowtochange[1].children[1].innerHTML++;
            rowtochange[1].children[3].innerHTML = (parseFloat(rowtochange[1].children[1].innerHTML) * parseFloat(rowtochange[1].children[2].innerHTML)).toFixed(2);
            label.innerHTML = parseInt(label.innerHTML) + 1
            
            bill = parseFloat(bill) + parseFloat(rowtochange[1].children[3].innerHTML);
            billamt.innerHTML = bill.toFixed(2);
        }  
    }

    async function decrease(id){
        const res = await fetch("http://localhost:3000/cart/decreaseqty",{
            method:"PATCH",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify( { cartid: id } )
        })
        const data = await res.json();
       
        if(data.decreased){
            const rowtochange = document.getElementsByClassName(id);
            const billamt = document.getElementById("total_bill");

            let current = rowtochange[1].children[3].innerHTML;
            let bill = billamt.innerHTML - current;

            const label = rowtochange[0].children[1].children[3];
            rowtochange[1].children[1].innerHTML--;
            rowtochange[1].children[3].innerHTML = (parseFloat(rowtochange[1].children[1].innerHTML) * parseFloat(rowtochange[1].children[2].innerHTML)).toFixed(2);
            label.innerHTML = parseInt(label.innerHTML) - 1;

            bill = parseFloat(bill) + parseFloat(rowtochange[1].children[3].innerHTML);
            billamt.innerHTML = bill.toFixed(2);
        }
        
    }

        // async function payment(){
            
        //     const res = await fetch('http://localhost:3000/cart/payment', {
        //     method: "GET",  
        //     })

        //     if(res.redirected){
        //         console.log(res.url);
        //     }
        //     // const data = await res.json();
        // }










        // async function checkout(){
            
        //      const res = await  fetch("http://localhost:3000/cart/checkout",{
        //         method:'POST',
        //      }) 
             
             

        // }