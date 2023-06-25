import "@fortawesome/fontawesome-free/js/all";
import { Modal, Collapse } from "bootstrap";
import "./css/bootstrap.css";

import CaloriesTracker from "./Tracker";
import Storage from "./Storage";
import { Meal, Workout } from "./Item";

class App {
  constructor() {
    this._tracker = new CaloriesTracker();
    this._tracker.loadItems();
    // add event listeners and bind this
    document
      .getElementById("add-meal")
      .addEventListener("submit", this._newItem.bind(this, "meal"));
    document
      .getElementById("add-workout")
      .addEventListener("submit", this._newItem.bind(this, "workout"));

    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));

    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));

    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));

    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));

    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));

    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();
    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // input validation
    if (!name.value || !calories.value) {
      alert("Please fill all fields");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, Number(calories.value));
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, Number(calories.value));
      console.log(workout);
      this._tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";

    //close add meal collapse
    const converted = type.slice(0, 1).toUpperCase() + type.slice(1);
    const addItemCollapse = document.getElementById(`Add-${converted}`);
    const bsCollapse = new Collapse(addItemCollapse, {
      toggle: true,
    });
  }

  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      const id = e.target.closest(".card").getAttribute("data-id");
      if (confirm("Are you sure?")) {
        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);

        // remove item from the DOM
        e.target.closest(".card").remove();
      }
    }
  }
  _filterItems(type, e) {
    const value = e.target.value.toLowerCase();
    document.querySelectorAll(`#${type}-items .card`).forEach((meal) => {
      const mealName = meal.firstElementChild.firstElementChild.textContent;
      if (mealName.includes(value)) {
        meal.style.display = "block";
      } else {
        meal.style.display = "none";
      }
    });
  }

  _reset() {
    this._tracker.reset();
    // remove meal and workout items from DOM
    document.getElementById("meal-items").innerHTML = "";
    document.getElementById("workout-items").innerHTML = "";
  }

  _setLimit(e) {
    e.preventDefault();
    const limit = document.getElementById("limit");
    this._tracker.setLimit(Number(limit.value));

    // set calorie limit in local storage
    Storage.setCalorieLimit(limit.value);

    //close limit modal
    const limitModal = document.getElementById("limit-modal");
    const bsModal = Modal.getInstance(limitModal);
    bsModal.hide();
  }
}

const app = new App();
