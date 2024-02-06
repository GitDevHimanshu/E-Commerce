
const prodparentdiv = document.getElementById("mid");

// moving right in admin product dashboard

async function moveright(){
    let offsetinput = document.getElementById("offset");
    let offset = offsetinput.innerHTML;
    let middiv = document.getElementById('mid');

    offset ++;

    const res = await fetch("http://localhost:3000/admin/moveright?offset="+offset,{
        method:"GET",
    })

    const data = await res.json();
    
    if(data.product.length !== 0 ){
        offsetinput.innerHTML ++;
        middiv.innerHTML = "";
    
        data.product.forEach(element => {
        middiv.innerHTML += generatediv(element);

    });
    } else {
       console.log(" no more products "); 
    }   
}


// moving left in admin product dashboard

async function moveleft(){
    let offsetinput = document.getElementById("offset");
    let offset = offsetinput.innerHTML;
    let middiv = document.getElementById('mid');

    if( offset > 1 ){
        offset --;
    }

    const res = await fetch("http://localhost:3000/admin/moveleft?offset="+offset, {
        method : "GET",
    })

    const data = await res.json();
    if(data.product.length !== 0){
        offsetinput.innerHTML --;
        middiv.innerHTML = '';

        data.product.forEach(element => {
            middiv.innerHTML += generatediv(element);
        });
        
    } else {
        console.log("limit Reached");
    }
}

// generating component for product 

function generatediv(element){
    const component =  `
    <div class="prodframe" id="${element.ID}">
        <div id="img">
            <img src="${element.PHOTO}"/>
        </div>
        <div id="actions">
            <div id="detail">
                <span>
                    <label>Product Name</label>
                    <input type="text" value="${element.PRODNAME}" readonly/><br>
                </span>
                <span>
                    <label>Product Desc</label>
                    <input type="number" value="${element.PRICE}" readonly/><br>
                </span>
                <span>
                    <label>Product Qty</label>
                    <input type="number" value="${element.QUANTITY}" readonly />
                    <!-- quantity include here  -->
                </span>
            </div>
            <div id="update_delete">
                <button onclick="deleteprod(${element.ID})" id="reject">Reject</button>
                <button onclick="approve(${ element.ID })" id = "approve">approve</button>
            </div>
        </div>
    </div>`;

    return component;
}

async function approve(id){
    const div = document.getElementById(id);
    let offsetinput = document.getElementById("offset");
    let offsetvalue = offsetinput.innerHTML;
    // const detail = div.children[1].children[0];
    // const name = detail.children[0].children[1].value;
    // const price = detail.children[1].children[1].value;
    // const quantity = detail.children[2].children[1].value;

    const res = await fetch("http://localhost:3000/admin/approve",{
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({offset: offsetvalue, id: id })
    })

    const data = await res.json();
    if(data.product.length !== 0){
        const parentdiv = document.getElementById('mid');
        parentdiv.innerHTML = '';

        data.product.forEach(element => {
            parentdiv.innerHTML += generatediv(element);
        });
    } else {
        const parentdiv = document.getElementById('mid');
        parentdiv.innerHTML = '';
    }
}

async function deleteprod(id) {
    const div = document.getElementById(id);
    let offsetinput = document.getElementById("offset");
    let offsetvalue = offsetinput.innerHTML;

    const res = await fetch('http://localhost:3000/admin/delete?id=',{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { offset: offsetvalue, id: id })
    }) 
    
    
    const data = await res.json();
    if(data.product.length !== 0){
        const parentdiv = document.getElementById("mid");
        parentdiv.innerHTML = '';

        data.product.forEach(element => {
            parentdiv.innerHTML += generatediv(element);
        });
    } else {
        console.log("limit Reached");
    }  
}


function addproduct(){
    
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const image = document.getElementById("image").files[0];
    const quantity = document.getElementById("quantity").value;
    
    // console.log(image.size);
    
    if(image.size >= 256000){
        const error = document.getElementById("error")
        error.innerHTML = "File size Exceeds";
    }

    const formdata = new FormData();
    
    formdata.append("name", name);
    formdata.append("description", description);
    formdata.append("price", price);
    formdata.append("image", image);
    formdata.append("quantity", quantity);
    
    fetch('http://localhost:3000/admin/addproduct',{
        method: 'POST',
        body: formdata,
    })
    .then((data) => data.json())
    .then((data) => {
        error.innerHTML = data;
    })
}







