console.log('connected to app.js')
const url = "http://localhost:3000/recipes"


//Display all todos
const showRecipes = document.querySelector(".recipes")
const retrieveAll = async () => {
    await fetch(url)
        .then(response => response.json())
        .then(data => {
            organizeInfo(data)
    })
}

//Get a uniq set of categories
const categoryParser = (data) => {
    allCategories = []

    data.forEach(d => {
        allCategories.push(d.category)
    })

    let uniqCategories = [...new Set(allCategories)]

    return uniqCategories
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

        recipeDiv.innerHTML = `
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/203277/oatmeal.jpg" alt="Chai Oatmeal" />
        <div class="card-bottom">
            <h2>${recipe.name}</h2>
            <h3>${recipe.category}</h3>
            ${ratingHtml}
            <p>${recipe.directions}</p>
            <h5>Ingredients</h5>
            <p class="ingredients">${recipe.ingredients}</p>
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
    nameField.value = ""
    descriptionField.value = ""
    categoryField.value = ""
    ingredientList.innerHTML = ""
    directionList.innerHTML = ""
    ingredientInput.value = ""
    directionInput.value = ""
}

const addIngredient = () => {
    let p = document.createElement('li')
    let i = document.createElement('i')
    i.classList.add('fa', 'fa-times-circle')
    i.id = 'deleteIngredient'
    p.innerText = ingredientInput.value
    p.appendChild(i)
    ingredientList.appendChild(p)
    ingredientArr.push(p.innerText)
    console.log(ingredientArr)
}

const addDirection = () => {
    let p = document.createElement('li')
    p.innerText = directionInput.value
    directionList.appendChild(p)
    directionArr.push(p.innerText)
    console.log(directionArr)
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
    // editedRecipe.ingredients.forEach((rec, index) => {
    //     console.log(rec)
    //     let addLi = document.createElement('li')
    //     let i = document.createElement('i')
    //     i.classList.add('fa', 'fa-times-circle', 'delIcon')
    //     i.id = `deleteIngredient${index}`
    //     addLi.innerText = rec
    //     ingredientList.appendChild(addLi)
    //     addLi.appendChild(i)
    //     editIngredientArr.push(rec)
    // })

    directionList.innerHTML = ''
    //Render the ingredient list
    reRenderDirections(id, editedRecipe.directions)
    

}

const reRenderDirections = (id, data) => {
    directionList.innerHTML = ""
    
    data.forEach((rec, index) => {
        let addLi = document.createElement('li')
        let i = document.createElement('i')
        i.classList.add('fa', 'fa-times-circle', 'delIcon')
        i.id = `ingDel@${index}`
        i.addEventListener('click', () => {
            removeDirection(index, id, data)
        })
        addLi.innerText = rec
        directionList.appendChild(addLi)
        addLi.appendChild(i)
        editDirectionArr.push(rec)
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
        let i = document.createElement('i')
        i.classList.add('fa', 'fa-times-circle', 'delIcon')
        i.id = `ingDel@${index}`
        i.addEventListener('click', () => {
            removeIngredient(index, id, data)
        })
        addLi.innerText = rec
        ingredientList.appendChild(addLi)
        addLi.appendChild(i)
        editIngredientArr.push(rec)
    })

}


const removeIngredient = async(index, id, ingArr) => {
    ingArr.splice(index, 1)

    reRenderIngredients(id, ingArr)
}



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