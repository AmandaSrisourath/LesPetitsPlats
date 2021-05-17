import "bootstrap";
import recipesData from "./recipes.js";

let ingredients;
let appliances;
let ustensils;

const ingredientsFilter = [];

function bindInput() {
    const input = document.querySelector("#research");
    input.addEventListener("keyup", function(event) {
        let inputValue = event.target.value;
        if (inputValue.length >= 3) {
            filterAndCreateRecipes(inputValue);
        } else {
            displayRecipes();
        }
    });
}

function filterAndCreateRecipes(text, recipes = recipesData) {
    let newRecipes = [];
    recipes.forEach((recipe) => {
        const name = recipe.name;
        const description = recipe.description;
        const ingredients = recipe.ingredients;
        const regex = new RegExp(text, 'i');

        if (name.match(regex)) {
            newRecipes.push(recipe);
            return;
        }

        if (description.match(regex)) {
            newRecipes.push(recipe);
            return;
        }

        ingredients.forEach((ingredient) => {
            const ingredientName = ingredient.ingredient;
            if (ingredientName.match(regex)) {
                newRecipes.push(recipe);
            }
        });
    });
    displayRecipes(newRecipes);
}

function displayRecipes(recipes = recipesData) {
    const recipesDiv = document.getElementById("recipes");
    recipesDiv.innerHTML = "";

    if (recipes.length === 0) {
        recipesDiv.innerHTML = 'Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.';
        return;
    }

    recipes.forEach((recipe) => {
        const divRecipes = document.querySelector("#recipes");
        const div = document.createElement("div");

        const divIngredients = document.createElement("div");
        const recipeIngredients = recipe.ingredients;
        recipeIngredients.forEach((ingredient) => {
            const div = document.createElement("div");
            div.classList.add("ingredients");
            div.innerHTML = `<div class="ingredients-quantity"><span>${ingredient.ingredient}:</span> ${ingredient.quantity} ${ingredient.unit || ''}</div>`;
            divIngredients.appendChild(div);
        });

        div.classList.add("the-recipe");
        div.innerHTML = `<div class="col">
                        <div class="recipe-content rounded mb-4">
                            <div class="name-time">
                                <div class="recipe-name">${recipe.name}</div>
                                <div class="time">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                    </svg>
                                    ${recipe.time} min
                                </div>
                            </div>
                            <div class="realisation">
                                ${divIngredients.outerHTML}
                                <p class="preparation col-6">${recipe.description}</p>
                            </div>
                        </div>
                    </div>`;
        divRecipes.appendChild(div);
    });
    updateDropdowns(recipes);
}

function dropdownOpen() {
    const dropdown = document.querySelectorAll(".dropdown-input");
    dropdown.forEach((input) => {
        let dropdownMenu;
        input.addEventListener("focusin", function () {
            let nextElement = input;
            while (nextElement) {
                nextElement = nextElement.nextElementSibling;
                if (nextElement.classList.contains("dropdown-menu")) {
                    nextElement.style.display = "grid";
                    dropdownMenu = nextElement;
                    break;
                }
            }
        });
        input.addEventListener("focusout", function () {
            setTimeout(() => dropdownMenu.style.display = "none", 100);
        });
    });
}

function updateDropdowns(recipes = recipesData) {
    ingredients = [];
    appliances = [];
    ustensils = [];

    const ingredientsDropdown = document.querySelector("#dropdown-menu-ing");
    ingredientsDropdown.innerHTML = "";

    const appliancesDropdown = document.querySelector("#dropdown-menu-app");
    appliancesDropdown.innerHTML = "";

    const ustensilsDropdown = document.querySelector("#dropdown-menu-ust");
    ustensilsDropdown.innerHTML = "";

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            const ingredientIndex = ingredients.findIndex((item) => item.toLowerCase() === ingredient.ingredient.toLowerCase());
            if (ingredientIndex === -1) {
                const a = document.createElement("a");
                a.classList.add("dropdown-item");
                a.innerHTML = ingredient.ingredient;

                ingredientsDropdown.appendChild(a);
                a.onclick = function (event) {
                    let dropdownValue = event.target.innerHTML;
                    // console.log(dropdownValue);
                    ingredientsFilter.push(dropdownValue);
                    const tags = document.querySelector("#tags");
                    const div = document.createElement("div");
                    div.classList.add("container", "rounded", "tag", "color-blue");
                    div.innerHTML = `${dropdownValue}
                                     <i class="far fa-times-circle crosses"></i>`
                    tags.appendChild(div);
                }
                ingredients.push(ingredient.ingredient);
            }
        })

        const applianceIndex = appliances.findIndex((item) => item.toLowerCase() === recipe.appliance.toLowerCase());
        if (applianceIndex === -1) {
            const appliancesLink = document.createElement("a");
            appliancesLink.classList.add("dropdown-item");
            appliancesLink.innerHTML = recipe.appliance;
            appliances.push(recipe.appliance);
            appliancesDropdown.appendChild(appliancesLink);
        }

        recipe.ustensils.forEach((ustensil) => {
            const ustensilIndex = ustensils.findIndex((item) => item.toLowerCase() === ustensil.toLowerCase());
            if (ustensilIndex === -1) {
                const ustensilsLink = document.createElement("a");
                ustensilsLink.classList.add("dropdown-item");
                ustensilsLink.innerHTML = ustensil;
                ustensils.push(ustensil);
                ustensilsDropdown.appendChild(ustensilsLink);
            }
        })
    })
}

