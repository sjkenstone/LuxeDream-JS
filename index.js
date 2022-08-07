let itemArray = [];
let filterData = trimData(rawdata);
const cateId = document.getElementById('categoryId');
const priceRange = document.getElementById('price-filter');

initalStatus();

function initalStatus() {
  if (hasQueryParams()) {
    let cateId = getUrlParameter('categoryId');
    let price = getUrlParameter('priceRange');
    //display ddata with url including query params
    displayCategoryList();
    categoryFilter(cateId, price);
  } else {
    itemArray = filterData;

    displayCategoryList();
    displayData(filterData);
    
  }
}

function filterFunction(item) {
  if (item === 'cateFilter') {
    categoryFilter();
    setUrlParams('categoryId', cateId.value);
  }
  
  if (item === 'priceFilter') {
    priceFilter();
    setUrlParams('priceRange', priceRange.value);
  }

  if (item === 'ascending') {
    ascFunc();
    setUrlParams('sort', 'Ascending');
  }

  if (item === 'decending') {
    decFunc();
    setUrlParams('sort', 'Decending');
  }

  if (item === 'resetFilter') {
    resetFilterFunc();
  }
}

//trim rawdata
function trimData(dataSet) {
  let tempArr = [];

  dataSet.forEach(function (item) {
    if (item.productMedia.length != 0) {
      tempArr.push(item);
    }
  });
  return tempArr;
}

function displayCategoryList() {
  const categoryList = categorySet(filterData);
  let option = `<option value="0">All Hires</option>`;
  
  categoryList.forEach(function (item) {
    const template = `
    <option value="${item.categoryId}">${item.category.categoryName}</option>
  `;
    option += template;
  });
  document.getElementById('categoryId').innerHTML = option;
}

function categorySet(dataSet) { //dataSet: filterData
  let tempArr = [];

  let uniqueItem = [];
  dataSet.forEach(function (item) { 
    if(item.category != null) {
      tempArr.push(item);
    }
  });
  // remove duplicate item in tempArr;
  let uniqueCategoryItem = tempArr.filter(function (item) {
    let isDuplicate = uniqueItem.includes(item.categoryId);

    if (!isDuplicate) {
      uniqueItem.push(item.categoryId);

      return true;
    }
    return false;
  });
  //trim category
  let trimCategory = uniqueCategoryItem.sort(function (itemA, itemB) {
    return (itemA.categoryId - itemB.categoryId);
  });
  return trimCategory;
}

function displayData(dataSet) {
  let products = '';

  dataSet.forEach(function (item) {

      const preLink = `https://storage.googleapis.com/luxe_media/wwwroot/${item.productMedia[0].url}`

      const itemTemplate =
        `
      <div id="content" class="col-12 col-md-6 col-xl-3 mb-4">
            <a href="./itemdetail.html?prodId=${item.prodId}" style="text-decoration: none;">
              <div class="card">
                <div id="image">
                  <img class="card-img-top" src="${preLink}" alt="">
                </div>
                <div class="card-body">
                  <p class="card-text">${item.title}</p>
                  <p id="card-text-price" class="card-text">$${item.price}</p>
                </div>
              </div>
            </a>
          </div>
      `;
      products += itemTemplate;
  });
  document.getElementById('wrap').childNodes[1].innerHTML = products;
} 

function categoryFilter(urlId, urlPrice) {
  itemArray = [];

  if (urlId == null) { //if url does not contain categoryId params
    if (cateId.value == 0) {

      itemArray = filterData;
      priceFilter(urlPrice);

    } else {
      filterData.forEach(function (item) {
        if (item.categoryId == cateId.value) {
          itemArray.push(item);
        }
      });
      priceFilter(urlPrice);
    }
    
  } else if(urlId == 0) { //if url categoryId equal 0
    itemArray = filterData;
    priceFilter(urlPrice);
  } else {
    filterData.forEach(function (item) {
      if (item.categoryId == urlId) {
        itemArray.push(item);
      }
    });
    priceFilter(urlPrice);
  }
}

function priceFilter(urlPrice) {
  let tempArr = [];
    
  itemArray.forEach(function (item) {    
    if (urlPrice == null) { //judge url has urlPrice params

      tempArr = priceFilterMethod(priceRange.value, tempArr, item); //display dropdown selection price
    
    } else {
     
      tempArr = priceFilterMethod(urlPrice, tempArr, item); //display url priceRange params price
    
    }
  });

  if(tempArr.length == 0) {//if no data in the range, display warning
    displayNothing();
  } else {
    displayData(tempArr);
    return tempArr;
  }
}

function priceFilterMethod(price, tempArr, item) {
  if (price == 0 && item.productMedia.length != 0) { //remove the empty value in productMedia of object
    tempArr.push(item);
  }
  if (price == 100 && item.price <= 100) {
    tempArr.push(item);
  }
  if (price == 500 && item.price >= 101 && item.price <= 500) {
    tempArr.push(item);
  }
  if (price == 1000 && item.price >= 501 && item.price <= 1000) {
    tempArr.push(item);
  }
  if (price == 1001 && item.price >= 1001) {
    tempArr.push(item);
  }
  return tempArr;
}

//data ascending
function ascFunc() {
  let tempArr = [];
  tempArr = priceFilter().sort(function (itemA, itemB) {
    return (itemA.price - itemB.price);
  });
  console.log('Ascending - tempArr', tempArr);
  displayData(tempArr);
}

//data decending
function decFunc() {
  let tempArr = [];
  tempArr = priceFilter().sort(function (itemA, itemB) {
    return (itemB.price - itemA.price);
  });
  console.log('Decending - tempArr', tempArr);
  displayData(tempArr);
}

//reset filter
function resetFilterFunc() {
  itemArray = filterData;
  cateId.value = 0;
  priceRange.value = 0;
  deleteUrlParameter('categoryId');
  deleteUrlParameter('priceRange');
  deleteUrlParameter('sort');
  displayData(itemArray);
}

function displayNothing() {
  document.getElementById('wrap').childNodes[1].innerHTML = `<p>No product in this range</p>`;
}

function setUrlParams(key, value) {
  const item_url = new URL(window.location.href);
  if (value != 0) {
    item_url.searchParams.set(key, value);
    window.history.pushState({ path: item_url.href }, '', item_url.href);
  } else { //if categorId = 0 or priceRange = 0, delete url query params 
    deleteUrlParameter(key);
  }
}

function getUrlParameter(value) {
  const getUrl = window.location.search;
  const urlParams = new URLSearchParams(getUrl);
  
  return urlParams.get(value);
}

function deleteUrlParameter(key) {
  const url = new URL(window.location.href);

  url.searchParams.delete(key);
  window.history.pushState({ path: url.href }, '', url.href);
}

function hasQueryParams() {
  const url = window.location.search;
  return url.includes('?');
}