console.log('connected to app.js')
const url = "http://te-recipe-app.herokuapp.com/recipes"
const shoppingUrl = "http://te-recipe-app.herokuapp.com/shopping"

//global var for saving or adding
let isEdit = true

//Display all todos
const showRecipes = document.querySelector(".recipes")
const retrieveAll = async () => {
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            organizeInfo(data)
    })
}


const recipeWrapper = document.querySelector('.recipes')

// Organize the todos by category
const organizeInfo = (data) => {
    recipeWrapper.innerHTML = ''
    data.forEach(recipe => {
        let recipeDiv = document.createElement('div')
        recipeDiv.classList.add("recipe-card")
        recipeDiv.id = `card$${recipe._id}`

        let ratingHtml = ``
        switch (recipe.rating) {
            case 1:
                ratingHtml = `<span class="fa fa-star checked"></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>`
                break;
            case 2:
                ratingHtml = `<span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>`
                break;
            case 3:
                ratingHtml = `<span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star"></span>`
                break;
            case 4:
                ratingHtml = `<span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>
                <span class="fa fa-star checked"></span>`
                break;
            default:
                ratingHtml = `<span class="fa fa-star"></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>`
        }


        console.log('here is recipe ingredients = ', recipe.ingredients)
        


        recipeDiv.innerHTML = `
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/203277/oatmeal.jpg" alt="Chai Oatmeal" />
        <div class="card-bottom">
            <h2>${recipe.name}</h2>
            <h3>${recipe.category}</h3>
            ${ratingHtml}
            <br><br>
            <h5>Ingredients</h5>
            <p class="ingredients">${recipe.ingredients.join(', ')}</p>
            <h5>Directions</h5>
            <p class="directions">${recipe.directions.join(', ')}</p>
        </div>

        `
        let trashIcon = document.createElement('i')
        trashIcon.classList.add('fa', 'fa-trash', 'trash', `${recipe._id}$trash`)

        let editIcon = document.createElement('i')
        editIcon.classList.add('fa', 'fa-edit', 'edit', `${recipe._id}$edit`)
        editIcon.setAttribute("data-toggle", "modal")
        editIcon.setAttribute("data-target", "#exampleModalCenter")

        recipeDiv.appendChild(trashIcon)
        recipeDiv.appendChild(editIcon)

        trashIcon.addEventListener('click', () => deleteRecipe(recipe._id))
        editIcon.addEventListener('click', () => editRecipe(recipe._id))

        recipeWrapper.appendChild(recipeDiv)
    })



}

//Search Button, Input, alert
let searchBtn = document.querySelector('#searchBtn').addEventListener('click', () => {
    searchBtn_click()
})
let clearBtn = document.querySelector('#clearBtn').addEventListener('click', () => {
    clearBtn_click()
})

let searchInput = document.querySelector('#searchInput')

let alertBox = document.querySelector('#alert')
alertBox.style.display = "none"

let recipeAlert = document.querySelector('#recipeAlert')
recipeAlert.style.display = "none"

searchInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        document.querySelector("#searchBtn").click()
    }
})

const searchBtn_click = async() => {
    await fetch(url)
    .then(response => response.json())
    .then(data => {
        let filtered = data.filter(rec => {
            let cat = rec.category.toLowerCase()
            let search = searchInput.value.toLowerCase()
            return cat == search
        })
        if(filtered.length > 0){
            organizeInfo(filtered)
        }else {
            alertBox.style.display = 'block'

            setTimeout(() => {
                alertBox.style.display = 'none'
            }, 5000)
        }
        
    })
}

const clearBtn_click = () => {
    searchInput.value = ""
    retrieveAll()
}



//Modal
//Text Fields
let nameField = document.querySelector('#nameField')
let descriptionField = document.querySelector('#descriptionField')
let categoryField = document.querySelector('#categoryField')

//Rating Stars
let rate = document.getElementsByName('rate')

//Buttons
let ingredientBtn = document.querySelector('#ingredientBtn').addEventListener('click', () => addIngredient())
let directionBtn = document.querySelector('#directionBtn').addEventListener('click', () => addDirection())

let addNewRecipeBtn = document.querySelector('#addNewRecipeBtn').addEventListener('click', () => newRecipeBtn_click())
//Lists
let ingredientList = document.querySelector('.ingredientList')
let directionList = document.querySelector('.directionList')
//Inputs
let ingredientInput = document.querySelector('#ingredientInput')
let directionInput = document.querySelector('#directionInput')
//Submit Button
let saveModal = document.querySelector('#saveModal').addEventListener('click', () => { saveIngredient() })
//Array
let ingredientArr = []
let directionArr = []

