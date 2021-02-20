const photos = (productId) => {
  return fetch(`http://ec2-3-136-203-39.us-east-2.compute.amazonaws.com:4002/photos/id/${productId}`)
  .then(res => res.json())
  .then(productPhotos => {
    return productPhotos;
  })
  .catch(error => {
    let productPhotos = ['https://via.placeholder.com/640x480?text=Unable+to+get+primary+product+image'];
    for (let i = 2; i <= 5; i++) {
      productPhotos.push(`https://via.placeholder.com/640x480?text=Unable+to+get+product+image+${i}`);
    };
    return productPhotos;
  });
};

const productInfo = (productId) => {
  return fetch((`http://localhost:4004/description/${productId}`))
  .then(res => res.json())
  .then((response) => {
    let rawItemInfo = response[0];
    let itemInfo = {
      name: rawItemInfo.itemName,
      color: rawItemInfo.itemColor,
      configuration: rawItemInfo.configuration[0]
    };
    return itemInfo;
  });
}

export default { photos, productInfo };