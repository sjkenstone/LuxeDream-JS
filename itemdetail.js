const productId = getUrlParameter('prodId');

displaySelectItem(rawdata);

function getUrlParameter(value) {
  const getUrl = window.location.search;
  const urlParams = new URLSearchParams(getUrl);
  console.log(urlParams.get(value));
  return urlParams.get(value);
}

function displaySelectItem(dataParams) {
  let product = '';
  dataParams.forEach(function (item) {
    if (item.prodId == productId) {
      const preLink = `https://storage.googleapis.com/luxe_media/wwwroot/${item.productMedia[0].url}`;

      const selectItemTemplate = `
      <div id="item-title" class="px-5 mt-5 mb-3">
        <h5>${item.title}</h5>
      </div>
      <div id="img-dec-wrap" class="row w-100 px-5 m-0">
        <div id="item-image" class="col-12 col-lg-6 px-0">
          <img src="${preLink}">
        </div>
        <div id="item-description"class="col-12 col-lg-6">
          <p>
            ${item.description}
          </p>
          <p id="item-price">
            <h6>$${item.price}</h6>
          </p>
        </div>
        <div class="text-center mt-lg-5 mt-2">
          <a href="./index.html" class="btn btn-primary">Go Back</a>
        </div>
      </div>
    `;

      product += selectItemTemplate;
    }
  });
  document.getElementById('wrap').innerHTML = product;
}