let newRecipeBtn_click = () => {
    isEdit = false
    console.log('isEdit on add btn click', isEdit)

    nameField.value = ""
    descriptionField.value = ""
    categoryField.value = ""
    ingredientList.innerHTML = ""
    directionList.innerHTML = ""
    ingredientInput.value = ""
    directionInput.value = ""

}

const addIngredient = () => {
    let addLi = document.createElement('li')
    let addTextBox = document.createElement('input')
    addTextBox.setAttribute("type", "text");
    addTextBox.value = ingredientInput.value

    addLi.appendChild(addTextBox)


    let i = document.createElement('i')
    i.classList.add('fa', 'fa-times-circle', 'delIcon')

    ingredientList.appendChild(addLi)
    addLi.appendChild(i)
    ingredientArr.push(ingredientInput.value)
}

const addDirection = () => {
    let addLi = document.createElement('li')
    let addTextBox = document.createElement('input')
    addTextBox.setAttribute("type", "text");
    addTextBox.value = directionInput.value

    addLi.appendChild(addTextBox)
    let i = document.createElement('i')
    i.classList.add('fa', 'fa-times-circle', 'delIcon')

    directionList.appendChild(addLi)
    addLi.appendChild(i)
    directionArr.push(directionInput.value)
}

//Save Ingredient from Modal
const saveIngredient = async() => {
    let ratingNum
    for (let i = 0, length = rate.length; i < length; i++) {
        if (rate[i].checked) {
            ratingNum = Number(rate[i].value)
            break;
        }
    }
    console.log(ratingNum)
    switch (ratingNum) {
        case 1:
            ratingNum = 4
            break;
        case 2:
            ratingNum = 3
            break;
        case 3:
            ratingNum = 2
            break;
        case 4:
            ratingNum = 1
            break;
        default:
            console.log('inside default')
            ratingNum = 1
    }



    if(isEdit){
        let ingArr = []
        let dirArr = []

        let ingChildren = document.querySelector('.ingredientList')
        ingChildren.childNodes.forEach(node => {
            console.log(node.firstElementChild.value)
            ingArr.push(node.firstElementChild.value)
        })

        let dirChildren = document.querySelector('.directionList')
        dirChildren.childNodes.forEach(node => {
            dirArr.push(node.firstElementChild.value)
        })

        console.log(ingArr)
        console.log(dirArr)
    

        let editedRecipe = {
            name: nameField.value,
            description: descriptionField.value,
            category: categoryField.value,
            rating: ratingNum,
            ingredients: ingArr,
            directions: dirArr
        }

        let localId = localStorage.getItem('globalId')
        let postUrl = `${url}/${localId}`
        const rawResponse = await fetch(postUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedRecipe)
        });
        const content = await rawResponse.json();
    
        console.log(content)
        if (content) {
            ingredientArr = []
            directionArr = []
            retrieveAll()
            recipeAlert.style.display = "block"
            setTimeout(function(){ recipeAlert.style.display = "none" }, 3000);
        }
    }else {
        let newRecipe = {
            name: nameField.value,
            description: descriptionField.value,
            category: categoryField.value,
            rating: ratingNum,
            ingredients: ingredientArr,
            directions: directionArr
        }

        const rawResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRecipe)
        });
        const content = await rawResponse.json();
    
        console.log(content)
        if (content) {
            retrieveAll()
            recipeAlert.style.display = "block"
            setTimeout(function(){ recipeAlert.style.display = "none" }, 3000);
        }
    }


}

