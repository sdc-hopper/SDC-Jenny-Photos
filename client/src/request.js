const photos = (productId) => {
  return fetch(`http://localhost:4002/photos/id/${productId}`)
  .then(res => res.json())
  .then((productPhotos) => {
    return productPhotos;
    // this.setState({
    //   productId: productId,
    //   primaryPhotoUrl: productPhotos.primaryUrl,
    //   productPhotosUrls: productPhotos.productUrls
    // });
  })
  .catch(error => {
    let productPhotos = ['https://via.placeholder.com/640x480?text=Unable+to+get+primary+product+image'];
    for (let i = 2; i <= 5; i++) {
      productPhotos.push(`https://via.placeholder.com/640x480?text=Unable+to+get+product+image+${i}`);
    };
    return productPhotos;
    // this.setState({
    //   productId: null,
    //   primaryPhotoUrl: 'https://via.placeholder.com/640x480?text=Unable+to+get+primary+product+image',
    //   productPhotosUrls: productPhotos
    // });
  });
};

export default { photos };