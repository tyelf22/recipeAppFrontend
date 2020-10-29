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
    data.forEach(recipe => {
        let recipeDiv = document.createElement('div')
        recipeDiv.classList.add("recipe-card");

        recipeDiv.innerHTML = `
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/203277/oatmeal.jpg" alt="Chai Oatmeal" />
        <div class="card-bottom">
            <h2>${recipe.name}</h2>
            <h3>${recipe.category}</h3>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star checked"></span>
            <span class="fa fa-star"></span>
            <span class="fa fa-star"></span>
            <p>${recipe.rating}<p>
            <p>${recipe.directions}</p>
            <h5>Ingredients</h5>
            <p class="ingredients">${recipe.ingredients}</p>
        </div>
        <i class="fa fa-arrow-right moreInfo${recipe._id}"></i>
        
        `
        recipeWrapper.appendChild(recipeDiv)
    })



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