//Delete Recipe
const deleteRecipe = async(id) => {

    await fetch(`${url}/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    retrieveAll()

}

//Edit Recipe
const editRecipe = async(id) => {
    let editedRecipe
    
    isEdit = true
    localStorage.setItem('globalId', id);
    
    await fetch(`${url}/${id}`)
    .then(response => response.json())
    .then(data => {
        editedRecipe = data
        
    })

    editIngredientArr = []
    editDirectionArr = []
    nameField.value = editedRecipe.name
    descriptionField.value = editedRecipe.description
    categoryField.value = editedRecipe.category

    let ratingNum
    switch (editedRecipe.rating) {
        case 1:
            ratingNum = 4
            break;
        case 2:
            ratingNum = 3
            break;
        case 3:
            ratingNum = 2
            break;
        case 4:
            ratingNum = 1
            break;
        default:
            console.log('inside default')
            ratingNum = 1
    }

    radioBtn = document.querySelector(`#star${ratingNum}`)
    radioBtn.checked = true;

    ingredientList.innerHTML = ''
    reRenderIngredients(id, editedRecipe.ingredients)

    directionList.innerHTML = ''
    reRenderDirections(id, editedRecipe.directions)
    

}

const reRenderDirections = (id, data) => {
    directionList.innerHTML = ""
    
    data.forEach((rec, index) => {
        let addLi = document.createElement('li')

        let addTextBox = document.createElement('input')
        addTextBox.setAttribute("type", "text");
        addTextBox.value = rec

        addLi.appendChild(addTextBox)
        let i = document.createElement('i')
        i.classList.add('fa', 'fa-times-circle', 'delIcon')
        i.id = `ingDel@${index}`
        i.addEventListener('click', () => {
            removeDirection(index, id, data)
        })
        //addLi.innerText = rec
        directionList.appendChild(addLi)
        addLi.appendChild(i)
        //editDirectionArr.push(rec)
    })

}

const removeDirection = async(index, id, dirArr) => {
    dirArr.splice(index, 1)

    reRenderDirections(id, dirArr)
    
}


const reRenderIngredients = (id, data) => {
    ingredientList.innerHTML = ""


    data.forEach((rec, index) => {
        let addLi = document.createElement('li')
        let addTextBox = document.createElement('input')
        addTextBox.setAttribute("type", "text");
        addTextBox.value = rec

        addLi.appendChild(addTextBox)
        let i = document.createElement('i')
        i.classList.add('fa', 'fa-times-circle', 'delIcon')
        i.id = `ingDel@${index}`
        i.addEventListener('click', () => {
            removeIngredient(index, id, data)
        })
        //addLi.innerText = rec
        ingredientList.appendChild(addLi)
        addLi.appendChild(i)
        
        //editIngredientArr.push(rec)
    })

}

const removeIngredient = async(index, id, ingArr) => {
    ingArr.splice(index, 1)

    reRenderIngredients(id, ingArr)
}


//Draggable Div
let target = document.getElementById('shoppingList')

function onDrag(e) {
    let originalStyles = window.getComputedStyle(target)
    target.style.left = parseInt(originalStyles.left) + e.movementX + 'px'
    target.style.top = parseInt(originalStyles.top) + e.movementY + 'px'
}

function onLetGo() {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', onLetGo)
}

function onGrab() {
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', onLetGo)
}

target.addEventListener('mousedown', onGrab)

//Toggle Shopping List
let shoppingList = document.querySelector('#shoppingList')
shoppingList.style.display = "none"
let shoppingListBtn = document.querySelector('#shoppingListBtn').addEventListener('click', () => {
    toggleShoppingList()
})

const toggleShoppingList = () => {
    if (shoppingList.style.display === "none") {
        shoppingList.style.display = "block";
        
    } else {
        shoppingList.style.display = "none";
    }
    
}


//Display all shopping items
const retrieveAllShopping = async () => {
    await fetch(shoppingUrl)
        .then(response => response.json())
        .then(data => {
            showShoppingList(data)
    })
}



const  shoppingItems = document.querySelector('#shoppingItems')
const showShoppingList = (data) => {
    data.forEach(item => {
/*         shoppingItems.innerHTML += `
        <li class="allItems" id=shop_${item._id}><input type="text" value="${item.quantity}"/> ${item.name}  <button class="delShopping" onClick="deleteShoppingItem(this.id)" id=btn_${item._id}><i class="fa fa-times" aria-hidden="true"></i></button></li>
        ` */
        
        let containItems = document.createElement('div')
        containItems.className = 'containItems'

        let newLi = document.createElement('li')
        newLi.classList.add('allItems')
        newLi.setAttribute('id', `shop_${item._id}`)
        

        let quanInput = document.createElement('input')
        quanInput.setAttribute('type', 'text')
        quanInput.setAttribute('value', `${item.quantity}`)
        quanInput.setAttribute('id', `sItem_${item._id}`)
        newLi.innerText = `${item.name}`


        newLi.addEventListener('click', () => {
            crossOff(item._id)
        })

        let newButton = document.createElement('button')
        newButton.classList.add("delShopping")
        newButton.addEventListener('click', () => deleteShoppingItem(item._id))
        // newButton.onclick = deleteShoppingItem(item._id)
        newButton.setAttribute('id', `btn_${item._id}`)

        let newIcon = document.createElement('i')
        newIcon.classList.add('fa')
        newIcon.classList.add('fa-times')

        newButton.appendChild(newIcon)

        newLi.appendChild(newButton)

        containItems.appendChild(quanInput)
        containItems.appendChild(newLi)

        shoppingItems.appendChild(containItems)

/*         let liToCross = document.querySelector(`shop_${item._id}`)
        if(item.complete == true){
            console.log('in item.complete')
            liToCross.style.textDecoration = 'line-through'
        }else{
            liToCross.style.textDecoration = 'none'
        } */
    })

    checkQuantities()

}

const crossOff = async(id) => {
    let currentIsComplete
    await fetch(`${shoppingUrl}/${id}`)
    .then(response => response.json())
    .then(data => {
        currentIsComplete = data.complete

        if(currentIsComplete == true){
            currentIsComplete = false
        }else{
            currentIsComplete = true
        }
    })

    let editedItem = {
        complete: currentIsComplete,
    }


    let postUrl = `${shoppingUrl}/${id}`
    const rawResponse = await fetch(postUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedItem)
    });

    const content = await rawResponse.json();
    console.log(content)

    let shoppingItem = document.querySelector(`#shop_${id}`)
    if(shoppingItem.style.textDecoration == 'line-through'){
        shoppingItem.style.textDecoration = 'none'
    }else {
        shoppingItem.style.textDecoration = 'line-through'
    }

}