function bindIngredients() {
    const dropdownInput = document.querySelector("#ingredients-input");
    dropdownInput.addEventListener("keyup", function (event) {
        let inputValue = event.target.value;
        filterAndCreateIngredients(inputValue);
    });
}

function bindAppliances() {
    const dropdownInput = document.querySelector("#appliances-input");
    dropdownInput.addEventListener("keyup", function (event) {
        let inputValue = event.target.value;
        filterAndCreateAppliances(inputValue);
    });
}

function bindUstensils() {
    const dropdownInput = document.querySelector("#ustensils-input");
    dropdownInput.addEventListener("keyup", function (event) {
        let inputValue = event.target.value;
        filterAndCreateUstensils(inputValue);
    });
}

function filterAndCreateIngredients(text) {
    let newIngredients = [];
    const regex = new RegExp(text, 'i');
    ingredients.forEach((ingredient) => {
        if (ingredient.match(regex)) {
            newIngredients.push(ingredient);
        }
    });
    const ingredientsDropdown = document.querySelector("#dropdown-menu-ing");
    ingredientsDropdown.innerHTML = "";

    newIngredients.forEach((ingredient) => {
        const a = document.createElement("a");
        a.classList.add("dropdown-item");
        a.innerHTML = ingredient;
        ingredientsDropdown.appendChild(a);
    })
}

function filterAndCreateAppliances(text) {
    let newAppliances = [];
    const regex = new RegExp(text, 'i');
    appliances.forEach((appliance) => {
        if (appliance.match(regex)) {
            newAppliances.push(appliance);
        }
    });
    const appliancesDropdown = document.querySelector("#dropdown-menu-app");
    appliancesDropdown.innerHTML = "";

    newAppliances.forEach((appliance) => {
        const appliancesLink = document.createElement("a");
        appliancesLink.classList.add("dropdown-item");
        appliancesLink.innerHTML = appliance;
        appliancesDropdown.appendChild(appliancesLink);
    })
}

function filterAndCreateUstensils(text) {
    let newUstensils = [];
    const regex = new RegExp(text, 'i');
    ustensils.forEach((ustensil) => {
        if (ustensil.match(regex)) {
            newUstensils.push(ustensil);
        }
    })
    const ustensilsDropdown = document.querySelector("#dropdown-menu-ust");
    ustensilsDropdown.innerHTML = "";

    newUstensils.forEach((ustensil) => {
        const ustensilsLink = document.createElement("a");
        ustensilsLink.classList.add("dropdown-item");
        ustensilsLink.innerHTML = ustensil;
        ustensilsDropdown.appendChild(ustensilsLink);
    })
}

const crosses = document.querySelectorAll(".crosses");
crosses.forEach((cross) => cross.addEventListener("click", closeTag));

function closeTag () {
    crosses.style.display = "none";
}

/*
const dropdownItems = document.querySelectorAll(".dropdown-item");
console.log(dropdownItems);
dropdownItems.forEach((elt) => elt.addEventListener("click", function () {

}));

const filterTags = {
    ingredients: [],
    appliances: [],
    ustensils: []
}

filterTags.ingredients.push('Lait de coco');
console.log(filterTags);
*/

function run() {
    dropdownOpen();
    displayRecipes();
    bindInput();
    bindIngredients();
    bindAppliances();
    bindUstensils();
}

run();