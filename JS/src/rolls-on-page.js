export default () => {
    const width = document.querySelector('#form-entry').offsetWidth;
    // l('#form-entry width = ' + width);
    const imageWidth = 200;
    return Math.floor(width / imageWidth);
};
