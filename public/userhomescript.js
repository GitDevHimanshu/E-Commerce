const parent = document.getElementById("parent-container");
const error = document.getElementById("error");

const limit = document.getElementById('limit');
var limitprod;
limit.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        if (limit.value == 0) {
            limit.value = ''; 
            limit.setAttribute('placeholder', 'Value cannot be zero');
        } else {
            limitprod = limit.value;
            getprod();
        }
    }
});



    async function getprod(){
        let page = document.getElementById('pagenum')
        let pagenum = page.innerText; 
        
        let totalele = parent.children.length;
        console.log(totalele);

        const url = `http://localhost:3000/user/pageinc?page=${pagenum}&limit=${limitprod}&totalelement=${totalele}`;

        const res = await fetch(url, {
            method: "GET"
        });

 
        const data = await res.json();

        if (data.length === 0 || data.error){
            error.innerHTML = "No More Products Available!";
        }
        else{
            error.innerHTML = "";
            page.innerText = pagenum;
            parent.innerHTML = "";
            data.forEach(element => {
            const mdiv = document.createElement("div");
            mdiv.id = element.id;
            mdiv.innerHTML = `<img src = "${element.PHOTO}" alt = "product image"/>
                              <p> ${element.PRODNAME} </p>
                              <button style="background-color: #333333;">View Detail</button>
                              <button style="background-color: #005904;">Add to Cart</button>`;    
            
                              mdiv.children[2].onclick = ()=> {viewDetail(element.id)}; //  we have to make anonamoous function to that element
                              mdiv.children[3].onclick = ()=> {addToCart(element.id)};                                                                                       // because if we write function directly it will run that function
                              
                              parent.appendChild(mdiv);    
        });
        } 
    }
    // increase the page logic

    async function inc(){
        let page = document.getElementById('pagenum')
        let pagenum = page.innerText;
        pagenum ++ ;

        let totalele = parent.children.length;
        const url = `http://localhost:3000/user/pageinc?page=${pagenum}&limit=${limitprod}&totalelement=${totalele}`;

        const res = await fetch(url, {
            method: "GET"
        });

 
        const data = await res.json();

        if (data.length === 0 || data.error){
            error.innerHTML = "No More Products Available!";
        }
        else{
            error.innerHTML = "";
            page.innerText = pagenum;
            parent.innerHTML = "";
            data.forEach(element => {
            const mdiv = document.createElement("div");
            mdiv.id = element.id;
            mdiv.innerHTML = `<img src = "${element.PHOTO}" alt = "product image"/>
                              <p> ${element.PRODNAME} </p>
                              <button style="background-color: #333333;">View Detail</button>
                              <button style="background-color: #005904;">Add to Cart</button>`;    
            
                              mdiv.children[2].onclick = ()=> {viewDetail(element.id)}; //  we have to make anonamoous function to that element
                              mdiv.children[3].onclick = ()=> {addToCart(element.id)};                                                                                       // because if we write function directly it will run that function
                              
                              parent.appendChild(mdiv);    
        });
        }    
    }

    // decrease page logic

    function dec(){
        let page = document.getElementById('pagenum')
        let pagenum = page.innerText;
        
        if( pagenum > 1){
             pagenum -- ;
        }
        
        let totalele = parent.children.length;
        const url = `http://localhost:3000/user/pageinc?page=${pagenum}&limit=${limitprod}&totalelement=${totalele}`;


        fetch(url, {
            method: "GET"
        })
        
        .then(res => res.json())
        .then(data => {
            if (data.length === 0 || data.error){
            error.innerHTML = "No More Products Available!";
            }
            else{
                error.innerHTML = "";
                page.innerText = pagenum;
                parent.innerHTML = "";
                data.forEach(element => {
                const mdiv = document.createElement("div");
                mdiv.id = element.id;
                mdiv.innerHTML = `<img src = "${element.PHOTO}" alt = "product image"/>
                              <p> ${element.PRODNAME} </p>
                              <button style="background-color: #333333;">View Detail</button>
                              <button style="background-color: #005904;">Add to Cart</button>`;    
            
                              mdiv.children[2].onclick = ()=> {viewDetail(element.id)}; //  we have to make anonamoous function to that element
                                                                                        // because if we write function directly it will run that function
                              mdiv.children[3].onclick = ()=> {addToCart(element.id)};
                              

                              parent.appendChild(mdiv);    
                });
            }    
        })      
    }

    // function for loading  more product

    // async function loadmoreprod(){

    //     const moreprod = await fetch("http://localhost:3000/user/loadmoreproduct", {
    //         method : 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify({ number: parent.children.length }),
    //     })

    //     const data = await moreprod.json();
        
    //     if (data.length === 0){
    //         error.innerHTML = "No More Products Available!";
    //     }
    //     else{
    //         data.forEach(element => {
    //         const mdiv = document.createElement("div");
    //         mdiv.id = element.ID;
    //         mdiv.innerHTML = `<img src = "${element.PHOTO}" alt = "product image"/>
    //                           <p> ${element.PRODNAME} </p>
    //                           <button>View Detail</button>
    //                           <button>Add to Cart</button>`;    
            
    //                           mdiv.children[2].onclick = ()=> {viewDetail(element.ID)}; //  we have to make anonamoous function to that element
    //                           // because if we write function directly it will run that function
            
    //                           parent.appendChild(mdiv);    
    //     });
    //     }   
    // }
    // function for view more detail
    async function viewDetail(id) {
        const res = await fetch("http://localhost:3000/user/detail", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productid: id }),
        });

        const data = await res.json();

        const modal = document.createElement("div");
        modal.className = "modal";
    
        const modalContent = document.createElement("div");
        modalContent.className = "modal-content";

        if(res.error){
            modalContent.innerHTML = `<p> ${res.error} </p> `;
        }
        else{
            modalContent.innerHTML = `<img src = "${data.PHOTO}" /> <br> <h3> ${data.PRODNAME} </h3> 
            <p>${data.DESCRIPTION}</p> <p style = "color: red;"> Rs.${data.PRICE} </p>` ;
        }
     
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.style.display = "block";

        modal.onclick = function() {
            modal.style.display = "none";
            parent.removeChild(modal);
        };
    }


    async function addToCart(productid){
    //  console.log(productid);
      const res = await fetch("http://localhost:3000/user/addtocart",{
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id:productid })
        })
    }

