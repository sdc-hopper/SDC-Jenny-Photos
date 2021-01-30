const applyInitialDynamicStyle = (numberOfThumbnailsToStyle) => {
  for (let i = 0; i < numberOfThumbnailsToStyle; i++) {
    if (i === 0) {
      document.getElementById(`${i}`).setAttribute("style", "border: 1px solid #e77600; box-shadow: 0 0 3px 2px rgb(228 121 17 / 50%)");
    } else {
      document.getElementById(`${i}`).setAttribute("style", "border: 1px solid rgba(0, 0, 0, .4);");
    }
  }
  return;
};

const applyPrimaryThumbnailStyle = (previousThumbnail, currentThumbnail) => {
  if (previousThumbnail) {
    document.getElementById(previousThumbnail).setAttribute("style", "border: 1px solid rgba(0, 0, 0, .4); box-shadow: none");
  }
  currentThumbnail.setAttribute("style", "border: 1px solid #e77600; box-shadow: 0 0 3px 2px rgb(228 121 17 / 50%)");
  return;
};


export {
  applyInitialDynamicStyle,
  applyPrimaryThumbnailStyle
};