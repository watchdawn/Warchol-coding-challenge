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

    const productReader = new FileReader();
    productReader.addEventListener('load', function (event) {
      const text = event.target.result;
      parseProductCsv(text);
    });

    const usageReader = new FileReader();
    usageReader.addEventListener('load', function (event) {
      const text = event.target.result;
      parseUsageCsv(text);
      compactParseUsageArray(usageArray);
    });

    productReader.readAsText(csvCategories);
    usageReader.readAsText(csvAmounts);
  };

//parse data

function parseProductCsv(str) {
    key = new Array('Products', 'Categories');
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
  key = new Array('Products', 'Usage'); // add 'Usage' to array
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

let compactUsageArray = [{ Products: '', Usage: null }];

// combine usage array entries so there is only one per product
function compactParseUsageArray(usageArray) {
  for (let object of usageArray) {
    let flag = false;
    // console.log('I have entered the first loop');
    // console.log(object.Products);
    for (let bit of compactUsageArray) {
      //   console.log('i have entered the second loop');
      if (object.Products !== bit.Products) {
        flag = false;
      } else if (object.Products === bit.Products) {
        flag = true;
      }
    }
    // console.log(flag);
    if (flag === true) {
      //   console.log('i have left the second loop');
      //   console.log('the same');
      let objectIndex = compactUsageArray.findIndex(
        (bit) => bit.Products === object.Products
      );
      //   console.log(objectIndex);
      compactUsageArray[objectIndex].Usage =
        compactUsageArray[objectIndex].Usage + object.Usage;
    } else if (flag === false) {
      compactUsageArray.push(object);
      //   console.log('different');
    }
  }
  compactUsageArray.shift();
  console.log(compactUsageArray);
}

//combine the arrays
//const combinedArray = productArray.map()
function combineArrays() {
    //select item from productArray
    for (let product of productArray) {
        let flag2 = null;
        //select item  from compactUsage Array and compare the object.Product looking for match
      for (let bit of compactUsageArray) {
        if (product.Products !== bit.Products) {
          flag2 = false;
        } else if (product.Products === bit.Products) {
          flag2 = true;
          break;
        }
      }
      // take usage amount from usageArray and add it to productArray
      if (flag2 === true) {
        let objectUsage = compactUsageArray.findIndex(
            (bit) => bit.Products === product.Products
          );
        product.Usage = compactUsageArray[objectUsage].Usage;
        //If product is not in compactUsageArray assign usage value to zero
      } else if (flag2 === false) {
          product.Usage = 0;
      };
    }
    console.log(productArray);

    commonCompUsage();
    antiBodyUsage();
}

//rank Categories by amount of usage (greatest to least)

//top used product in "Common Compounds"
function commonCompUsage() {
    let currentMax = null;
    let currentMaxObj = null;
    for (let product of productArray) {
        //sort out based on category
        if (product.Categories === 'Common Compounds') {
            //compare most used
            if (currentMax < product.Usage) {
                currentMax = product.Usage;
                currentMaxObj = product
            }
        }
    }
    console.log(currentMaxObj)
};

//top used product in "Antibody"
function antiBodyUsage() {
    let currentMax = null;
    let currentMaxObj = null;
    for (let product of productArray) {
        //sort out based on category
        if (product.Categories === 'Antibody') {
            //compare most used
            if (currentMax < product.Usage) {
                currentMax = product.Usage;
                currentMaxObj = product
            }
        }
    }
    console.log(currentMaxObj)
};


function outPutData(event) {
    event.preventDefault();
    console.log('button clicked');
    combineArrays();
  }

//Button activation
submitButton.addEventListener('click', readFile.bind());
dataButton.addEventListener('click', outPutData.bind());
