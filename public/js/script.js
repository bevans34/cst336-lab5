console.log("local js loaded");

// Event listeners
let authorLinks = document.querySelectorAll("a");
for (authorLink of authorLinks) {
    authorLink.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo() {
    const myModal = new bootstrap.Modal(document.getElementById('authorModal'));
    myModal.show();

    let url = `/api/author/${this.id}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    let authorInfo = document.querySelector("#authorInfo");
    authorInfo.innerHTML = `<h1> ${data[0].firstName}
                                  ${data[0].lastName} </h1>`;

    authorInfo.innerHTML += `Date of Birth: ${data[0].dob}
    <br>Date of Death: ${data[0].dod}
    <br>Gender: ${data[0].sex}
    <br>Profession: ${data[0].profession}
    <br>Country: ${data[0].country}
    <br>Biography: ${data[0].biography}
    <br><img src="${data[0].portrait}" width="200">
    `;
}