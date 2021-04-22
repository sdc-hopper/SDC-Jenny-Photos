const fetchWithTimeout = async (resource, options) => {
  const { timeout = 4000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal
  });
  clearTimeout(id);

  return response;
};

const photos = async (productId) => {

  try {
    const response = await fetchWithTimeout(`http://ec2-3-20-63-46.us-east-2.compute.amazonaws.com:4002/photos/id/${productId}`, {
    // const response = await fetchWithTimeout(`http://localhost:4002/photos/id/${productId}`, {
      timeout: 3000
    });
    const productPhotosInfo = await response.json();
    return productPhotosInfo;
  } catch (error) {
    let productPhotos = ['https://via.placeholder.com/640x480?text=Unable+to+get+primary+product+image'];
    for (let i = 2; i <= 5; i++) {
      productPhotos.push(`https://via.placeholder.com/640x480?text=Unable+to+get+product+image+${i}`);
    };
    let errorProductPhotos = {
      primaryUrl: productPhotos[0],
      productUrls: productPhotos,
    }
    return errorProductPhotos;
  }

};

const productInfo = async (productId) => {

  try {
    const response = await fetchWithTimeout(`http://ec2-3-20-63-46.us-east-2.compute.amazonaws.com:4004/description/${productId}`, {
    // const response = await fetchWithTimeout(`http://localhost:4004/description/${productId}`, {
      timeout: 3000
    });
    const productInfo = await response.json();
    let rawItemInfo = productInfo[0];
    let itemInfo = {
      name: rawItemInfo.itemName,
      color: rawItemInfo.itemColor,
      configuration: rawItemInfo.configuration[0]
    };
    return itemInfo;
  } catch (error) {
    let itemInfo = {
      name: 'unable to get item\'s name',
      color: 'unable to get item\'s color',
      configuration: 'unable to get item\'s configuration'
    };
    return itemInfo;
  }

};

export default { photos, productInfo };