let inputQuantity = document.querySelector('#inputQuantity')
let inputItem = document.querySelector('#inputItem')
let addListBtn = document.querySelector('#addListBtn').addEventListener('click', () => {
    addShoppingItem()
})

const addShoppingItem = async() => {
    let quanVal = inputQuantity.value
    let itemVal = inputItem.value

    let newRecipe = {
        name: itemVal,
        quantity: quanVal,
        complete: false
    }

    const rawResponse = await fetch(shoppingUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRecipe)
    });
    const content = await rawResponse.json();

    console.log(content)
    if (content) {
        inputQuantity.value = ""
        inputItem.value = ""
        shoppingItems.innerHTML = ""
        retrieveAllShopping()
    }

}

deleteShoppingItem = async (id) => {

    await fetch(`${shoppingUrl}/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    shoppingItems.innerHTML = ""

    retrieveAllShopping()
}

let updateBtn = document.querySelector('#updateBtn').addEventListener('click', () => {
    checkQuantities()
})

const checkQuantities = async() => {
    //let li = document.querySelectorAll(".allItems")
    await fetch(`${shoppingUrl}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        data.forEach((item, index) => {
            let toUpdate = document.querySelector(`#sItem_${item._id}`).value
            let liToCross = document.querySelector(`#shop_${item._id}`)
/*             if(styleOfItem == 'none'){
                styleOfItem = 'line-through'
            }else{
                styleOfItem = 'none'
            } */

            if(item.complete == true){
                liToCross.style.textDecoration = 'line-through'
            }else{
                liToCross.style.textDecoration = 'none'
            }
            if(item.quantity != toUpdate){
                updateQuantities(item._id, toUpdate, item.complete)
                
            }
        })
        
    })


}

const updateQuantities = async(id, toUpdate, isCompleted) => {
    console.log(toUpdate)
    let editedItem = {
        quantity: toUpdate,
    }

    let postUrl = `${shoppingUrl}/${id}`
        const rawResponse = await fetch(postUrl, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editedItem)
        });

        const content = await rawResponse.json();
    
}



let closeBtn = document.querySelector('#closeBtn').addEventListener('click', () => {
    shoppingList.style.display = 'none'
})

retrieveAllShopping()





//Add new todo function
// const addNewTodo = async () => {
//     console.log('in addNewTodo')
//     let todoTitle = document.querySelector("#todoInput").value
//     let todoCategory = document.querySelector("#categoryInput").value

//     let newTodo = {
//         todo: todoTitle,
//         complete: false,
//         category: todoCategory
//     }

//     console.log(newTodo)
//     const rawResponse = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newTodo)
//     });
//     const content = await rawResponse.json();

//     console.log(content)
//     if (content) {
//         retrieveAll()
//     }

// }

//GET SPECIFIC TODO
// fetch(`${url}/${id}`)
// .then(response => response.json())
// .then(data => {
//     completeTodo(data)
// })


//UPDATE COMPLETE TODO
// fetch(`${url}/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify({
//         complete: isComplete
//     }),
//     headers: {
//         "Content-type": "application/json; charset=UTF-8"
//     }
// })
// .then(response => response.json())
// .then(json => console.log(json))


//DELETE TODO
// fetch(`${url}/${id}`, {
//     method: 'DELETE',
//     headers: {
//         "Content-type": "application/json; charset=UTF-8"
//     }
// })

retrieveAll()