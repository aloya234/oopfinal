document.addEventListener("DOMContentLoaded", () => {
    displayFavoriteMeals();
    fetchMeals();  // Fetch meals on page load
});

// Fetch meals from TheMealDB API
function fetchMeals() {
    var apiUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='; // Endpoint to fetch meals
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayMeals(data.meals);
        })
        .catch(error => console.error("Error fetching meals:", error));
}

// Display meals from TheMealDB API
function displayMeals(meals) {
    var mealContainer = document.getElementById('meal-container');
    mealContainer.innerHTML = '';

    meals.forEach(meal => {
        var mealDiv = document.createElement('div');
        mealDiv.classList.add('meal-item');

        // Meal name and image
        mealDiv.innerHTML = `
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" width="150">
            <p>${meal.strMeal}</p>
            <button onclick="addMeal('${meal.strMeal}', '${meal.strMealThumb}')">Add to Meal Planner</button>
        `;

        mealContainer.appendChild(mealDiv);
    });
}

// Create: Add meal to Meal Planner with image
function addMeal(mealName, mealImage) {
    var meals = getMealsFromStorage();
    
    // Check if the meal is already in the list
    if (meals.some(meal => meal.name === mealName)) {
        alert("This meal is already in your planner.");
        return;
    }
    
    meals.push({ name: mealName, image: mealImage });
    localStorage.setItem('favoriteMeals', JSON.stringify(meals));
    displayFavoriteMeals();  // Update displayed favorite meals
}

// Read: Display favorite meals
function displayFavoriteMeals() {
    var meals = getMealsFromStorage();
    var mealList = document.getElementById('favorite-meals-list');
    mealList.innerHTML = '';

    meals.forEach((meal, index) => {
        var li = document.createElement('li');

        // Meal image and name
        li.innerHTML = `
            <img src="${meal.image}" alt="${meal.name}" width="50">
            <span>${meal.name}</span>
        `;

        // Delete button for each meal
        var deleteButton = document.createElement('button');
        deleteButton.textContent = "Remove";
        deleteButton.onclick = () => removeMeal(index);

        li.appendChild(deleteButton);
        mealList.appendChild(li);
    });
}

// Delete: Remove meal from Meal Planner
function removeMeal(index) {
    var meals = getMealsFromStorage();
    meals.splice(index, 1);
    localStorage.setItem('favoriteMeals', JSON.stringify(meals));
    displayFavoriteMeals();
}

// Utility function to get meals from localStorage
function getMealsFromStorage() {
    return JSON.parse(localStorage.getItem('favoriteMeals')) || [];
}
