// Método get
async function getApiData(url) {
    const response = await fetch(url);
    return response.json();
};

// Configurando as abas de navegação (tabs)
const tabs = document.querySelectorAll(".wraps ul li");
const category = document.querySelectorAll(".category");
const product = document.querySelectorAll(".product");
const allTabs = document.querySelectorAll(".item-wrap");
const listCategories = document.querySelector("select");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        tab.classList.add("active");
        const valTab = tab.getAttribute("data-tabs");

        allTabs.forEach((item) => {
            item.style.display = "none";
        })

        if (valTab == "category") {
            category.forEach((item) => {
                item.style.display = "block";
            })
        }
        else {
            product.forEach((item) => {
                item.style.display = "block";
            })

            // Carrega as categories
            getApiData("http://localhost:3000/categories").then((categories) => {
                const optionListCategories = document.querySelectorAll("option");
                if (optionListCategories.length > 0) {
                    optionListCategories.forEach((option) => {
                        listCategories.removeChild(option);
                    })
                }
                
                // Lista as categorias cadastradas na API 
                categories.forEach((category) => {
                    let categoryOption = document.createElement("option");
                    categoryOption.setAttribute('value', category["name"]);

                    let categorySelected = document.createTextNode(category["name"]);
                    categoryOption.appendChild(categorySelected);

                    listCategories.appendChild(categoryOption);
                })
            })
        }
    })
});


// Botão cadastrar categorias
document.getElementById("sendCategory").addEventListener("click", () => {

    const categoryName = document.getElementById("categoryName");
    const categoryIcon = document.getElementById("categoryIcon")

    const data = {
        name: categoryName.value,
        icon: categoryIcon.value
    };

    fetch("http://localhost:3000/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then((data) => {
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
        })

    categoryName.value = "";
    categoryIcon.value = "";

});


// Botão cadastrar produto
document.getElementById("sendProduct").addEventListener("click", () => {

    const inputProductName = document.getElementById("productName");
    const inputProductDescription = document.getElementById("productDescription");
    const inputProductImage = document.getElementById("productImage");
    const inputProductPrice = document.getElementById("productPrice");
    const selectProductCategory = document.getElementById("productCategory");

    const productNameCategory= selectProductCategory.value;

    getApiData("http://localhost:3000/categories").then((categories) => {

        categories.forEach((category) => {

            if (category["name"] === productNameCategory) {

                const idProductCategory = category["_id"];
                const productName = inputProductName.value;
                const productDescription = inputProductDescription.value;
                const productImage = inputProductImage.files[0];
                const productPrice = Number(inputProductPrice.value);

                const formData = new FormData();

                formData.append("name", productName);
                formData.append("description", productDescription);
                formData.append("image", productImage);
                formData.append("price", productPrice);
                formData.append("category", idProductCategory);

                fetch("http://localhost:3000/products", {
                    method: "POST",
                    body: formData
                })
                    .then(response => response.json())
                    .then((data) => {
                        console.log(data)
                    })
                    .catch((error) => {
                        console.log(error)
                    })

                inputProductName.value = "";
                inputProductDescription.value = "";
                inputProductImage.value = "";
                inputProductPrice.value = "";
            }
        })
    })
});