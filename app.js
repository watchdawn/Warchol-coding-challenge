//access to HTML elements
const csvForm = document.getElementById('fileInputForm');
const csvProductFile = document.getElementById('csvProduct');
const csvUsageFile = document.getElementById('csvUsage');
const submitButton = document.querySelector('button');
const dataButton = document.getElementById('data');

let usageArray = [];
let productArray = [];

//accept data
//read file
function readFile(event) {
  event.preventDefault();

  const csvCategories = csvProductFile.files[0];
  const csvAmounts = csvUsageFile.files[0];

  //read the category and product file
  const productReader = new FileReader();
  productReader.addEventListener('load', function (event) {
    const text = event.target.result;
    parseProductCsv(text);
  });

  //read the product and usage file
  const usageReader = new FileReader();
  usageReader.addEventListener('load', function (event) {
    const text = event.target.result;
    parseUsageCsv(text);
    compactParseUsageArray(usageArray);
  });

  productReader.readAsText(csvCategories);
  usageReader.readAsText(csvAmounts);
}

//parse data
function parseProductCsv(str) {
  key = ['Products', 'Categories'];
  const prodCat = str.trim().split('\n');

  //create new array of items from productCategory sheet so that items are separated by ; rather than ,
  let adjProdCat = [];
  for (let item of prodCat) {
    commaIndex = item.lastIndexOf(',');
    item = item.split('');
    item[commaIndex] = ';';
    item = item.join('');
    adjProdCat.push(item);
  }

  //use map to create new array that has key value pair objects created by reduce
  productArray = adjProdCat.map(function (r) {
    const values = r.trim().split(';');

    const element = key.reduce(function (object, key, index) {
      object[key] = values[index];
      return object;
    }, {});

    return element;
  });

  // console.log(key)
  //console.log(prodCat);
  //console.log(adjProdCat);
  console.log(productArray);
}

function parseUsageCsv(str) {
  key = ['Products', 'Usage'];
  const prodCat = str.trim().split('\n');

  //create new array of items from productCategory sheet so that items are separated by ; rather than ,
  let adjProdCat = [];
  for (let item of prodCat) {
    commaIndex = item.lastIndexOf(',');
    item = item.split('');
    item[commaIndex] = ';';
    item = item.join('');
    adjProdCat.push(item);
  }

  //map the items in adjProdCat to product and usage keys after splitting values on ;
  usageArray = adjProdCat.map(function (r) {
    const values = r.trim().split(';');
    values[1] = parseInt(values[1]);

    const element = key.reduce(function (object, key, index) {
      object[key] = values[index];
      //console.log(object)
      return object;
    }, {});

    return element;
  });

  // console.log(key)
  //console.log(prodCat);
  //console.log(adjProdCat);
  //console.log(usageArray);
}

let compactUsageArray = [];

// combine usage array entries so there is only one per product
function compactParseUsageArray(usageArray) {
  compactUsageArray = Object.entries(
    usageArray.reduce(function (acc, item) {
      if (item.Products in acc) {
        acc[item.Products] += item.Usage;
      } else {
        acc[item.Products] = item.Usage;
      }
      return acc;
    }, {})
  ).map(([key, value]) => ({ Products: key, Usage: value }));

  console.log(compactUsageArray);
}

//combine the arrays
//const combinedArray = productArray.map()
function combineArrays() {
  //select item from productArray
  for (let product of productArray) {
    let flag2 = false;

    //select item  from compactUsage Array and compare the object.Product looking for match
    for (let bit of compactUsageArray) {
      if (product.Products === bit.Products) {
        flag2 = true;
        break;
      }
    }

    // take usage amount from usageArray and add it to productArray
    if (flag2) {
      let objectUsage = compactUsageArray.findIndex(
        (entry) => entry.Products === product.Products
      );
      product.Usage = compactUsageArray[objectUsage].Usage;
      //If product is not in compactUsageArray assign usage value to zero
    } else {
      product.Usage = 0;
    }
  }

  console.log(productArray);

  categoryRanking();
  commonCompMaxUsage();
  antibodyMaxUsage();
}

//rank Categories by amount of usage (greatest to least)
// Categories: Common Compound, Acid, Antibody, Bases
function categoryRanking() {
  let acidUsage = null;
  let antibodyUsage = null;
  let baseUsage = null;
  let commonCompUsage = null;
  let categoryUsage = [];

  for (let product of productArray) {
    //sort out based on category
    if (product.Categories === 'Acid') {
      //add Usages together
      acidUsage = acidUsage + product.Usage;
    } else if (product.Categories === 'Antibody') {
      antibodyUsage = antibodyUsage + product.Usage;
    } else if (product.Categories === 'Bases') {
      baseUsage = baseUsage + product.Usage;
    } else if (product.Categories === 'Common Compounds') {
      commonCompUsage = commonCompUsage + product.Usage;
    }
  }

  // add to array
  categoryUsage.push({ Category: 'Acid', Usage: acidUsage });
  categoryUsage.push({ Category: 'Antibody', Usage: antibodyUsage });
  categoryUsage.push({ Category: 'Bases', Usage: baseUsage });
  categoryUsage.push({ Category: 'Common Compounds', Usage: commonCompUsage });

  //sort array based on usage values
  categoryUsage.sort((a, b) => (a.Usage - b.Usage) * -1);

  console.log(categoryUsage);
}

//top used product in "Common Compounds"
function commonCompMaxUsage() {
  let currentMax = null;
  let currentMaxObj = null;
  for (let product of productArray) {
    //sort out based on category
    if (product.Categories === 'Common Compounds') {
      //compare most used
      if (currentMax < product.Usage) {
        currentMax = product.Usage;
        currentMaxObj = product;
      }
    }
  }
  console.log(currentMaxObj);
}

//top used product in "Antibody"
function antibodyMaxUsage() {
  let currentMax = null;
  let currentMaxObj = null;
  for (let product of productArray) {
    //sort out based on category
    if (product.Categories === 'Antibody') {
      //compare most used
      if (currentMax < product.Usage) {
        currentMax = product.Usage;
        currentMaxObj = product;
      }
    }
  }
  console.log(currentMaxObj);
}

function outPutData(event) {
  event.preventDefault();
  combineArrays();
}

//Button activation
submitButton.addEventListener('click', readFile.bind());
dataButton.addEventListener('click', outPutData.bind());
