// Function to fetch meal details based on user input
function fetchMealSuggestions() {
    var category = document.getElementById('category-dropdown').value;
    var ingredient = document.getElementById('ingredient-dropdown').value.toLowerCase();

    if (!category || !ingredient) {
        document.getElementById('meal-info').innerHTML = "<p>Please select both category and ingredient.</p>";
        return;
    }

    document.getElementById('meal-info').innerHTML = "<p>Loading meals...</p>";

    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
        .then(response => response.json())
        .then(data => {
            const mealPromises = data.meals.map(meal =>
                fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`)
                    .then(mealDetails => mealDetails.json())
            );

            return Promise.all(mealPromises);
        })
        .then(mealsData => {
            var filteredMeals = mealsData.filter(mealData => {
                var ingredients = getIngredientsListArray(mealData.meals[0]);
                return ingredients.includes(ingredient);
            });

            var mealInfo = document.getElementById('meal-info');
            mealInfo.innerHTML = '';

            if (filteredMeals.length > 0) {
                filteredMeals.forEach(meal => displayMealDetails(meal.meals[0]));
            } else {
                mealInfo.innerHTML = "<p>No meals found with the selected category and ingredient.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching meal suggestions:", error);
            document.getElementById('meal-info').innerHTML = "<p>Error fetching meal suggestions. Please try again later.</p>";
        });
}

// Fetch categories for dropdown
function fetchCategories() {
    var categoryDropdown = document.getElementById('category-dropdown');
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list')
        .then(response => response.json())
        .then(data => {
            data.meals.forEach(category => {
                var option = document.createElement('option');
                option.value = category.strCategory;
                option.textContent = category.strCategory;
                categoryDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching categories:", error);
        });
}

// Fetch ingredients for dropdown
function fetchIngredients() {
    var ingredientDropdown = document.getElementById('ingredient-dropdown');
    fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list')
        .then(response => response.json())
        .then(data => {
            data.meals.forEach(ingredient => {
                var option = document.createElement('option');
                option.value = ingredient.strIngredient;
                option.textContent = ingredient.strIngredient;
                ingredientDropdown.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error fetching ingredients:", error);
        });
}

// Get ingredients as an array from meal object
function getIngredientsListArray(meal) {
    var ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) ingredients.push(ingredient.toLowerCase());
    }
    return ingredients;
}

// Display meal details
function displayMealDetails(meal) {
    var mealInfo = document.getElementById('meal-info');
    mealInfo.innerHTML += `
        <h2>${meal.strMeal}</h2>
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Area:</strong> ${meal.strArea}</p>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="300">
        <p><strong>Ingredients:</strong></p>
        <ul>${getIngredientsList(meal)}</ul>
        <p><strong>Instructions:</strong></p>
        <ul>${getInstructionsList(meal.strInstructions)}</ul>
        ${meal.strYoutube ? `<p><a href="${meal.strYoutube}" target="_blank">Watch on YouTube</a></p>` : ""}
    `;
}

// Generate ingredient list for display without bullet points
function getIngredientsList(meal) {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        var ingredient = meal[`strIngredient${i}`];
        var measure = meal[`strMeasure${i}`];
        if (ingredient) {
            ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        }
    }
    return ingredientsList;
}

// Function to split instructions into steps with bullet points
function getInstructionsList(instructions) {
    var steps = instructions.split('.').filter(step => step.trim() !== '');
    return steps.map((step, index) => `<li>${index + 1}. ${step.trim()}</li>`).join('');
}

// Initialize dropdowns on page load
fetchCategories();
fetchIngredients();
