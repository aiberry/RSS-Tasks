export default () => {
    const width = document.querySelector('#form-entry').offsetWidth;
    const imageWidth = 200;
    return Math.floor(width / imageWidth);
};
