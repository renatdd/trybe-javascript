/*
eslint no-unused-vars: [
  "error",
  {
    "args": "none",
    "vars": "local",
    "varsIgnorePattern": "data"
  }
]
*/

const data = require('./data');

const { animals, employees, prices, hours } = data;

const animalsByIds = (...ids) => ids.map(id => animals.find(animal => animal.id === id));

const getAnimalByName = animalName => animals.find(animal => animal.name === animalName);

const animalsOlderThan = (animal, age) => {
  const { residents } = getAnimalByName(animal);
  return residents.every(resident => resident.age >= age);
};

const employeeById = id => employees.find(employee => employee.id === id);

const employeeByName = (employeeName) => {
  const foundEmployee = employees.find(employee => Object.values(employee).includes(employeeName));
  return { ...foundEmployee };
};

const createEmployee = (personalInfo, associatedWith) => ({ ...personalInfo, ...associatedWith });

const isManager = (id) => {
  const managersIds = employees.reduce((acc, current) => [...acc, ...current.managers], []);
  return managersIds.includes(id);
};

const addEmployee = (id, firstName, lastName, managers = [], responsibleFor = []) => {
  employees.push({ id, firstName, lastName, managers, responsibleFor });
};

const animalCount = (species) => {
  let countReport = animals.reduce((accObject, current) => {
    accObject[current.name] = current.residents.length;
    return accObject;
  }, {});
  if (Object.keys(countReport).includes(species)) countReport = countReport[species];
  return countReport;
};

const entryCalculator = (entrants = {}) => Object.entries(entrants).reduce(
  (priceAccumulator, currentGroup) => {
    const price = prices[currentGroup[0]];
    const quantity = currentGroup[1];
    return priceAccumulator + (price * quantity);
  }, 0);

const filterResidentsBySex = (sex, residents) => (
  sex ? residents.filter(resident => resident.sex === sex) : residents
  );

const getResidentsNames = residents => residents.reduce((array, currentResident) => {
  array.push(currentResident.name);
  return array;
}, []);

const sortIfEnabled = (sorted, residents) => (
  sorted ? residents.sort() : residents
  );

const makeMapFrom = ({ location, name, residents }) => ({
  name,
  location,
  byOptions({ includeNames = false, sex = false, sorted = false } = {}) {
    if (includeNames) {
      residents = filterResidentsBySex(sex, residents);
      residents = getResidentsNames(residents);
      residents = sortIfEnabled(sorted, residents);
      this.map = { [this.name]: residents };
    }
  },
  accumulateWith(accumulator) {
    const { [location]: locationAnimals = [] } = accumulator;
    this.locationAnimals = locationAnimals;
    this.map = name;
  },
});

const animalMap = options => animals.reduce((mappingObject, currentSpecies) => {
  const speciesMap = makeMapFrom(currentSpecies);
  speciesMap.accumulateWith(mappingObject);
  speciesMap.byOptions(options);
  mappingObject[speciesMap.location] = [...speciesMap.locationAnimals, speciesMap.map];
  return mappingObject;
}, {});

const getReadbleHour = hour => (
  hour > 12 ? `${hour - 12}pm` : `${hour}am`
  );

const getInfoOfTheDay = (day, scheduleObject) => (
  day ? { [day]: scheduleObject[day] } : scheduleObject
  );

const schedule = (dayName) => {
  const scheduleObject = Object.entries(hours).reduce(
    (daysAccumulator, [currentDayName, { open, close }]) => {
      const info = open === 0 ? 'CLOSED' : `Open from ${getReadbleHour(open)} until ${getReadbleHour(close)}`;
      daysAccumulator[currentDayName] = info;
      return daysAccumulator;
    }, {});
  return getInfoOfTheDay(dayName, scheduleObject);
};

const oldestFromFirstSpecies = (id) => {
  const employee = employeeById(id);
  const [firstSpeciesId] = employee.responsibleFor;
  const { residents } = animalsByIds(firstSpeciesId)[0];
  return residents.reduce(
    (oldestArray, currentObject) => {
      const oldestAge = oldestArray[2];
      const { age: currentAge } = currentObject;
      return currentAge > oldestAge ? Object.values(currentObject) : oldestArray;
    }, ['', '', 0]);
};

const increasePrices = (percentage) => {
  const increase = 1 + (percentage / 100);
  Object.keys(prices).forEach((key) => {
    const newValue = parseFloat(prices[key] * increase).toPrecision(15);
    // Reference : https://medium.com/swlh/how-to-round-to-a-certain-number-of-decimal-places-in-javascript-ed74c471c1b8
    const roundedPrice = Number(`${Math.round(`${newValue}e2`)}e-2`);
    data.prices[key] = roundedPrice;
  });
};

const getEmployeesInfo = (employeeInfo) => {
  let employeesQuery;
  if (employeeInfo) {
    employeesQuery = [employeeByName(employeeInfo)];
  } else {
    employeesQuery = employees;
  }
  return employeesQuery;
};

const getAnimalsNamesByIds = animalsIds => animalsByIds(...animalsIds).map(animal => animal.name);

const employeeCoverage = (idOrName) => {
  const employeesQuery = getEmployeesInfo(idOrName);
  return employeesQuery.reduce((employeesObject, { firstName, lastName, responsibleFor }) => {
    employeesObject[`${firstName} ${lastName}`] = getAnimalsNamesByIds(responsibleFor);
    return employeesObject;
  }, {});
};

module.exports = {
  entryCalculator,
  schedule,
  animalCount,
  animalMap,
  animalsByIds,
  employeeByName,
  employeeCoverage,
  addEmployee,
  isManager,
  animalsOlderThan,
  oldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
