

const parent = document.getElementById("parent-container");
const error = document.getElementById("error");


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

function tologin(){
    window.location.href = "/login"
}


