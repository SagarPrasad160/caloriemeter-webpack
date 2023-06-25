class Storage {
  static getCalorieLimit(limit = 2000) {
    let calorieLimit;
    if (localStorage.getItem("calorieLimit")) {
      calorieLimit = localStorage.getItem("calorieLimit");
    } else {
      calorieLimit = limit;
    }
    return calorieLimit;
  }
  static setCalorieLimit(limit) {
    localStorage.setItem("calorieLimit", limit);
  }

  static getTotalCalories(calories = 0) {
    let totalCalories;
    if (localStorage.getItem("totalCalories")) {
      totalCalories = +localStorage.getItem("totalCalories");
    } else {
      totalCalories = +calories;
    }
    return totalCalories;
  }

  static updateTotalCalories(calories) {
    localStorage.setItem("totalCalories", calories);
  }

  static getMeals() {
    let meals;
    if (localStorage.getItem("meals")) {
      meals = JSON.parse(localStorage.getItem("meals"));
    } else {
      meals = [];
    }
    return meals;
  }

  static getWorkouts() {
    let workouts;
    if (localStorage.getItem("workouts")) {
      workouts = JSON.parse(localStorage.getItem("workouts"));
    } else {
      workouts = [];
    }
    return workouts;
  }

  static saveMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static saveWorkout(workout) {
    const workouts = Storage.getWorkouts();
    workouts.push(workout);
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }

  static removeMeal(id) {
    const meals = Storage.getMeals();
    meals.forEach((meal, index) => {
      if (meal.id === id) {
        meals.splice(index, 1);
      }
    });
    localStorage.setItem("meals", JSON.stringify(meals));
  }

  static removeWorkout(id) {
    const workouts = Storage.getWorkouts();
    workouts.forEach((workout, index) => {
      if (workout.id === id) {
        workouts.splice(index, 1);
      }
    });
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }
  static clearAll() {
    localStorage.removeItem("totalCalories");
    localStorage.removeItem("meals");
    localStorage.removeItem("workouts");
  }
}

export default Storage;
