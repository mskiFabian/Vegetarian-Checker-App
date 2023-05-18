const btn = document.querySelector("button")
btn.addEventListener("click", getFetch)


function getFetch() {
    let inputVal = document.querySelector('#barcode').value

    if(inputVal.length !== 12) {
        alert("Please ensure that barcode is 12 characters")
        return
    }
    const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.status === 1) {
                const item = new ProductInfo(data.product)
                item.showInfo()
                item.listIngredients()
            } else if(data.status === 0) {
                alert(`Product ${inputVal} not found. Please try another.`)
            }
        })
        .catch(err => {
            console.log(`error ${err}`)
        })
}

class ProductInfo {
    // All info is in data.product 
    constructor(productData) {
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.image = productData.image_url
    }
    showInfo() {
        document.querySelector(".product-img").src = this.image
        document.querySelector(".product-name").innerHTML = this.name
    }
    listIngredients() {
        let tableRef = document.querySelector(".ingredient-table")

        // clear previous table(skip 1st row)
        for(let i = 1; i < tableRef.rows.length;) tableRef.deleteRow(i) // The index of deleting is always 1 so dont need here i++ :0
        
        if(!(this.ingredients == null)) {
            for(let key in this.ingredients) {
                let newRow = tableRef.insertRow(-1) // putting on the end
                let newICell = newRow.insertCell(0)
                let newVCell = newRow.insertCell(1)
                // putting content as text
                let newIText = document.createTextNode(this.ingredients[key].text) // text is the name of current ingredient
                
                //adding unknown with falsy vege status
                let isVeg = !(this.ingredients[key].vegetarian)  ? "unknown" : this.ingredients[key].vegetarian
    
                // show vege status
                let newVText = document.createTextNode(isVeg)
    
                newICell.appendChild(newIText)
                newVCell.appendChild(newVText)


                //adding background-color to 'no'(red),  'unknwon' and 'maybe'(yellow)
                if(isVeg === 'no') {
                    newVCell.classList.add('not-vege')
                } else if(isVeg === 'unknown' || isVeg === 'maybe') {
                    newVCell.classList.add('unknown-maybe')
                }
            }            
        }
    }
}
