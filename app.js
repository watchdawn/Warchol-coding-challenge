//access to HTML elements
const csvForm = document.getElementById('fileInputForm');
const csvProductFile = document.getElementById('csvProduct');
const csvUsageFile = document.getElementById('csvUsage');
const submitButton = document.querySelector('button');

let usageArray = [];
let productArray = [];

//accept data
//read file
function readFile(event) {
  //event.preventDefault();
  const productReader = new FileReader();
  const usageReader = new FileReader();

  //const redFile = 
  return new Promise((resolve) => {
    const csvCategories = csvProductFile.files[0];
    const csvAmounts = csvUsageFile.files[0];

    
    productReader.addEventListener('load', function (event) {
      const text = event.target.result;
      parseProductCsv(text);
    });

    
    usageReader.addEventListener('load', function (event) {
      const text = event.target.result;
      parseUsageCsv(text);
      compactParseUsageArray(usageArray);
      resolve(usageReader.result);
    });

    productReader.readAsText(csvCategories);
    usageReader.readAsText(csvAmounts);
  });
  //return redFile;
}

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
  console.log(compactUsageArray);
}

//combine the arrays
//const combinedArray = productArray.map()
function combineArrays() {
  console.log('product array: ');
  console.log(productArray);
  //   for (let product of productArray) {
  //     for (let bit of compactUsageArray) {
  //       if (product.Products !== bit.Products) {
  //         flag2 = false;
  //       } else if (product.Products === bit.Products) {
  //         flag2 = true;
  //       }
  //     }
  //     if (flag === true) {
  //       product[Usage] = bit.Usage;
  //     } else if (flag === false) {
  //         product[Usage] = 0;
  //     };
  //     //console.log(productArray);
  //   }
}

function outPutData(event) {
  event.preventDefault();
  console.log('button clicked');
  readFile()
  .then(console.log('entering then'))
  .catch(console.log('error'));
}

//rank Categories by amount of usage (greatest to least)

//top used product in "Common Compounds"
//sort out based on category
//compare most used

//top used product in "Antibody"
//sort out based on category
//compare most used

//Button activation
submitButton.addEventListener('click', outPutData.bind());
