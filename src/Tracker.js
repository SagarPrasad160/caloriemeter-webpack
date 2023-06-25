import Storage from "./Storage";

class CaloriesTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories(0);
    console.log(this._totalCalories);
    this._meals = Storage.getMeals();
    this._workouts = Storage.getWorkouts();

    this._displayCalorieLimit();
    this._displayProgressBar();
    this._renderDisplay();
  }

  addMeal(meal) {
    this._meals.push(meal);
    Storage.saveMeal(meal);
    this._totalCalories += Number(meal.calories);
    Storage.updateTotalCalories(this._totalCalories);
    this._renderDisplay();

    this._displayNewMeal(meal);
  }

  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= Number(meal.calories);
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      Storage.removeMeal(id);
      this._renderDisplay();
    }
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    Storage.saveWorkout(workout);
    this._totalCalories -= Number(workout.calories);
    Storage.updateTotalCalories(this._totalCalories);
    this._renderDisplay();
    this._displayNewWorkout(workout);
  }

  _displayNewMeal(meal) {
    const mealsEl = document.getElementById("meal-items");
    const mealEl = document.createElement("div");
    mealEl.classList.add("card", "my-3");
    mealEl.setAttribute("data-id", meal.id);
    mealEl.innerHTML = `
        <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mx-1">${meal.name}</h4>
          <div
            class="bg-primary text-white text-center px-2 px-sm-5 fs-1 rounded-2"
          >
            ${meal.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
        `;

    mealsEl.appendChild(mealEl);
  }

  _displayNewWorkout(workout) {
    const workoutsEl = document.getElementById("workout-items");
    const workoutEl = document.createElement("div");
    workoutEl.setAttribute("data-id", workout.id);
    workoutEl.classList.add("card", "my-3");
    workoutEl.innerHTML = `
        <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mx-1">${workout.name}</h4>
          <div
            class="bg-warning text-white text-center px-2 px-sm-5 fs-1 rounded-2"
          >
            ${workout.calories}
          </div>
          <button class="delete btn btn-danger btn-sm mx-2">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
        `;
    workoutsEl.appendChild(workoutEl);
  }

  loadItems() {
    this._meals.forEach((meal) => this._displayNewMeal(meal));
    this._workouts.forEach((workout) => this._displayNewWorkout(workout));
  }

  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(workout, 1);
      Storage.removeWorkout(id);
      this._renderDisplay();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._renderDisplay();

    // clear local storage
    Storage.clearAll();
  }

  setLimit(limit) {
    this._calorieLimit = limit;
    this._displayCalorieLimit();
    this._renderDisplay();
  }

  _displayCalorieLimit() {
    const calorieLimitEl = document.getElementById("calories-limit");
    calorieLimitEl.innerHTML = this._calorieLimit;
  }

  _displayTotalCalories() {
    const totalCaloriesEl = document.getElementById("calories-total");
    totalCaloriesEl.innerHTML = this._totalCalories;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumedEl = document.getElementById("calories-consumed");
    caloriesConsumedEl.innerHTML = this._meals.reduce((acc, meal) => {
      return acc + meal.calories;
    }, 0);
  }

  _displayCaloriesBurned() {
    const caloriesBurnedEl = document.getElementById("calories-burned");
    caloriesBurnedEl.innerHTML = this._workouts.reduce((acc, workout) => {
      return acc + workout.calories;
    }, 0);
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingEl = document.getElementById("calories-remaining");
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingEl.innerHTML = remaining;

    const progressEl = document.getElementById("progress-bar");

    if (remaining <= 0) {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add(
        "bg-danger"
      );

      progressEl.classList.remove("bg-success");
      progressEl.classList.add("bg-danger");
    } else {
      caloriesRemainingEl.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingEl.parentElement.parentElement.classList.add("bg-light");

      progressEl.classList.remove("bg-danger");
      progressEl.classList.add("bg-success");
    }
  }

  _displayProgressBar() {
    const progressEl = document.getElementById("progress-bar");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const progress = Math.min(percentage, 100);
    progressEl.style.width = `${progress}%`;
  }

  _renderDisplay() {
    this._displayTotalCalories();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayProgressBar();
  }
}

export default CaloriesTracker;
